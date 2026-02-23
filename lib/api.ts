// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7001/api";

// Token yönetimi
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

// Genel fetch wrapper
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    // Validasyon hatalarını detaylı göster (data.errors array varsa)
    const errorMessage = Array.isArray(data.errors) && data.errors.length > 0
      ? data.errors.join(". ")
      : data.message || "Bir hata oluştu";
    throw new Error(errorMessage);
  }

  return data;
}

// ==================== AUTH API ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
}

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: UserDto;
}

export const authApi = {
  login: (data: LoginRequest) =>
    fetchApi<AuthResponse>("/Auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: RegisterRequest) =>
    fetchApi<AuthResponse>("/Auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getProfile: () => fetchApi<AuthResponse>("/Auth/profile"),

  updateProfile: (data: { firstName: string; lastName: string; phoneNumber?: string }) =>
    fetchApi<AuthResponse>("/Auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  changePassword: (data: { currentPassword: string; newPassword: string; confirmNewPassword: string }) =>
    fetchApi<AuthResponse>("/Auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ==================== COMPANY API ====================

export interface CreateCompanyRequest {
  name: string;
  taxNumber: string;
  taxOffice: string;
  mersisNumber: string;
  naceCode?: string;
  address: string;
  city: string;
  district: string;
  postalCode?: string;
  phoneNumber: string;
  website?: string;
}

export interface CompanyDto {
  id: number;
  name: string;
  taxNumber: string;
  taxOffice: string;
  mersisNumber: string;
  naceCode?: string;
  address: string;
  city: string;
  district: string;
  postalCode?: string;
  phoneNumber: string;
  website?: string;
  logoUrl?: string;
  verificationStatus: number; // 1=Pending, 2=UnderReview, 3=Approved, 4=Rejected
  verificationRejectionReason?: string;
  createdAt: string;
}

export interface CompanyResponse {
  success: boolean;
  message: string;
  company?: CompanyDto;
}

export const companyApi = {
  create: (data: CreateCompanyRequest) =>
    fetchApi<CompanyResponse>("/Company/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMyCompany: () => fetchApi<CompanyResponse>("/Company/my-company"),

  getById: (id: number) => fetchApi<CompanyResponse>(`/Company/${id}`),

  update: (data: Partial<CreateCompanyRequest>) =>
    fetchApi<CompanyResponse>("/Company/update", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  uploadLogo: async (file: File): Promise<CompanyResponse> => {
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/Company/logo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return response.json();
  },

  deleteLogo: async (): Promise<CompanyResponse> => {
    return fetchApi<CompanyResponse>("/Company/logo", { method: "DELETE" });
  },
};

// ==================== CATEGORY API ====================

export interface CategoryDto {
  id: number;
  name: string;
  description?: string;
  parentCategoryId?: number;
  parentCategoryName?: string;
  subCategories?: CategoryDto[];
}

export interface CategoryListResponse {
  success: boolean;
  message: string;
  categories: CategoryDto[];
}

// Kategori önbelleği - rate limit aşımını önlemek için (5 dk)
let categoryCache: { data: CategoryDto[]; expiresAt: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

export const categoryApi = {
  getAll: async (): Promise<CategoryListResponse> => {
    const now = Date.now();
    if (categoryCache && categoryCache.expiresAt > now) {
      return { success: true, message: "OK", categories: categoryCache.data };
    }
    const response = await fetchApi<CategoryListResponse>("/Category");
    if (response.success && response.categories) {
      categoryCache = { data: response.categories, expiresAt: now + CACHE_TTL_MS };
    }
    return response;
  },
};

// ==================== PRODUCT API ====================

export interface CreateProductRequest {
  categoryId: number;
  title: string;
  description: string;
  brand?: string;
  model?: string;
  partNumber?: string;
  quantity: number;
  minimumOrderQuantity: number;
  unitPrice: number;
  currency: string;
  condition: string;
  warrantyInfo?: string;
}

export interface ProductDto {
  id: number;
  title: string;
  description: string;
  brand?: string;
  model?: string;
  partNumber?: string;
  quantity: number;
  minimumOrderQuantity: number;
  unitPrice: number;
  currency: string;
  condition: string;
  warrantyInfo?: string;
  region: string;
  status: number; // 1=Draft, 2=Active, 3=Sold, 4=Expired
  viewCount: number;
  createdAt: string;
  publishedAt?: string;
  categoryId: number;
  categoryName: string;
  companyId?: number;
  companyName?: string;
  images?: ProductImageDto[];
}

export interface ProductImageDto {
  id: number;
  productId: number;
  imageUrl: string;
  thumbnailUrl?: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  product?: ProductDto;
}

export interface ProductListResponse {
  success: boolean;
  message: string;
  products: ProductDto[];
  totalCount: number;
}

export interface ProductSearchParams {
  keyword?: string;
  categoryId?: number;
  region?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  condition?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
}

export const productApi = {
  getAll: () => fetchApi<ProductListResponse>("/Product"),

  search: (params: ProductSearchParams) => {
    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryString.append(key, String(value));
      }
    });
    return fetchApi<ProductListResponse>(`/Product/search?${queryString}`);
  },

  getById: (id: number) => fetchApi<ProductResponse>(`/Product/${id}`),

  getMyProducts: () => fetchApi<ProductListResponse>("/Product/my-products"),

  create: (data: CreateProductRequest) =>
    fetchApi<ProductResponse>("/Product/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<CreateProductRequest>) =>
    fetchApi<ProductResponse>(`/Product/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    fetchApi<ProductResponse>(`/Product/${id}`, {
      method: "DELETE",
    }),

  publish: (id: number) =>
    fetchApi<ProductResponse>(`/Product/${id}/publish`, {
      method: "POST",
    }),

  unpublish: (id: number) =>
    fetchApi<ProductResponse>(`/Product/${id}/unpublish`, {
      method: "POST",
    }),
};

// ==================== PRODUCT IMAGE API ====================

export interface ProductImageResponse {
  success: boolean;
  message: string;
  image?: ProductImageDto;
}

export interface ProductImageListResponse {
  success: boolean;
  message: string;
  images: ProductImageDto[];
}

export const productImageApi = {
  getByProductId: (productId: number) =>
    fetchApi<ProductImageListResponse>(`/ProductImage/product/${productId}`),

  upload: async (productId: number, file: File, isPrimary: boolean = false): Promise<ProductImageResponse> => {
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${API_BASE_URL}/ProductImage/upload/${productId}?isPrimary=${isPrimary}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    return response.json();
  },

  delete: (imageId: number) =>
    fetchApi<ProductImageResponse>(`/ProductImage/${imageId}`, {
      method: "DELETE",
    }),

  setPrimary: (imageId: number) =>
    fetchApi<ProductImageResponse>(`/ProductImage/${imageId}/set-primary`, {
      method: "POST",
    }),
};

// ==================== CONTACT REQUEST API ====================

export interface CreateContactRequestData {
  productId: number;
  message: string;
  contactPhone?: string;
  ndaAccepted: boolean;
}

export interface ContactRequestDto {
  id: number;
  productId: number;
  productTitle: string;
  message: string;
  contactPhone?: string;
  status: number; // 1=Pending, 2=Approved, 3=Rejected
  createdAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  // Alıcı bilgileri (gelen taleplerde)
  buyerCompanyName: string;
  buyerContactName: string;
  buyerEmail: string;
  // Satıcı bilgileri (onaylanmış taleplerde)
  sellerCompanyName?: string;
  sellerPhone?: string;
  sellerEmail?: string;
}

export interface ContactRequestResponse {
  success: boolean;
  message: string;
  contactRequest?: ContactRequestDto;
}

export interface ContactRequestListResponse {
  success: boolean;
  message: string;
  contactRequests: ContactRequestDto[];
}

export const contactRequestApi = {
  create: (data: CreateContactRequestData) =>
    fetchApi<ContactRequestResponse>("/ContactRequest/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getReceived: () => fetchApi<ContactRequestListResponse>("/ContactRequest/received"),

  getSent: () => fetchApi<ContactRequestListResponse>("/ContactRequest/sent"),

  review: (id: number, data: { approve: boolean; rejectionReason?: string }) =>
    fetchApi<ContactRequestResponse>(`/ContactRequest/${id}/review`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ==================== HELPER FUNCTIONS ====================

export const getApiImageUrl = (imageUrl?: string): string => {
  if (!imageUrl) return "/placeholder-product.jpg";
  if (imageUrl.startsWith("http")) return imageUrl;
  const baseUrl = API_BASE_URL.replace("/api", "");
  return `${baseUrl}${imageUrl}`;
};

export const getStatusText = (status: number): string => {
  switch (status) {
    case 1: return "Bekliyor";
    case 2: return "Aktif";
    case 3: return "Satıldı";
    case 4: return "Süresi Doldu";
    default: return "Bilinmiyor";
  }
};

export const getVerificationStatusText = (status: number): string => {
  switch (status) {
    case 1: return "Bekliyor";
    case 2: return "İnceleniyor";
    case 3: return "Onaylandı";
    case 4: return "Reddedildi";
    default: return "Bilinmiyor";
  }
};

// ==================== ADMIN API ====================

export interface AdminDashboardData {
  totalUsers: number;
  totalCompanies: number;
  pendingCompanies: number;
  approvedCompanies: number;
  totalProducts: number;
  activeProducts: number;
  totalContactRequests: number;
}

export interface AdminDashboardResponse {
  success: boolean;
  data: AdminDashboardData;
}

export interface AdminCompanyDto extends CompanyDto {
  verificationRejectionReason?: string;
  userId: number;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
}

export interface AdminCompanyListResponse {
  success: boolean;
  companies: AdminCompanyDto[];
}

export const adminApi = {
  getDashboard: () => fetchApi<AdminDashboardResponse>("/Admin/dashboard"),

  getAllCompanies: () => fetchApi<AdminCompanyListResponse>("/Admin/companies"),

  getPendingCompanies: () => fetchApi<AdminCompanyListResponse>("/Admin/companies/pending"),

  verifyCompany: (id: number, data: { approve: boolean; rejectionReason?: string }) =>
    fetchApi<CompanyResponse>(`/Admin/companies/${id}/verify`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

