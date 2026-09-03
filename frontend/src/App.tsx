import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './layouts/AdminLayout';
import { Role } from './types';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ForbiddenPage } from './pages/ForbiddenPage';

// We'll import these as we create them
import { CustomerListPage } from './pages/customers/CustomerListPage';
import { CustomerDetailPage } from './pages/customers/CustomerDetailPage';
import { CustomerFormPage } from './pages/customers/CustomerFormPage';

import { ProductListPage } from './pages/products/ProductListPage';
import { ProductDetailPage } from './pages/products/ProductDetailPage';
import { ProductFormPage } from './pages/products/ProductFormPage';

import { StockMovementPage } from './pages/inventory/StockMovementPage';
import { RecordMovementPage } from './pages/inventory/RecordMovementPage';

import { ChallanListPage } from './pages/challans/ChallanListPage';
import { ChallanDetailPage } from './pages/challans/ChallanDetailPage';
import { CreateChallanPage } from './pages/challans/CreateChallanPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />

      <Route path="/" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />

          {/* Customers */}
          <Route element={<ProtectedRoute roles={[Role.ADMIN, Role.SALES]} />}>
            <Route path="customers" element={<CustomerListPage />} />
            <Route path="customers/new" element={<CustomerFormPage />} />
            <Route path="customers/:id" element={<CustomerDetailPage />} />
            <Route path="customers/:id/edit" element={<CustomerFormPage />} />
          </Route>

          {/* Products */}
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route element={<ProtectedRoute roles={[Role.ADMIN, Role.WAREHOUSE]} />}>
            <Route path="products/new" element={<ProductFormPage />} />
            <Route path="products/:id/edit" element={<ProductFormPage />} />
          </Route>

          {/* Inventory */}
          <Route element={<ProtectedRoute roles={[Role.ADMIN, Role.WAREHOUSE]} />}>
            <Route path="inventory" element={<StockMovementPage />} />
            <Route path="inventory/new" element={<RecordMovementPage />} />
          </Route>

          {/* Challans */}
          <Route element={<ProtectedRoute roles={[Role.ADMIN, Role.SALES, Role.ACCOUNTS]} />}>
            <Route path="challans" element={<ChallanListPage />} />
            <Route path="challans/:id" element={<ChallanDetailPage />} />
          </Route>
          <Route element={<ProtectedRoute roles={[Role.ADMIN, Role.SALES]} />}>
            <Route path="challans/new" element={<CreateChallanPage />} />
          </Route>

        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
