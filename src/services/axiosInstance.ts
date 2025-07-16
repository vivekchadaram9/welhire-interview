import axios,  { type AxiosInstance, type AxiosRequestConfig,type AxiosResponse, AxiosError } from 'axios';
import { BASE_URL } from './api-constants';
import { getTokens, storeTokens, clearTokens } from '../utils/authUtils';

export const BaseAxiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'Cache-Control': 'no-cache',
  },
});

BaseAxiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<any> => {
    const response = error.response;

    if (response?.status === 401) {
      const { refreshToken } = getTokens();

      try {
        if (refreshToken) {
          const refreshResponse = await BaseAxiosInstance.post('/app/refreshToken', {
            refreshToken,
          });

          const { authToken: newAuthToken, refreshToken: newRefreshToken } =
            refreshResponse?.data?.result ?? {};

          if (newAuthToken && newRefreshToken) {
            storeTokens(newAuthToken, newRefreshToken);

            const originalRequest = error.config as AxiosRequestConfig;
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${newAuthToken}`;
            }

            return BaseAxiosInstance(originalRequest);
          }
        } else {
          // TODO: logout or redirect to login
        }
      } catch (refreshError) {
        clearTokens(); 
      }
    }

    return Promise.reject(error);
  }
);
