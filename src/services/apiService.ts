import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiMethods, getTokens } from '../utils/authUtils';
import { BaseAxiosInstance } from './axiosInstance';

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  method: keyof typeof ApiMethods;
}

export const ApiRequest = async <T = any>(
  options: CustomAxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const onSuccess = (response: AxiosResponse<T>) => {
    return Promise.resolve(response);
  };

  const onError = (error: unknown) => {
    return Promise.reject(error);
  };

  try {
      const tokenObj = getTokens();
      if (tokenObj?.authToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${tokenObj.authToken}`,
        };
      }
    options.timeout = options.timeout || 60000;

    const response = await BaseAxiosInstance(options);
    return onSuccess(response);
  } catch (error) {
    return onError(error);
  }
};
