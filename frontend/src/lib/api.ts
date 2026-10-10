const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    const data: ApiResponse<T> = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Network request failed',
    };
  }
}

export const api = {
  // Auth API
  auth: {
    login: (credentials: { identifier: string; password: string; role?: string }) =>
      request<{ user: any; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData: { name: string; phone?: string; email?: string; password: string; role?: string }) =>
      request<{ user: any; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    me: () => request<{ user: any }>('/auth/me'),
    logout: () => request<null>('/auth/logout', { method: 'POST' }),
  },

  // Properties API
  properties: {
    getAll: (params?: Record<string, string | number>) => {
      const qs = params
        ? '?' +
          Object.entries(params)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
            .join('&')
        : '';
      return request<any[]>(`/properties${qs}`);
    },
    getById: (id: string) => request<any>(`/properties/${id}`),
    create: (payload: any) =>
      request<any>('/properties', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    updateStatus: (id: string, status: string) =>
      request<any>(`/properties/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },

  // Wanted Properties API
  wanted: {
    getAll: (params?: Record<string, string>) => {
      const qs = params
        ? '?' +
          Object.entries(params)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
            .join('&')
        : '';
      return request<any[]>(`/wanted${qs}`);
    },
    create: (payload: any) =>
      request<any>('/wanted', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },

  // Inquiries API
  inquiries: {
    send: (payload: { propertyId: string; senderName: string; senderPhone?: string; message: string }) =>
      request<any>('/inquiries', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getAll: (propertyId?: string) =>
      request<any[]>(`/inquiries${propertyId ? `?propertyId=${propertyId}` : ''}`),
  },

  // Visits API
  visits: {
    request: (payload: { propertyId: string; requesterName: string; requesterPhone: string; date: string; time: string }) =>
      request<any>('/visits', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getAll: (propertyId?: string) =>
      request<any[]>(`/visits${propertyId ? `?propertyId=${propertyId}` : ''}`),
  },

  // Admin API
  admin: {
    getStats: () => request<any>('/admin/stats'),
    getPending: () => request<any[]>('/admin/properties/pending'),
    moderate: (id: string, action: 'approve' | 'reject' | 'suspend', reason?: string) =>
      request<any>(`/admin/properties/${id}/moderate`, {
        method: 'POST',
        body: JSON.stringify({ action, reason }),
      }),
    getReports: () => request<any[]>('/admin/reports'),
  },
};
