import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { ViewPoint } from '../types';
import { getViewPoints } from '../api/viewpoints';
import ViewPointList from '../components/ViewPointList';

export default function HomePage() {
  const [recentViewPoints, setRecentViewPoints] = useState<ViewPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecentViewPoints();
  }, []);

  async function loadRecentViewPoints() {
    try {
      const { viewpoints } = await getViewPoints({ limit: 6 });
      setRecentViewPoints(viewpoints);
    } catch (error) {
      console.error('Failed to load viewpoints:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Discover Amazing <span className="text-accent-primary">View Points</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Explore and manage your collection of scenic locations, landmarks, and points of interest from around the world.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/viewpoints"
            className="px-6 py-3 bg-accent-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Browse All
          </Link>
          <Link
            to="/map"
            className="px-6 py-3 bg-accent-success text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            View Map
          </Link>
          <Link
            to="/viewpoints/new"
            className="px-6 py-3 bg-dark-tertiary text-white rounded-lg font-medium hover:bg-gray-700 transition-colors border border-gray-700"
          >
            Add New
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-card rounded-lg p-6 border border-gray-800 text-center">
          <div className="text-3xl font-bold text-accent-primary mb-2">
            {recentViewPoints.length}+
          </div>
          <div className="text-gray-400">Viewpoints</div>
        </div>
        <div className="bg-dark-card rounded-lg p-6 border border-gray-800 text-center">
          <div className="text-3xl font-bold text-accent-success mb-2">
            GPS
          </div>
          <div className="text-gray-400">Coordinates</div>
        </div>
        <div className="bg-dark-card rounded-lg p-6 border border-gray-800 text-center">
          <div className="text-3xl font-bold text-accent-warning mb-2">
            Photos
          </div>
          <div className="text-gray-400">Gallery Support</div>
        </div>
      </section>

      {/* Recent ViewPoints */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recent Viewpoints</h2>
          <Link
            to="/viewpoints"
            className="text-accent-primary hover:text-blue-400 transition-colors"
          >
            View All
          </Link>
        </div>
        <ViewPointList viewpoints={recentViewPoints} isLoading={isLoading} />
      </section>

      {/* Features */}
      <section className="py-8">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
            <div className="w-12 h-12 bg-accent-primary/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">GPS Coordinates</h3>
            <p className="text-gray-400">Store precise latitude and longitude for each location.</p>
          </div>
          <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
            <div className="w-12 h-12 bg-accent-success/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-accent-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Photo Gallery</h3>
            <p className="text-gray-400">Upload and manage photos for each viewpoint.</p>
          </div>
          <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
            <div className="w-12 h-12 bg-accent-warning/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-accent-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Categories</h3>
            <p className="text-gray-400">Organize viewpoints with custom categories.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
