export interface Food {
  id: string;
  name: string;
  sku: string;
  price: number;
  status: 'ACTIVE' | 'OUT_OF_STOCK' | 'INACTIVE';
  category: string;
  image: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type FoodStatus = 'ACTIVE' | 'OUT_OF_STOCK' | 'INACTIVE';

export interface FoodFilter {
  search?: string;
  category?: string;
  status?: FoodStatus;
}

export interface FoodListResponse {
  data: Food[];
  total: number;
  page: number;
  limit: number;
} 