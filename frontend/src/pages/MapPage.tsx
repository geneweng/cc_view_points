import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import type { ViewPoint } from '../types';
import { getViewPoints } from '../api/viewpoints';
import 'leaflet/dist/leaflet.css';

// Custom marker icon
const markerIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapPage() {
  const [viewpoints, setViewpoints] = useState<ViewPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadViewpoints();
  }, []);

  async function loadViewpoints() {
    try {
      const { viewpoints } = await getViewPoints();
      setViewpoints(viewpoints);
    } catch (err) {
      console.error('Failed to load viewpoints:', err);
      setError('Failed to load viewpoints');
    } finally {
      setIsLoading(false);
    }
  }

  // Calculate center of all viewpoints or default to world center
  const getMapCenter = (): [number, number] => {
    if (viewpoints.length === 0) {
      return [20, 0]; // Default world center
    }
    const avgLat = viewpoints.reduce((sum, vp) => sum + vp.latitude, 0) / viewpoints.length;
    const avgLng = viewpoints.reduce((sum, vp) => sum + vp.longitude, 0) / viewpoints.length;
    return [avgLat, avgLng];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={loadViewpoints}
          className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Viewpoints Map</h1>
        <span className="text-gray-400">{viewpoints.length} locations</span>
      </div>

      <div className="bg-dark-card rounded-lg border border-gray-800 overflow-hidden">
        <MapContainer
          center={getMapCenter()}
          zoom={viewpoints.length > 0 ? 4 : 2}
          className="h-[600px] w-full"
          style={{ background: '#1a1a1a' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {viewpoints.map((viewpoint) => (
            <Marker
              key={viewpoint.id}
              position={[viewpoint.latitude, viewpoint.longitude]}
              icon={markerIcon}
            >
              <Popup>
                <div className="text-gray-900 min-w-[200px]">
                  <h3 className="font-bold text-lg mb-1">{viewpoint.name}</h3>
                  {viewpoint.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {viewpoint.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mb-2">
                    {viewpoint.latitude.toFixed(4)}, {viewpoint.longitude.toFixed(4)}
                  </p>
                  {viewpoint.category && (
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded mb-2">
                      {viewpoint.category.name}
                    </span>
                  )}
                  <div className="mt-2">
                    <Link
                      to={`/viewpoints/${viewpoint.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {viewpoints.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">No viewpoints to display on the map.</p>
          <Link
            to="/viewpoints/new"
            className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Your First Viewpoint
          </Link>
        </div>
      )}
    </div>
  );
}
