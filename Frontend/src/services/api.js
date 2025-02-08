// src/services/api.js
import axios from "axios";
import { LogIn } from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getPortfolioItems = async () => {
  try {
    const response = await axios.get("http://localhost:8000/api/portfolios/");
    return response.data;
    console.log(response);
  } catch (error) {
    console.error("Error fetching portfolio items:", error);
    throw error;
  }
};

export const getPortfolioItem = async (pkid) => {
  // Changed slug to pkid
  try {
    const response = await api.get(`/portfolios/${pkid}/`); // Changed slug to pkid
    return response.data;
  } catch (error) {
    console.error(`Error fetching portfolio item with id ${pkid}:`, error); // Changed slug to pkid
    throw error;
  }
};

// New function to fetch portfolio categories
export const getPortfolioCategories = async () => {
  try {
    const response = await api.get("/portfolio-categories/"); // Adjust the endpoint if needed
    return response.data;
  } catch (error) {
    console.error("Error fetching portfolio categories:", error);
    throw error;
  }
};
