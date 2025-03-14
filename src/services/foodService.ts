import { Food, FoodFilter, FoodListResponse } from '../models/Food';

// Dữ liệu mẫu cho món ăn và đồ uống từ The Coffee House
const mockFoods: Food[] = [
  // Cà Phê Việt Nam
  {
    id: '1',
    name: 'The Coffee House Sữa Đá',
    sku: 'CF001',
    price: 39000,
    status: 'ACTIVE',
    category: 'Cà Phê Việt Nam',
    image: 'https://product.hstatic.net/1000075078/product/1737357037_tch-sua-da_5802e6e0dcb14c76b36bb45333996d33.png',
    description: 'Cà phê sữa đá truyền thống của The Coffee House với hương vị đậm đà, hài hòa giữa vị đắng cà phê và vị ngọt của sữa.',
    createdAt: '2023-01-15T08:30:00Z',
    updatedAt: '2023-05-20T10:15:00Z'
  },
  {
    id: '2',
    name: 'Cà Phê Đen Đá',
    sku: 'CF002',
    price: 29000,
    status: 'ACTIVE',
    category: 'Cà Phê Việt Nam',
    image: 'https://product.hstatic.net/1000075078/product/1737357037_tch-sua-da_5802e6e0dcb14c76b36bb45333996d33.png',
    description: 'Cà phê đen đá mang hương vị mạnh mẽ, đậm đà của cà phê Việt Nam.',
    createdAt: '2023-01-16T09:30:00Z',
    updatedAt: '2023-05-21T11:15:00Z'
  },
  {
    id: '3',
    name: 'Bạc Xỉu',
    sku: 'CF003',
    price: 29000,
    status: 'ACTIVE',
    category: 'Cà Phê Việt Nam',
    image: 'https://product.hstatic.net/1000075078/product/1737357037_tch-sua-da_5802e6e0dcb14c76b36bb45333996d33.png',
    description: 'Bạc xỉu là cà phê sữa với nhiều sữa hơn cà phê, vị ngọt dịu.',
    createdAt: '2023-01-17T10:30:00Z',
    updatedAt: '2023-05-22T12:15:00Z'
  },
  {
    id: '4',
    name: 'Đường Đen Sữa Đá',
    sku: 'CF004',
    price: 45000,
    status: 'ACTIVE',
    category: 'Cà Phê Việt Nam',
    image: 'https://product.hstatic.net/1000075078/product/1737357037_tch-sua-da_5802e6e0dcb14c76b36bb45333996d33.png',
    description: 'Cà phê đường đen sữa đá với vị đường đen đặc trưng, ngọt thơm và béo ngậy.',
    createdAt: '2023-01-18T11:30:00Z',
    updatedAt: '2023-05-23T13:15:00Z'
  },
  {
    id: '5',
    name: 'Cà Phê Sữa Nóng',
    sku: 'CF005',
    price: 39000,
    status: 'ACTIVE',
    category: 'Cà Phê Việt Nam',
    image: 'https://product.hstatic.net/1000075078/product/1737357037_tch-sua-da_5802e6e0dcb14c76b36bb45333996d33.png',
    description: 'Cà phê sữa nóng thơm ngon, phù hợp cho những ngày se lạnh.',
    createdAt: '2023-01-19T12:30:00Z',
    updatedAt: '2023-05-24T14:15:00Z'
  },
  
  // Cà Phê Máy
  {
    id: '6',
    name: 'Americano Đá',
    sku: 'CFM001',
    price: 49000,
    status: 'ACTIVE',
    category: 'Cà Phê Máy',
    image: 'https://product.hstatic.net/1000075078/product/1737357037_tch-sua-da_5802e6e0dcb14c76b36bb45333996d33.png',
    description: 'Americano đá với hương vị cà phê espresso thơm ngon, hòa quyện với đá.',
    createdAt: '2023-01-20T13:30:00Z',
    updatedAt: '2023-05-25T15:15:00Z'
  },
  {
    id: '7',
    name: 'Latte Đá',
    sku: 'CFM002',
    price: 55000,
    status: 'ACTIVE',
    category: 'Cà Phê Máy',
    image: 'https://product.hstatic.net/1000075078/product/1737357037_tch-sua-da_5802e6e0dcb14c76b36bb45333996d33.png',
    description: 'Latte đá với lớp sữa mịn màng hòa quyện cùng cà phê espresso đậm đà.',
    createdAt: '2023-01-21T14:30:00Z',
    updatedAt: '2023-05-26T16:15:00Z'
  },
  {
    id: '8',
    name: 'Cappuccino Đá',
    sku: 'CFM003',
    price: 55000,
    status: 'ACTIVE',
    category: 'Cà Phê Máy',
    image: 'https://product.hstatic.net/1000075078/product/1737357037_tch-sua-da_5802e6e0dcb14c76b36bb45333996d33.png',
    description: 'Cappuccino đá với lớp bọt sữa dày, xốp và cà phê espresso.',
    createdAt: '2023-01-22T15:30:00Z',
    updatedAt: '2023-05-27T17:15:00Z'
  },
  {
    id: '9',
    name: 'Caramel Macchiato Đá',
    sku: 'CFM004',
    price: 55000,
    status: 'ACTIVE',
    category: 'Cà Phê Máy',
    image: 'https://product.hstatic.net/1000075078/product/1737357037_tch-sua-da_5802e6e0dcb14c76b36bb45333996d33.png',
    description: 'Caramel Macchiato đá với vị caramel ngọt ngào, sữa và cà phê espresso.',
    createdAt: '2023-01-23T16:30:00Z',
    updatedAt: '2023-05-28T18:15:00Z'
  },
  
  // Trà Trái Cây
  {
    id: '10',
    name: 'Hi-Tea Đào',
    sku: 'TR001',
    price: 49000,
    status: 'ACTIVE',
    category: 'Trà Trái Cây',
    image: 'https://product.hstatic.net/1000075078/product/1737357037_tch-sua-da_5802e6e0dcb14c76b36bb45333996d33.png',
    description: 'Hi-Tea Đào với hương vị đào thơm ngọt, kết hợp với trà.',
    createdAt: '2023-01-24T17:30:00Z',
    updatedAt: '2023-05-29T19:15:00Z'
  },
  {
    id: '11',
    name: 'Hi-Tea Vải',
    sku: 'TR002',
    price: 49000,
    status: 'ACTIVE',
    category: 'Trà Trái Cây',
    image: 'https://product.hstatic.net/1000075078/product/1737357037_tch-sua-da_5802e6e0dcb14c76b36bb45333996d33.png',
    description: 'Hi-Tea Vải với hương vị vải thơm ngọt, kết hợp với trà.',
    createdAt: '2023-01-25T18:30:00Z',
    updatedAt: '2023-05-30T20:15:00Z'
  },
  {
    id: '12',
    name: 'Oolong Tứ Quý Vải',
    sku: 'TR003',
    price: 49000,
    status: 'ACTIVE',
    category: 'Trà Trái Cây',
    image: 'https://product.hstatic.net/1000075078/product/1737357037_tch-sua-da_5802e6e0dcb14c76b36bb45333996d33.png',
    description: 'Trà Oolong Tứ Quý kết hợp với vải, tạo nên hương vị thơm ngon đặc biệt.',
    createdAt: '2023-01-26T19:30:00Z',
    updatedAt: '2023-05-31T21:15:00Z'
  },
  
  // Trà Sữa
  {
    id: '13',
    name: 'Hồng Trà Sữa Trân Châu',
    sku: 'TS001',
    price: 55000,
    status: 'ACTIVE',
    category: 'Trà Sữa',
    image: 'https://product.hstatic.net/1000075078/product/1737357037_tch-sua-da_5802e6e0dcb14c76b36bb45333996d33.png',
    description: 'Hồng trà sữa với trân châu đường đen dai ngon.',
    createdAt: '2023-01-27T20:30:00Z',
    updatedAt: '2023-06-01T22:15:00Z'
  },
  {
    id: '14',
    name: 'Trà Sữa Oolong Nướng Sương Sáo',
    sku: 'TS002',
    price: 55000,
    status: 'ACTIVE',
    category: 'Trà Sữa',
    image: 'https://product.hstatic.net/1000075078/product/1737357037_tch-sua-da_5802e6e0dcb14c76b36bb45333996d33.png',
    description: 'Trà sữa oolong nướng với sương sáo dai giòn, thơm ngon.',
    createdAt: '2023-01-28T21:30:00Z',
    updatedAt: '2023-06-02T23:15:00Z'
  },
  
  // Bánh ngọt
  {
    id: '15',
    name: 'Mousse Tiramisu',
    sku: 'BK001',
    price: 35000,
    status: 'ACTIVE',
    category: 'Bánh ngọt',
    image: 'https://product.hstatic.net/1000075078/product/1737357037_tch-sua-da_5802e6e0dcb14c76b36bb45333996d33.png',
    description: 'Bánh mousse tiramisu với hương vị cà phê đặc trưng.',
    createdAt: '2023-01-29T22:30:00Z',
    updatedAt: '2023-06-03T00:15:00Z'
  },
  {
    id: '16',
    name: 'Mousse Gấu Chocolate',
    sku: 'BK002',
    price: 39000,
    status: 'ACTIVE',
    category: 'Bánh ngọt',
    image: 'https://product.hstatic.net/1000075078/product/1737357037_tch-sua-da_5802e6e0dcb14c76b36bb45333996d33.png',
    description: 'Bánh mousse chocolate hình gấu dễ thương và thơm ngon.',
    createdAt: '2023-01-30T23:30:00Z',
    updatedAt: '2023-06-04T01:15:00Z'
  },
  
  // Bánh mặn
  {
    id: '17',
    name: 'Chà Bông Phô Mai',
    sku: 'BM001',
    price: 39000,
    status: 'ACTIVE',
    category: 'Bánh mặn',
    image: 'https://product.hstatic.net/1000075078/product/1737357037_tch-sua-da_5802e6e0dcb14c76b36bb45333996d33.png',
    description: 'Bánh mì chà bông phô mai thơm ngon, giòn xốp.',
    createdAt: '2023-01-31T00:30:00Z',
    updatedAt: '2023-06-05T02:15:00Z'
  },
  {
    id: '18',
    name: 'Croissant Trứng Muối',
    sku: 'BM002',
    price: 39000,
    status: 'ACTIVE',
    category: 'Bánh mặn',
    image: 'https://product.hstatic.net/1000075078/product/1737357037_tch-sua-da_5802e6e0dcb14c76b36bb45333996d33.png',
    description: 'Bánh croissant giòn xốp kết hợp với trứng muối béo ngậy.',
    createdAt: '2023-02-01T01:30:00Z',
    updatedAt: '2023-06-06T03:15:00Z'
  }
];

// Danh sách các loại món ăn
export const foodCategories = [
  'Cà Phê Việt Nam',
  'Cà Phê Máy',
  'Trà Trái Cây',
  'Trà Sữa',
  'Bánh ngọt',
  'Bánh mặn'
];

// Danh sách các thương hiệu
export const foodBrands = [
  'Nhà hàng A',
  'Nhà hàng B',
  'Tiệm bánh C',
  'Nhà hàng D',
  'Quán cà phê E'
];

// Danh sách các loại
export const foodTypes = [
  'NORMAL',
  'MATERIAL'
];

// Hàm lấy danh sách món ăn với phân trang và lọc
export const getFoods = async (
  page: number = 1,
  limit: number = 10,
  filter: FoodFilter = {}
): Promise<FoodListResponse> => {
  // Giả lập độ trễ của API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredFoods = [...mockFoods];
  
  // Áp dụng bộ lọc
  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    filteredFoods = filteredFoods.filter(food => 
      food.name.toLowerCase().includes(searchLower) || 
      food.sku.toLowerCase().includes(searchLower) ||
      (food.description && food.description.toLowerCase().includes(searchLower))
    );
  }
  
  if (filter.category) {
    filteredFoods = filteredFoods.filter(food => food.category === filter.category);
  }
  
  if (filter.status) {
    filteredFoods = filteredFoods.filter(food => food.status === filter.status);
  }
  
  // Tính toán phân trang
  const total = filteredFoods.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedFoods = filteredFoods.slice(startIndex, endIndex);
  
  return {
    data: paginatedFoods,
    total,
    page,
    limit
  };
};

// Hàm lấy thông tin chi tiết món ăn theo ID
export const getFoodById = async (id: string): Promise<Food | null> => {
  // Giả lập độ trễ của API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const food = mockFoods.find(food => food.id === id);
  return food || null;
};

// Hàm tạo món ăn mới
export const createFood = async (foodData: Omit<Food, 'id' | 'createdAt' | 'updatedAt'>): Promise<Food> => {
  // Giả lập độ trễ của API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newFood: Food = {
    ...foodData,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Trong thực tế, đây sẽ là API call để tạo món ăn mới
  mockFoods.push(newFood);
  
  return newFood;
};

// Hàm cập nhật thông tin món ăn
export const updateFood = async (id: string, foodData: Partial<Food>): Promise<Food | null> => {
  // Giả lập độ trễ của API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const foodIndex = mockFoods.findIndex(food => food.id === id);
  if (foodIndex === -1) return null;
  
  // Cập nhật thông tin món ăn
  const updatedFood: Food = {
    ...mockFoods[foodIndex],
    ...foodData,
    updatedAt: new Date().toISOString()
  };
  
  // Trong thực tế, đây sẽ là API call để cập nhật món ăn
  mockFoods[foodIndex] = updatedFood;
  
  return updatedFood;
};

// Hàm xóa món ăn
export const deleteFood = async (id: string): Promise<boolean> => {
  // Giả lập độ trễ của API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const foodIndex = mockFoods.findIndex(food => food.id === id);
  if (foodIndex === -1) return false;
  
  // Trong thực tế, đây sẽ là API call để xóa món ăn
  mockFoods.splice(foodIndex, 1);
  
  return true;
}; 