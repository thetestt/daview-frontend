// src/api/productApi.js

import axios from 'axios';

const API_BASE = 'http://localhost:8080/admin/products';

const getToken = () => localStorage.getItem('jwtToken');

export const getProductsByType = (type) =>
  axios.get(`${API_BASE}?type=${type}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const addProduct = (product) =>
  axios.post(API_BASE, product, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const updateProduct = (id, product) =>
  axios.put(`${API_BASE}/${id}`, product, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const deleteProduct = (id) =>
  axios.delete(`${API_BASE}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
