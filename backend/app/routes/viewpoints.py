from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
import os
import uuid
from app import db
from app.models import ViewPoint, Photo

viewpoints_bp = Blueprint('viewpoints', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@viewpoints_bp.route('/viewpoints', methods=['GET'])
def get_viewpoints():
    """Get all viewpoints with optional filtering."""
    category_id = request.args.get('category_id', type=int)
    search = request.args.get('search', '')
    limit = request.args.get('limit', 100, type=int)
    offset = request.args.get('offset', 0, type=int)

    query = ViewPoint.query

    if category_id:
        query = query.filter_by(category_id=category_id)

    if search:
        query = query.filter(ViewPoint.name.ilike(f'%{search}%'))

    total = query.count()
    viewpoints = query.order_by(ViewPoint.created_at.desc()).offset(offset).limit(limit).all()

    return jsonify({
        'viewpoints': [vp.to_dict() for vp in viewpoints],
        'total': total
    })


@viewpoints_bp.route('/viewpoints/<int:id>', methods=['GET'])
def get_viewpoint(id):
    """Get a single viewpoint by ID."""
    viewpoint = ViewPoint.query.get_or_404(id)
    return jsonify({'viewpoint': viewpoint.to_dict()})


@viewpoints_bp.route('/viewpoints', methods=['POST'])
def create_viewpoint():
    """Create a new viewpoint."""
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    required_fields = ['name', 'latitude', 'longitude']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400

    viewpoint = ViewPoint(
        name=data['name'],
        description=data.get('description'),
        latitude=data['latitude'],
        longitude=data['longitude'],
        elevation=data.get('elevation'),
        category_id=data.get('category_id'),
        rating=data.get('rating', 0),
        is_public=data.get('is_public', True)
    )

    db.session.add(viewpoint)
    db.session.commit()

    return jsonify({'viewpoint': viewpoint.to_dict()}), 201


@viewpoints_bp.route('/viewpoints/<int:id>', methods=['PUT'])
def update_viewpoint(id):
    """Update an existing viewpoint."""
    viewpoint = ViewPoint.query.get_or_404(id)
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    if 'name' in data:
        viewpoint.name = data['name']
    if 'description' in data:
        viewpoint.description = data['description']
    if 'latitude' in data:
        viewpoint.latitude = data['latitude']
    if 'longitude' in data:
        viewpoint.longitude = data['longitude']
    if 'elevation' in data:
        viewpoint.elevation = data['elevation']
    if 'category_id' in data:
        viewpoint.category_id = data['category_id']
    if 'rating' in data:
        viewpoint.rating = data['rating']
    if 'is_public' in data:
        viewpoint.is_public = data['is_public']

    db.session.commit()

    return jsonify({'viewpoint': viewpoint.to_dict()})


@viewpoints_bp.route('/viewpoints/<int:id>', methods=['DELETE'])
def delete_viewpoint(id):
    """Delete a viewpoint."""
    viewpoint = ViewPoint.query.get_or_404(id)

    # Delete associated photos from filesystem
    for photo in viewpoint.photos:
        try:
            os.remove(os.path.join(current_app.config['UPLOAD_FOLDER'], photo.filename))
        except OSError:
            pass

    db.session.delete(viewpoint)
    db.session.commit()

    return jsonify({'success': True})


@viewpoints_bp.route('/viewpoints/<int:id>/photos', methods=['POST'])
def upload_photo(id):
    """Upload a photo for a viewpoint."""
    viewpoint = ViewPoint.query.get_or_404(id)

    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400

    # Generate unique filename
    original_filename = secure_filename(file.filename)
    ext = original_filename.rsplit('.', 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)

    file.save(file_path)

    # Check if this is the first photo (make it primary)
    is_primary = viewpoint.photos.count() == 0

    photo = Photo(
        viewpoint_id=viewpoint.id,
        filename=filename,
        original_filename=original_filename,
        file_path=file_path,
        caption=request.form.get('caption'),
        is_primary=is_primary
    )

    db.session.add(photo)
    db.session.commit()

    return jsonify({'photo': photo.to_dict()}), 201


@viewpoints_bp.route('/photos/<int:id>', methods=['DELETE'])
def delete_photo(id):
    """Delete a photo."""
    photo = Photo.query.get_or_404(id)

    # Delete file from filesystem
    try:
        os.remove(photo.file_path)
    except OSError:
        pass

    db.session.delete(photo)
    db.session.commit()

    return jsonify({'success': True})


@viewpoints_bp.route('/uploads/<filename>')
def serve_upload(filename):
    """Serve uploaded files."""
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)
