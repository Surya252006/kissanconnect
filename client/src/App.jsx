import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Navbar from './components/layout/Navbar.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'

import Marketplace from './pages/marketplace/Marketplace.jsx'
import ProductDetails from './pages/marketplace/ProductDetails.jsx'
import PriceInsights from './pages/price/PriceInsights.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'

import MyProducts from './pages/farmer/MyProducts.jsx'
import AddProduct from './pages/farmer/AddProduct.jsx'
import EditProduct from './pages/farmer/EditProduct.jsx'

import MyOrders from './pages/orders/MyOrders.jsx'
import OrderDetails from './pages/orders/OrderDetails.jsx'
import FarmerOrders from './pages/farmer/FarmerOrders.jsx'

import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import Verification from './pages/admin/Verification.jsx'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
          <Routes>
            <Route path="/" element={<Marketplace />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/price-insights" element={<PriceInsights />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Buyer Order Routes */}
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />

            {/* Farmer Protected Routes */}
            <Route
              path="/farmer/products"
              element={
                <ProtectedRoute allowedRoles={['FARMER']}>
                  <MyProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/products/add"
              element={
                <ProtectedRoute allowedRoles={['FARMER']}>
                  <AddProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/products/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['FARMER']}>
                  <EditProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/orders"
              element={
                <ProtectedRoute allowedRoles={['FARMER']}>
                  <FarmerOrders />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/verifications"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Verification />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App