import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const initialState = {
  isLoading: false,
  productList: [],
  pagination: null, // ✅ NEW
};

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const result = await axios.post(
      `${API_BASE_URL}/api/admin/products/add`,
      formData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return result?.data;
  }
);

// ✅ UPDATED: accept page & limit
export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ page = 1, limit = 8 } = {}) => {
    const result = await axios.get(
      `${API_BASE_URL}/api/admin/products/get?page=${page}&limit=${limit}`
    );

    return result?.data;
  }
);

export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ id, formData }) => {
    const result = await axios.put(
      `${API_BASE_URL}/api/admin/products/edit/${id}`,
      formData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return result?.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id) => {
    const result = await axios.delete(
      `${API_BASE_URL}/api/admin/products/delete/${id}`
    );

    return result?.data;
  }
);

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload?.data || [];
        state.pagination = action.payload?.pagination || null; // ✅ NEW
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
        state.pagination = null; // ✅ NEW
      });
  },
});

export default AdminProductsSlice.reducer;
