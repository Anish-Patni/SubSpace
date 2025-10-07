import axiosInstance from '@/utility/axiosInterceptor';

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export const authService = {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/register', credentials);
    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  async getCurrentUser() {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  }
};
