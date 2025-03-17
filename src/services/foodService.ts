import { Food, FoodFilter, FoodListResponse } from "../models/Food";

// API URL
const API_URL = "http://localhost:8080/api";

// Danh sách các danh mục món ăn
export const foodCategories = [
  "Cà Phê Việt Nam",
  "Cà Phê Máy",
  "Cold Brew",
  "Trà",
  "Trà Sữa",
  "CloudTea",
  "CloudFee",
  "Hi-Tea",
  "Bánh ngọt",
  "Bánh mặn",
  "Snack",
];

// Danh sách trạng thái món ăn
export const foodStatuses = [
  { value: "ACTIVE", label: "Đang bán" },
  { value: "OUT_OF_STOCK", label: "Hết hàng" },
  { value: "INACTIVE", label: "Ngừng bán" },
];

// Danh sách các thương hiệu
export const foodBrands = [
  "Nhà hàng A",
  "Nhà hàng B",
  "Tiệm bánh C",
  "Nhà hàng D",
  "Quán cà phê E",
];

// Danh sách các loại
export const foodTypes = ["NORMAL", "MATERIAL"];

// Hàm lấy danh sách món ăn với phân trang và lọc
export const getFoods = async (
  page: number = 1,
  limit: number = 10,
  filter: FoodFilter = {}
): Promise<{
  success: boolean;
  data: Food[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}> => {
  try {
    // Xây dựng query params
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", limit.toString());

    if (filter.search) {
      params.append("search", filter.search);
    }

    if (filter.category) {
      params.append("category", filter.category);
    }

    if (filter.status) {
      params.append("status", filter.status);
    }

    // Gọi API
    const response = await fetch(`${API_URL}/food?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Không thể lấy danh sách món ăn");
    }

    const result = await response.json();

    // Kiểm tra xem có dữ liệu không
    if (
      !result.res ||
      !result.res.foods ||
      !Array.isArray(result.res.foods) ||
      result.res.foods.length === 0
    ) {
      return {
        success: true,
        data: [],
        total: 0,
        page,
        limit,
      };
    }

    // Chuyển đổi dữ liệu từ API sang định dạng Food
    const foods: Food[] = result.res.foods
      .map((item: any) => {
        // Kiểm tra các trường bắt buộc
        if (!item || typeof item !== "object") {
          return null;
        }

        // Kiểm tra nếu tên món ăn có chứa "Món ăn" thì bỏ qua
        if (item.name && item.name.includes("Món ăn")) {
          return null;
        }

        // Kiểm tra và đảm bảo các trường có giá trị hợp lệ
        const name = item.name || "";
        const sku = item.sku || "";
        const price = typeof item.price === "number" ? item.price : 0;
        const category = item.category || "";
        const image =
          item.image || "https://via.placeholder.com/150?text=No+Image";

        return {
          id: (item.id || "0").toString(),
          name,
          sku,
          price,
          status: item.is_available ? "ACTIVE" : "INACTIVE",
          category,
          image,
          description: item.description || "",
          createdAt: item.created_at || new Date().toISOString(),
          updatedAt: item.updated_at || new Date().toISOString(),
        };
      })
      .filter(Boolean); // Lọc bỏ các giá trị null

    // Nếu sau khi lọc không còn món ăn nào, trả về mảng rỗng
    if (foods.length === 0) {
      return {
        success: true,
        data: [],
        total: 0,
        page,
        limit,
      };
    }

    return {
      success: true,
      data: foods,
      total: result.res.pagination?.total || foods.length,
      page,
      limit,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách món ăn:", error);
    return {
      success: false,
      data: [],
      total: 0,
      page,
      limit,
      message:
        error instanceof Error
          ? error.message
          : "Đã xảy ra lỗi khi lấy danh sách món ăn",
    };
  }
};

// Hàm lấy thông tin chi tiết món ăn theo ID
export const getFoodById = async (id: string): Promise<Food | null> => {
  try {
    const response = await fetch(`${API_URL}/food/${id}`);

    if (!response.ok) {
      throw new Error("Không thể lấy thông tin món ăn");
    }

    const result = await response.json();

    if (!result.res) {
      return null;
    }

    // Chuyển đổi dữ liệu từ API sang định dạng Food
    const food: Food = {
      id: result.res.id.toString(),
      name: result.res.name,
      sku: result.res.sku,
      price: result.res.price,
      status: result.res.is_available ? "ACTIVE" : "INACTIVE",
      category: result.res.category,
      image: result.res.image,
      description: result.res.description,
      createdAt: result.res.created_at,
      updatedAt: result.res.updated_at,
    };

    return food;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin món ăn:", error);
    return null;
  }
};

// Hàm tạo món ăn mới
export const createFood = async (
  foodData: Omit<Food, "id" | "createdAt" | "updatedAt">
): Promise<Food> => {
  try {
    // Chuyển đổi dữ liệu từ Food sang định dạng API
    const apiData = {
      name: foodData.name,
      sku: foodData.sku,
      price: foodData.price,
      is_available: foodData.status === "ACTIVE",
      category: foodData.category,
      image: foodData.image,
      description: foodData.description || "",
    };

    const response = await fetch(`${API_URL}/food`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify(apiData),
    });

    if (!response.ok) {
      throw new Error("Không thể tạo món ăn mới");
    }

    const result = await response.json();

    // Chuyển đổi dữ liệu từ API sang định dạng Food
    const newFood: Food = {
      id: result.res.id.toString(),
      name: result.res.name,
      sku: result.res.sku,
      price: result.res.price,
      status: result.res.is_available ? "ACTIVE" : "INACTIVE",
      category: result.res.category,
      image: result.res.image,
      description: result.res.description,
      createdAt: result.res.created_at,
      updatedAt: result.res.updated_at,
    };

    return newFood;
  } catch (error) {
    console.error("Lỗi khi tạo món ăn mới:", error);
    throw error;
  }
};

// Hàm cập nhật món ăn
export const updateFood = async (
  id: string,
  foodData: Partial<Omit<Food, "id" | "createdAt" | "updatedAt">>
): Promise<Food> => {
  try {
    // Chuyển đổi dữ liệu từ Food sang định dạng API
    const apiData: any = {};

    if (foodData.name !== undefined) apiData.name = foodData.name;
    if (foodData.sku !== undefined) apiData.sku = foodData.sku;
    if (foodData.price !== undefined) apiData.price = foodData.price;
    if (foodData.status !== undefined)
      apiData.is_available = foodData.status === "ACTIVE";
    if (foodData.category !== undefined) apiData.category = foodData.category;
    if (foodData.image !== undefined) apiData.image = foodData.image;
    if (foodData.description !== undefined)
      apiData.description = foodData.description;

    const response = await fetch(`${API_URL}/food/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify(apiData),
    });

    if (!response.ok) {
      throw new Error("Không thể cập nhật món ăn");
    }

    const result = await response.json();

    // Chuyển đổi dữ liệu từ API sang định dạng Food
    const updatedFood: Food = {
      id: result.res.id.toString(),
      name: result.res.name,
      sku: result.res.sku,
      price: result.res.price,
      status: result.res.is_available ? "ACTIVE" : "INACTIVE",
      category: result.res.category,
      image: result.res.image,
      description: result.res.description,
      createdAt: result.res.created_at,
      updatedAt: result.res.updated_at,
    };

    return updatedFood;
  } catch (error) {
    console.error("Lỗi khi cập nhật món ăn:", error);
    throw error;
  }
};

// Hàm xóa món ăn
export const deleteFood = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/food/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });

    if (!response.ok) {
      throw new Error("Không thể xóa món ăn");
    }

    return true;
  } catch (error) {
    console.error("Lỗi khi xóa món ăn:", error);
    return false;
  }
};

// Hàm xuất dữ liệu món ăn
export const exportFoods = async (): Promise<Blob> => {
  try {
    const response = await fetch(`${API_URL}/food/export`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });

    if (!response.ok) {
      throw new Error("Không thể xuất dữ liệu món ăn");
    }

    return await response.blob();
  } catch (error) {
    console.error("Lỗi khi xuất dữ liệu món ăn:", error);
    throw error;
  }
};

// Hàm gửi dữ liệu mock về backend
export const sendMockFoodsToBackend = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/food/import-mock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không thể gửi dữ liệu mock về BE");
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || "Đã gửi dữ liệu mock thành công",
    };
  } catch (error) {
    console.error("Lỗi khi gửi dữ liệu mock:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Đã xảy ra lỗi khi gửi dữ liệu mock",
    };
  }
};
