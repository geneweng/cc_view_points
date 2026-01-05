import { Link } from 'react-router-dom';
import type { ViewPoint } from '../types';

interface ViewPointCardProps {
  viewpoint: ViewPoint;
  onDelete?: (id: number) => void;
}

export default function ViewPointCard({ viewpoint, onDelete }: ViewPointCardProps) {
  const primaryPhoto = viewpoint.photos?.find(p => p.is_primary) || viewpoint.photos?.[0];

  return (
    <div className="bg-dark-card rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors">
      {/* Image */}
      <div className="aspect-video bg-dark-tertiary relative">
        {primaryPhoto ? (
          <img
            src={primaryPhoto.url}
            alt={viewpoint.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {viewpoint.category && (
          <span
            className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium"
            style={{ backgroundColor: viewpoint.category.color || '#3b82f6' }}
          >
            {viewpoint.category.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1 truncate">
          {viewpoint.name}
        </h3>
        {viewpoint.description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {viewpoint.description}
          </p>
        )}

        {/* Coordinates */}
        <div className="flex items-center text-gray-500 text-xs mb-3">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>{viewpoint.latitude.toFixed(4)}, {viewpoint.longitude.toFixed(4)}</span>
        </div>

        {/* Rating */}
        {viewpoint.rating > 0 && (
          <div className="flex items-center mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${star <= viewpoint.rating ? 'text-yellow-500' : 'text-gray-600'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1 text-gray-400 text-sm">{viewpoint.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
          <Link
            to={`/viewpoints/${viewpoint.id}`}
            className="text-accent-primary hover:text-blue-400 text-sm font-medium transition-colors"
          >
            View Details
          </Link>
          <div className="flex space-x-2">
            <Link
              to={`/viewpoints/${viewpoint.id}/edit`}
              className="p-2 text-gray-400 hover:text-white hover:bg-dark-tertiary rounded transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            {onDelete && (
              <button
                onClick={() => onDelete(viewpoint.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-dark-tertiary rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
