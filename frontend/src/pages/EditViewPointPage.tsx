import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ViewPointForm from '../components/ViewPointForm';
import { getViewPoint, updateViewPoint } from '../api/viewpoints';
import type { ViewPoint, ViewPointFormData } from '../types';

export default function EditViewPointPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [viewpoint, setViewpoint] = useState<ViewPoint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  async function handleSubmit(data: ViewPointFormData) {
    if (!viewpoint) return;

    setIsSaving(true);
    try {
      await updateViewPoint(viewpoint.id, data);
      navigate(`/viewpoints/${viewpoint.id}`);
    } catch (error) {
      console.error('Failed to update viewpoint:', error);
      alert('Failed to update viewpoint');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse">
        <div className="h-8 bg-dark-tertiary rounded w-1/3 mb-8" />
        <div className="bg-dark-card rounded-lg p-6 border border-gray-800 space-y-6">
          <div className="h-10 bg-dark-tertiary rounded" />
          <div className="h-24 bg-dark-tertiary rounded" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-dark-tertiary rounded" />
            <div className="h-10 bg-dark-tertiary rounded" />
          </div>
        </div>
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

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to={`/viewpoints/${viewpoint.id}`}
        className="text-gray-400 hover:text-white text-sm mb-2 inline-flex items-center"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to viewpoint
      </Link>
      <h1 className="text-3xl font-bold text-white mb-8">Edit Viewpoint</h1>
      <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
        <ViewPointForm
          initialData={{
            name: viewpoint.name,
            description: viewpoint.description,
            latitude: viewpoint.latitude,
            longitude: viewpoint.longitude,
            elevation: viewpoint.elevation,
            category_id: viewpoint.category_id,
            rating: viewpoint.rating,
            is_public: viewpoint.is_public,
          }}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/viewpoints/${viewpoint.id}`)}
          isLoading={isSaving}
        />
      </div>
    </div>
  );
}
