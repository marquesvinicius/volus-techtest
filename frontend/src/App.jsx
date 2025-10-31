import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import CategoriesPage from './pages/ProductFilter';
import StockControlPage from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota Pública */}
          <Route path="/login" element={<Login />} />
          
          {/* Rotas Privadas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/produtos"
            element={
              <PrivateRoute>
                <Layout>
                  <ProductList />
                </Layout>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/produtos/categorias"
            element={
              <PrivateRoute>
                <Layout>
                  <CategoriesPage />
                </Layout>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/produtos/estoque"
            element={
              <PrivateRoute>
                <Layout>
                  <StockControlPage />
                </Layout>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/relatorios"
            element={
              <PrivateRoute>
                <Layout>
                  <StockControlPage />
                </Layout>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/configuracoes"
            element={
              <PrivateRoute>
                <Layout>
                  <Settings />
                </Layout>
              </PrivateRoute>
            }
          />
          
          {/* Redirect para login se rota não encontrada */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
