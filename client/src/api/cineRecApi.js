// src/api/cineRecApi.js
import axios from 'axios';

const cineRecApi = axios.create({
  baseURL: 'https://movie-recommendation-app-cph3.onrender.com/api' // Your backend URL
});

// Add a request interceptor to include the token
cineRecApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (userData) => cineRecApi.post('/users/register', userData);
export const login = (userData) => cineRecApi.post('/users/login', userData);
export const addToList = (listData) => cineRecApi.post('/lists/add', listData);
export const getLists = () => cineRecApi.get('/lists');
export const getRecommendations = (page = 1) => cineRecApi.get('/recommendations?page=${page}');
export const removeFromList = (listData) => cineRecApi.post('/lists/remove', listData);