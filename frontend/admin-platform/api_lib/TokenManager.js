// TokenManager.js - Handles Auth0 token management

export const getToken = async () => {
  try {
    const response = await fetch('/api/auth/token')
    const { accessToken } = await response.json()
    return accessToken;
  } catch (error) {
    console.error('Error getting token:', error);
    throw error;
  }
};

export const refreshToken = async () => {
  return getToken(); // El endpoint ya maneja el refresh automáticamente
};