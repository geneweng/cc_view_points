import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ViewPointForm from '../components/ViewPointForm';
import { createViewPoint } from '../api/viewpoints';
import type { ViewPointFormData } from '../types';

export default function AddViewPointPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: ViewPointFormData) {
    setIsLoading(true);
    try {
      const viewpoint = await createViewPoint(data);
      navigate(`/viewpoints/${viewpoint.id}`);
    } catch (error) {
      console.error('Failed to create viewpoint:', error);
      alert('Failed to create viewpoint');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Add New Viewpoint</h1>
      <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
        <ViewPointForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/viewpoints')}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
