export const API_BASE = import.meta.env.MODE === 'development' ? 'http://localhost:5001' : '';

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return response;
};
