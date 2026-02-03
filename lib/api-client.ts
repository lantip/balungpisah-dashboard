import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to attach auth token
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('access_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            window.location.href = '/';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async login(email: string, password: string) {
    const response = await this.client.post('/api/auth/login', { email, password });
    return response.data;
  }

  async getMe() {
    const response = await this.client.get('/api/auth/me');
    return response.data;
  }

  // Dashboard Summary
  async getDashboardSummary() {
    const response = await this.client.get('/api/dashboard/summary');
    return response.data;
  }

  async getRecentReports(days: number = 7, limit: number = 10) {
    const response = await this.client.get('/api/dashboard/recent', {
      params: { days, limit },
    });
    return response.data;
  }

  async getReportsByCategory(slug?: string, page: number = 1, pageSize: number = 10) {
    const response = await this.client.get('/api/dashboard/by-category', {
      params: { slug, page, page_size: pageSize },
    });
    return response.data;
  }

  async getReportsByLocation(provinceId?: string, regencyId?: string, page: number = 1, pageSize: number = 10) {
    const response = await this.client.get('/api/dashboard/by-location', {
      params: { province_id: provinceId, regency_id: regencyId, page, page_size: pageSize },
    });
    return response.data;
  }

  async getReportsByTag(tagType?: string, page: number = 1, pageSize: number = 10) {
    const response = await this.client.get('/api/dashboard/by-tag', {
      params: { tag_type: tagType, page, page_size: pageSize },
    });
    return response.data;
  }

  async getMapData(filters?: {
    provinceId?: string;
    regencyId?: string;
    category?: string;
    status?: string;
    limit?: number;
  }) {
    const response = await this.client.get('/api/dashboard/map', {
      params: {
        province_id: filters?.provinceId,
        regency_id: filters?.regencyId,
        category: filters?.category,
        status: filters?.status,
        limit: filters?.limit,
      },
    });
    return response.data;
  }

  // Reports
  async getReports(page: number = 1, pageSize: number = 10) {
    const response = await this.client.get('/api/dashboard/reports', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  }

  async getReport(id: string) {
    const response = await this.client.get(`/api/dashboard/reports/${id}`);
    return response.data;
  }

  async updateReportStatus(id: string, status: string, resolutionNotes?: string) {
    const response = await this.client.patch(`/api/reports/${id}/status`, {
      status,
      resolution_notes: resolutionNotes,
    });
    return response.data;
  }

  // Tickets
  async getTickets() {
    const response = await this.client.get('/api/tickets');
    return response.data;
  }

  async getTicket(id: string) {
    const response = await this.client.get(`/api/tickets/${id}`);
    return response.data;
  }

  // Categories
  async getCategories(tree: boolean = false) {
    const response = await this.client.get('/api/categories', {
      params: { tree },
    });
    return response.data;
  }

  // Rate Limits (Admin)
  async getRateLimitConfigs() {
    const response = await this.client.get('/api/admin/rate-limits');
    return response.data;
  }

  async getRateLimitConfig(key: string) {
    const response = await this.client.get(`/api/admin/rate-limits/${key}`);
    return response.data;
  }

  async updateRateLimitConfig(key: string, value: number) {
    const response = await this.client.put(`/api/admin/rate-limits/${key}`, {
      value,
    });
    return response.data;
  }

  // Regions
  async getProvinces(search?: string) {
    const response = await this.client.get('/api/regions/provinces', {
      params: { search },
    });
    return response.data;
  }

  async getRegencies(search?: string) {
    const response = await this.client.get('/api/regions/regencies', {
      params: { search },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
