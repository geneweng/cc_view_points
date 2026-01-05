import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { ViewPoint, Category } from '../types';
import { getViewPoints, getCategories, deleteViewPoint } from '../api/viewpoints';
import ViewPointList from '../components/ViewPointList';

export default function ViewPointsPage() {
  const [viewpoints, setViewpoints] = useState<ViewPoint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadViewPoints();
  }, [searchTerm, selectedCategory]);

  async function loadData() {
    try {
      const [vpResponse, cats] = await Promise.all([
        getViewPoints(),
        getCategories(),
      ]);
      setViewpoints(vpResponse.viewpoints);
      setCategories(cats);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadViewPoints() {
    setIsLoading(true);
    try {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category_id = selectedCategory;

      const { viewpoints } = await getViewPoints(params);
      setViewpoints(viewpoints);
    } catch (error) {
      console.error('Failed to load viewpoints:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this viewpoint?')) return;

    try {
      await deleteViewPoint(id);
      setViewpoints(prev => prev.filter(vp => vp.id !== id));
    } catch (error) {
      console.error('Failed to delete viewpoint:', error);
      alert('Failed to delete viewpoint');
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">View Points</h1>
        <Link
          to="/viewpoints/new"
          className="inline-flex items-center px-4 py-2 bg-accent-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Viewpoint
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-dark-card rounded-lg p-4 border border-gray-800">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search viewpoints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-tertiary border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary transition-colors"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="sm:w-48">
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
              className="w-full bg-dark-tertiary border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent-primary transition-colors"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-gray-400">
        {viewpoints.length} viewpoint{viewpoints.length !== 1 ? 's' : ''} found
      </div>

      {/* ViewPoints List */}
      <ViewPointList
        viewpoints={viewpoints}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
