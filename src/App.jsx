import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/admin/Dashboard";
import CategoryPage from "./pages/admin/CategoryPage";
import SubCategoryPage from "./pages/admin/SubCategoryPage";
import BlogPage from "./pages/admin/BlogPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/admin" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />

          <Route path="/categories" element={
            <ProtectedRoute><CategoryPage /></ProtectedRoute>
          } />

          <Route path="/subcategories" element={
            <ProtectedRoute><SubCategoryPage /></ProtectedRoute>
          } />

          <Route path="/blogs" element={
            <ProtectedRoute><BlogPage /></ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
