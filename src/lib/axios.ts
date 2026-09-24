import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { AppError } from "@/types/product";

const BASE_URL = "https://dummyjson.com";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request Interceptor: Attach bearer token if present
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("nova_auth_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Centralized Error Normalization
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    // If request was cancelled by AbortController, let it bubble up for handling
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    let message = "An unexpected error occurred. Please try again.";
    let status = error.response?.status;
    let retryable = true;

    if (error.response) {
      status = error.response.status;
      if (status === 401 || status === 403) {
        message = "Authentication error. Invalid or expired session.";
        retryable = false;
      } else if (status === 404) {
        message = "Requested item or resource was not found.";
        retryable = false;
      } else if (status >= 500) {
        message = "Server error from DummyJSON API. Please retry.";
      } else {
        message =
          error.response.data?.message ||
          error.response.data?.error ||
          `Request failed with status code ${status}`;
      }
    } else if (error.request) {
      message = "Network error. Unable to reach DummyJSON API server. Check your connection.";
    } else {
      message = error.message || message;
    }

    const appError: AppError = {
      message,
      status,
      retryable,
    };

    return Promise.reject(appError);
  }
);

export default apiClient;
