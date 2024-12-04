import axios from "axios";

const BASE_URL = "http://localhost:5050/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const signUp = async (data) => {
  try {
    const response = await apiClient.post("/auth/signup", data);
    return response;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const signIn = async (data) => {
  try {
    const response = await apiClient.post("/auth/signin", data);
    return response;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    const response = await apiClient.post("/auth/logout");
    return response;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const forgotPassword = async (data) => {
  try {
    const response = await apiClient.post("/auth/forgot-password", data);
    return response;
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error;
  }
};

export const verifyUserEmail = async (data) => {
  try {
    const response = await apiClient.post(`/auth/verify-email`, data);
    return response;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};

export const resetPassword = async (data, resetToken) => {
  try {
    const response = await apiClient.post(
      `/auth/reset-password/${resetToken}`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};
