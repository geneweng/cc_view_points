import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { ViewPoint } from '../types';
import { getViewPoint, deleteViewPoint, uploadPhoto, deletePhoto } from '../api/viewpoints';

export default function ViewPointDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [viewpoint, setViewpoint] = useState<ViewPoint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (id) loadViewPoint(parseInt(id));
  }, [id]);

  async function loadViewPoint(vpId: number) {
    try {
      const vp = await getViewPoint(vpId);
      setViewpoint(vp);
    } catch (error) {
      console.error('Failed to load viewpoint:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!viewpoint || !confirm('Are you sure you want to delete this viewpoint?')) return;

    try {
      await deleteViewPoint(viewpoint.id);
      navigate('/viewpoints');
    } catch (error) {
      console.error('Failed to delete viewpoint:', error);
      alert('Failed to delete viewpoint');
    }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!viewpoint || !e.target.files?.length) return;

    setIsUploading(true);
    try {
      const file = e.target.files[0];
      await uploadPhoto(viewpoint.id, file);
      await loadViewPoint(viewpoint.id);
    } catch (error) {
      console.error('Failed to upload photo:', error);
      alert('Failed to upload photo');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handlePhotoDelete(photoId: number) {
    if (!viewpoint || !confirm('Delete this photo?')) return;

    try {
      await deletePhoto(photoId);
      await loadViewPoint(viewpoint.id);
    } catch (error) {
      console.error('Failed to delete photo:', error);
      alert('Failed to delete photo');
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-dark-tertiary rounded w-1/3" />
        <div className="aspect-video bg-dark-tertiary rounded-lg" />
        <div className="h-4 bg-dark-tertiary rounded w-full" />
        <div className="h-4 bg-dark-tertiary rounded w-2/3" />
      </div>
    );
  }

  if (!viewpoint) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Viewpoint not found</h2>
        <Link to="/viewpoints" className="text-accent-primary hover:text-blue-400">
          Back to viewpoints
        </Link>
      </div>
    );
  }

  const primaryPhoto = viewpoint.photos?.find(p => p.is_primary) || viewpoint.photos?.[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            to="/viewpoints"
            className="text-gray-400 hover:text-white text-sm mb-2 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to viewpoints
          </Link>
          <h1 className="text-3xl font-bold text-white">{viewpoint.name}</h1>
          {viewpoint.category && (
            <span
              className="inline-block mt-2 px-3 py-1 rounded text-sm font-medium"
              style={{ backgroundColor: viewpoint.category.color || '#3b82f6' }}
            >
              {viewpoint.category.name}
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <Link
            to={`/viewpoints/${viewpoint.id}/edit`}
            className="px-4 py-2 bg-dark-tertiary text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600/20 text-red-500 rounded-lg hover:bg-red-600/30 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Main Photo */}
      <div className="aspect-video bg-dark-card rounded-lg overflow-hidden border border-gray-800">
        {primaryPhoto ? (
          <img
            src={primaryPhoto.url}
            alt={viewpoint.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <div className="text-center">
              <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>No photos yet</p>
            </div>
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {viewpoint.description && (
            <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-3">Description</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{viewpoint.description}</p>
            </div>
          )}

          {/* Photo Gallery */}
          <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Photos</h2>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-sm text-accent-primary hover:text-blue-400 transition-colors disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : '+ Add Photo'}
              </button>
            </div>
            {viewpoint.photos?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {viewpoint.photos.map((photo) => (
                  <div key={photo.id} className="relative group aspect-square">
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Photo'}
                      className="w-full h-full object-cover rounded-lg cursor-pointer"
                      onClick={() => setSelectedPhoto(photo.id)}
                    />
                    <button
                      onClick={() => handlePhotoDelete(photo.id)}
                      className="absolute top-2 right-2 p-1 bg-red-600/80 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    {photo.is_primary && (
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-accent-primary/80 text-white text-xs rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No photos uploaded yet</p>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Coordinates */}
          <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4">Location</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Latitude</span>
                <span className="text-white font-mono">{viewpoint.latitude.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Longitude</span>
                <span className="text-white font-mono">{viewpoint.longitude.toFixed(6)}</span>
              </div>
              {viewpoint.elevation && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Elevation</span>
                  <span className="text-white">{viewpoint.elevation}m</span>
                </div>
              )}
            </div>
            <a
              href={`https://www.google.com/maps?q=${viewpoint.latitude},${viewpoint.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-center text-accent-primary hover:text-blue-400 text-sm"
            >
              Open in Google Maps
            </a>
          </div>

          {/* Rating */}
          {viewpoint.rating > 0 && (
            <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">Rating</h2>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-6 h-6 ${star <= viewpoint.rating ? 'text-yellow-500' : 'text-gray-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-2xl font-bold text-white">{viewpoint.rating.toFixed(1)}</span>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4">Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className={viewpoint.is_public ? 'text-green-500' : 'text-yellow-500'}>
                  {viewpoint.is_public ? 'Public' : 'Private'}
                </span>
              </div>
              {viewpoint.created_at && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Created</span>
                  <span className="text-white">
                    {new Date(viewpoint.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
              {viewpoint.updated_at && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Updated</span>
                  <span className="text-white">
                    {new Date(viewpoint.updated_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setSelectedPhoto(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={viewpoint.photos?.find(p => p.id === selectedPhoto)?.url}
            alt="Full size"
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
