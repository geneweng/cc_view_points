import axios from 'axios';
import type { ViewPoint, ViewPointFormData, Category, CategoryFormData } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ViewPoints API
export async function getViewPoints(params?: {
  category_id?: number;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ viewpoints: ViewPoint[]; total: number }> {
  const response = await api.get('/viewpoints', { params });
  return response.data;
}

export async function getViewPoint(id: number): Promise<ViewPoint> {
  const response = await api.get(`/viewpoints/${id}`);
  return response.data.viewpoint;
}

export async function createViewPoint(data: ViewPointFormData): Promise<ViewPoint> {
  const response = await api.post('/viewpoints', data);
  return response.data.viewpoint;
}

export async function updateViewPoint(id: number, data: Partial<ViewPointFormData>): Promise<ViewPoint> {
  const response = await api.put(`/viewpoints/${id}`, data);
  return response.data.viewpoint;
}

export async function deleteViewPoint(id: number): Promise<void> {
  await api.delete(`/viewpoints/${id}`);
}

// Photos API
export async function uploadPhoto(viewpointId: number, file: File, caption?: string): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  if (caption) {
    formData.append('caption', caption);
  }
  const response = await api.post(`/viewpoints/${viewpointId}/photos`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.photo;
}

export async function deletePhoto(id: number): Promise<void> {
  await api.delete(`/photos/${id}`);
}

// Categories API
export async function getCategories(): Promise<Category[]> {
  const response = await api.get('/categories');
  return response.data.categories;
}

export async function createCategory(data: CategoryFormData): Promise<Category> {
  const response = await api.post('/categories', data);
  return response.data.category;
}

export async function updateCategory(id: number, data: Partial<CategoryFormData>): Promise<Category> {
  const response = await api.put(`/categories/${id}`, data);
  return response.data.category;
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/categories/${id}`);
}
