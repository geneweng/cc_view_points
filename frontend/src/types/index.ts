export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Photo {
  id: number;
  viewpoint_id: number;
  filename: string;
  original_filename?: string;
  url: string;
  caption?: string;
  is_primary: boolean;
  created_at?: string;
}

export interface ViewPoint {
  id: number;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  category_id?: number;
  category?: Category;
  photos: Photo[];
  rating: number;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ViewPointFormData {
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  category_id?: number;
  rating?: number;
  is_public?: boolean;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}
