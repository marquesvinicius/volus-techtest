import { useState, useEffect, useMemo } from 'react';
import productService from '../services/productService';
import MetricCard from '../components/MetricCard';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReportsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await productService.getProducts({ page_size: 500 });
        setProducts(response.results || []);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const reportData = useMemo(() => {
    if (loading || products.length === 0) {
      return {
        totalValue: 0,
        categoryCount: 0,
        topProducts: [],
        categoryChartData: { labels: [], datasets: [] },
      };
    }

    const totalValue = products.reduce((acc, p) => acc + (parseFloat(p.price) * p.stock), 0);
    const categoryCount = new Set(products.map(p => p.category_display)).size;
    
    const topProducts = [...products]
      .sort((a, b) => (parseFloat(b.price) * b.stock) - (parseFloat(a.price) * a.stock))
      .slice(0, 10);

    const categoryValues = products.reduce((acc, p) => {
      const category = p.category_display || 'Outros';
      const value = parseFloat(p.price) * p.stock;
      acc[category] = (acc[category] || 0) + value;
      return acc;
    }, {});

    const categoryLabels = Object.keys(categoryValues);
    const categoryData = Object.values(categoryValues);

    const categoryChartData = {
      labels: categoryLabels,
      datasets: [
        {
          label: 'Valor em Estoque por Categoria (R$)',
          data: categoryData,
          backgroundColor: 'rgba(28, 204, 103, 0.6)',
          borderColor: 'rgba(28, 204, 103, 1)',
          borderWidth: 1,
        },
      ],
    };

    return { totalValue, categoryCount, topProducts, categoryChartData };
  }, [products, loading]);

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  if (loading) return <div>Carregando relatórios...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-volus-jet">Relatórios</h1>
        <p className="text-volus-davys-gray mt-1">Análise detalhada do seu inventário de produtos.</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Valor Total em Estoque" value={formatCurrency(reportData.totalValue)} />
        <MetricCard title="Total de Produtos" value={products.length.toLocaleString('pt-BR')} />
        <MetricCard title="Categorias Únicas" value={reportData.categoryCount.toLocaleString('pt-BR')} />
      </div>

      {/* Gráfico */}
      <div className="bg-white p-6 rounded-2xl shadow-card">
        <h2 className="text-xl font-semibold text-volus-jet mb-4">Valor por Categoria</h2>
        <Bar data={reportData.categoryChartData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
      </div>

      {/* Tabela de Top Produtos */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <h2 className="text-xl font-semibold text-volus-jet p-6">Top 10 Produtos Mais Valiosos</h2>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor em Estoque</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reportData.topProducts.map(product => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category_display}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-semibold">
                  {formatCurrency(parseFloat(product.price) * product.stock)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;

