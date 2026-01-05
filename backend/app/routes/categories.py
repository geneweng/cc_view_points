from flask import Blueprint, request, jsonify
from app import db
from app.models import Category

categories_bp = Blueprint('categories', __name__)


@categories_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all categories."""
    categories = Category.query.order_by(Category.name).all()
    return jsonify({'categories': [cat.to_dict() for cat in categories]})


@categories_bp.route('/categories/<int:id>', methods=['GET'])
def get_category(id):
    """Get a single category by ID."""
    category = Category.query.get_or_404(id)
    return jsonify({'category': category.to_dict()})


@categories_bp.route('/categories', methods=['POST'])
def create_category():
    """Create a new category."""
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    if 'name' not in data:
        return jsonify({'error': 'Name is required'}), 400

    # Check for duplicate name
    existing = Category.query.filter_by(name=data['name']).first()
    if existing:
        return jsonify({'error': 'Category with this name already exists'}), 400

    category = Category(
        name=data['name'],
        description=data.get('description'),
        icon=data.get('icon'),
        color=data.get('color')
    )

    db.session.add(category)
    db.session.commit()

    return jsonify({'category': category.to_dict()}), 201


@categories_bp.route('/categories/<int:id>', methods=['PUT'])
def update_category(id):
    """Update an existing category."""
    category = Category.query.get_or_404(id)
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    if 'name' in data:
        # Check for duplicate name (excluding current category)
        existing = Category.query.filter(
            Category.name == data['name'],
            Category.id != id
        ).first()
        if existing:
            return jsonify({'error': 'Category with this name already exists'}), 400
        category.name = data['name']

    if 'description' in data:
        category.description = data['description']
    if 'icon' in data:
        category.icon = data['icon']
    if 'color' in data:
        category.color = data['color']

    db.session.commit()

    return jsonify({'category': category.to_dict()})


@categories_bp.route('/categories/<int:id>', methods=['DELETE'])
def delete_category(id):
    """Delete a category."""
    category = Category.query.get_or_404(id)

    db.session.delete(category)
    db.session.commit()

    return jsonify({'success': True})
