import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import CategoriesPage from './pages/ProductFilter';
import StockControlPage from './pages/StockControlPage';
import ReportsPage from './pages/ReportsPage';
import Settings from './pages/Settings';
import ProfilePage from './pages/ProfilePage';
import { isCrazyModeEnabled } from './utils/validation';
import './styles/CrazyMode.css';

function App() {
  const [crazyMode, setCrazyMode] = useState(isCrazyModeEnabled());

  useEffect(() => {
    const handleStorageChange = () => {
      setCrazyMode(isCrazyModeEnabled());
    };

    window.addEventListener('storage', handleStorageChange);

    // Set initial class
    if (isCrazyModeEnabled()) {
      document.body.classList.add('crazy-mode');
    } else {
      document.body.classList.remove('crazy-mode');
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.body.classList.remove('crazy-mode');
    };
  }, []);

  useEffect(() => {
    if (crazyMode) {
      document.body.classList.add('crazy-mode');
    } else {
      document.body.classList.remove('crazy-mode');
    }
  }, [crazyMode]);

  return (
    <ThemeProvider>
      <AuthProvider>
        {crazyMode && <div className="crazy-mode-background"></div>}
        <Router>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
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
              path="/produtos/busca-avancada"
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
              path="/perfil" // Adicionar a nova rota
              element={
                <PrivateRoute>
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </PrivateRoute>
              }
            />
            
                <Route
                  path="/relatorios"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <ReportsPage />
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
    </ThemeProvider>
  );
}

export default App;
