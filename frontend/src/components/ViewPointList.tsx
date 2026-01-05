import type { ViewPoint } from '../types';
import ViewPointCard from './ViewPointCard';

interface ViewPointListProps {
  viewpoints: ViewPoint[];
  onDelete?: (id: number) => void;
  isLoading?: boolean;
}

export default function ViewPointList({ viewpoints, onDelete, isLoading }: ViewPointListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-dark-card rounded-lg overflow-hidden border border-gray-800 animate-pulse">
            <div className="aspect-video bg-dark-tertiary" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-dark-tertiary rounded w-3/4" />
              <div className="h-4 bg-dark-tertiary rounded w-full" />
              <div className="h-4 bg-dark-tertiary rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (viewpoints.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-400 mb-2">No viewpoints found</h3>
        <p className="text-gray-500">Create your first viewpoint to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {viewpoints.map((viewpoint) => (
        <ViewPointCard
          key={viewpoint.id}
          viewpoint={viewpoint}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
