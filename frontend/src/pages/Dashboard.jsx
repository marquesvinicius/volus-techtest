import { useState, useEffect, useMemo } from 'react';
import MetricCard from '../components/MetricCard';
import DonutChart from '../components/DonutChart';
import productService from '../services/productService';

// Ícones SVG (sem dependências externas)
const Icons = {
  DollarSign: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  ),
  ShoppingCart: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  ),
  Users: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  Activity: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  ),
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(value);

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Ajustado para buscar todos os produtos, não apenas a primeira página
        const response = await productService.getProducts({ page_size: 500 });
        setProducts(response.results || []);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        // Fallback para dados estáticos em caso de erro na API
        setProducts([
          { id: 1, name: 'Produto A', category: 'Eletrônicos', price: 100, stock: 10 },
          { id: 2, name: 'Produto B', category: 'Livros', price: 20, stock: 50 },
          { id: 3, name: 'Produto C', category: 'Móveis', price: 50, stock: 20 },
          { id: 4, name: 'Produto D', category: 'Roupas', price: 30, stock: 30 },
          { id: 5, name: 'Produto E', category: 'Alimentos', price: 15, stock: 100 },
          { id: 6, name: 'Produto F', category: 'Eletrônicos', price: 200, stock: 5 },
          { id: 7, name: 'Produto G', category: 'Livros', price: 10, stock: 100 },
          { id: 8, name: 'Produto H', category: 'Móveis', price: 70, stock: 15 },
          { id: 9, name: 'Produto I', category: 'Roupas', price: 40, stock: 40 },
          { id: 10, name: 'Produto J', category: 'Alimentos', price: 25, stock: 200 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const chartData = useMemo(() => {
    if (!products.length) {
      return [
        { label: 'Eletrônicos', value: 14700 },
        { label: 'Livros', value: 11350 },
        { label: 'Móveis', value: 8900 },
        { label: 'Roupas', value: 11200 },
        { label: 'Alimentos', value: 9300 },
      ];
    }

    const categoryMap = products.reduce((acc, product) => {
      const categoryName = product.category_display || product.category || 'Sem categoria';
      const numericPrice = Number(product.price) || 0;
      const units = Number(product.stock) || 0;
      const value = numericPrice * units;
      acc[categoryName] = (acc[categoryName] || 0) + value;
      return acc;
    }, {});

    return Object.entries(categoryMap).map(([label, value]) => ({ label, value }));
  }, [products]);

  const metrics = useMemo(() => {
    if (!products.length) {
      return {
        totalRevenue: 24500,
        productsSold: 1234,
        newCustomers: 89,
        conversionRate: 3.2,
      };
    }

    const totalRevenue = products.reduce((sum, product) => {
      const numericPrice = Number(product.price) || 0;
      const units = Number(product.stock) || 0;
      return sum + numericPrice * units;
    }, 0);

    const totalUnits = products.reduce((sum, product) => sum + (Number(product.stock) || 0), 0);

    return {
      totalRevenue,
      productsSold: totalUnits,
      newCustomers: 89, // placeholder
      conversionRate: 3.2, // placeholder
    };
  }, [products]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-volus-jet">Dashboard</h1>
        <p className="text-volus-davys-gray mt-1">Visão geral do desempenho comercial</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8">
        <div className="bg-white rounded-3xl shadow-card border border-white/60 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-volus-jet">Vendas por Categoria</h2>
              <p className="text-sm text-volus-davys-gray mt-1">Distribuição de receita por categoria de produto</p>
            </div>
          </div>

          <DonutChart data={chartData} currency loading={loading} />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          <MetricCard
            title="Vendas totais"
            value={formatCurrency(metrics.totalRevenue)}
            icon={Icons.DollarSign}
            accentColor="#1CCF6C"
            delta="+12% vs mês anterior"
            deltaPositive
          />

          <MetricCard
            title="Produtos vendidos"
            value={metrics.productsSold.toLocaleString('pt-BR')}
            icon={Icons.ShoppingCart}
            accentColor="#0EA5E9"
            delta="+8% vs mês anterior"
            deltaPositive
          />

          <MetricCard
            title="Novos clientes"
            value={metrics.newCustomers.toLocaleString('pt-BR')}
            icon={Icons.Users}
            accentColor="#F59E0B"
            delta="-3% vs mês anterior"
            deltaPositive={false}
          />

          <MetricCard
            title="Taxa de conversão"
            value={`${metrics.conversionRate.toFixed(1)}%`}
            icon={Icons.Activity}
            accentColor="#8B5CF6"
            delta="+0.5% vs mês anterior"
            deltaPositive
          />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-card border border-white/60 p-6">
        <h2 className="text-xl font-semibold text-volus-jet mb-4">Atividade recente</h2>
        <div className="flex items-center justify-center py-10 text-volus-davys-gray">
          Este módulo será implementado nas próximas etapas.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

