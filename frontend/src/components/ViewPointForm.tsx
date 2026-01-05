import { useState, useEffect } from 'react';
import type { ViewPointFormData, Category } from '../types';
import { getCategories } from '../api/viewpoints';

interface ViewPointFormProps {
  initialData?: Partial<ViewPointFormData>;
  onSubmit: (data: ViewPointFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ViewPointForm({ initialData, onSubmit, onCancel, isLoading }: ViewPointFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<ViewPointFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    latitude: initialData?.latitude || 0,
    longitude: initialData?.longitude || 0,
    elevation: initialData?.elevation,
    category_id: initialData?.category_id,
    rating: initialData?.rating || 0,
    is_public: initialData?.is_public ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }

    if (formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }

  const inputClass = "w-full bg-dark-tertiary border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent-primary transition-colors";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";
  const errorClass = "text-red-500 text-sm mt-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className={labelClass}>Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={inputClass}
          placeholder="Enter viewpoint name"
        />
        {errors.name && <p className={errorClass}>{errors.name}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelClass}>Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={inputClass}
          placeholder="Describe this viewpoint..."
        />
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="latitude" className={labelClass}>Latitude *</label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            step="any"
            className={inputClass}
            placeholder="-90 to 90"
          />
          {errors.latitude && <p className={errorClass}>{errors.latitude}</p>}
        </div>
        <div>
          <label htmlFor="longitude" className={labelClass}>Longitude *</label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            step="any"
            className={inputClass}
            placeholder="-180 to 180"
          />
          {errors.longitude && <p className={errorClass}>{errors.longitude}</p>}
        </div>
      </div>

      {/* Elevation */}
      <div>
        <label htmlFor="elevation" className={labelClass}>Elevation (meters)</label>
        <input
          type="number"
          id="elevation"
          name="elevation"
          value={formData.elevation || ''}
          onChange={handleChange}
          step="any"
          className={inputClass}
          placeholder="Optional elevation in meters"
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category_id" className={labelClass}>Category</label>
        <select
          id="category_id"
          name="category_id"
          value={formData.category_id || ''}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Select a category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Rating */}
      <div>
        <label htmlFor="rating" className={labelClass}>Rating</label>
        <input
          type="number"
          id="rating"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          min="0"
          max="5"
          step="0.1"
          className={inputClass}
          placeholder="0 to 5"
        />
      </div>

      {/* Is Public */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_public"
          name="is_public"
          checked={formData.is_public}
          onChange={handleCheckboxChange}
          className="w-4 h-4 rounded border-gray-700 bg-dark-tertiary text-accent-primary focus:ring-accent-primary"
        />
        <label htmlFor="is_public" className="ml-2 text-sm text-gray-300">
          Make this viewpoint public
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-accent-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Viewpoint'}
        </button>
      </div>
    </form>
  );
}
