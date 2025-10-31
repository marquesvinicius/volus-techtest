import { useState, useEffect, useMemo } from 'react';
import productService from '../services/productService';
import MetricCard from '../components/MetricCard'; // Importar o MetricCard
import { Line } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Ícones para os cards
const Icons = {
  DollarSign: ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
  BarChart: ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>,
  Package: ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>,
  PieChart: ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>,
};


const ReportsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

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
        totalRevenue: 0,
        avgPrice: 0,
        lowStockCount: 0,
        categoriesDistribution: [],
        priceRanges: { labels: [], data: [] },
      };
    }

    const totalRevenue = products.reduce((acc, p) => acc + (parseFloat(p.price) * p.stock), 0);
    const avgPrice = products.reduce((acc, p) => acc + parseFloat(p.price), 0) / products.length;
    const lowStockCount = products.filter(p => p.stock < 10).length;

    // Distribuição por categoria
    const categoryCount = products.reduce((acc, p) => {
      const cat = p.category_display || 'Outros';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    const categoriesDistribution = Object.entries(categoryCount).map(([name, count]) => ({
      name,
      count,
      percentage: ((count / products.length) * 100).toFixed(1),
    }));

    // Faixas de preço
    const priceRanges = {
      '0-50': 0,
      '51-100': 0,
      '101-200': 0,
      '201-500': 0,
      '500+': 0,
    };

    products.forEach(p => {
      const price = parseFloat(p.price);
      if (price <= 50) priceRanges['0-50']++;
      else if (price <= 100) priceRanges['51-100']++;
      else if (price <= 200) priceRanges['101-200']++;
      else if (price <= 500) priceRanges['201-500']++;
      else priceRanges['500+']++;
    });

    const priceRangesData = {
      labels: Object.keys(priceRanges),
      data: Object.values(priceRanges),
    };

    return { totalRevenue, avgPrice, lowStockCount, categoriesDistribution, priceRanges: priceRangesData };
  }, [products, loading]);

  const lineChartData = {
    labels: reportData.priceRanges.labels,
    datasets: [
      {
        label: 'Produtos por Faixa de Preço',
        data: reportData.priceRanges.data,
        fill: true,
        backgroundColor: 'rgba(28, 204, 103, 0.2)',
        borderColor: 'rgba(28, 204, 103, 1)',
        tension: 0.4,
      },
    ],
  };

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  if (loading) return <div className="flex items-center justify-center py-12"><p className="text-volus-davys-gray">Carregando relatórios...</p></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-volus-jet dark:text-volus-dark-500">Relatórios</h1>
        <p className="text-volus-davys-gray dark:text-volus-dark-600 mt-1">Análise detalhada e insights do seu inventário.</p>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Valor Total em Estoque"
          value={formatCurrency(reportData.totalRevenue)}
          subtitle="Soma do preço x estoque de todos os produtos"
          icon={Icons.DollarSign}
          accentColor="#1CCF6C"
        />
        <MetricCard
          title="Preço Médio por Item"
          value={formatCurrency(reportData.avgPrice)}
          subtitle="Média de preço de todos os produtos"
          icon={Icons.BarChart}
          accentColor="#0EA5E9"
        />
        <MetricCard
          title="Itens com Estoque Baixo"
          value={`${reportData.lowStockCount} produtos`}
          subtitle="Produtos com 10 ou menos unidades"
          icon={Icons.Package}
          accentColor="#F59E0B"
        />
        <MetricCard
          title="Categorias Únicas"
          value={`${reportData.categoriesDistribution.length} categorias`}
          subtitle="Total de categorias de produtos ativas"
          icon={Icons.PieChart}
          accentColor="#8B5CF6"
        />
      </div>

      {/* Gráfico de Linha */}
      <div className="bg-white dark:bg-volus-dark-800 p-6 rounded-2xl shadow-card dark:border dark:border-volus-dark-700">
        <h2 className="text-xl font-semibold text-volus-jet dark:text-volus-dark-500 mb-4">Distribuição por Faixa de Preço</h2>
        <div className="h-64">
          <Line data={lineChartData} options={{ 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: {
                  color: isDarkMode ? '#C9D1D9' : '#333333',
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  color: isDarkMode ? '#8B949E' : '#5e5e5e',
                },
                grid: {
                  color: isDarkMode ? 'rgba(139, 148, 158, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                }
              },
              y: {
                ticks: {
                  color: isDarkMode ? '#8B949E' : '#5e5e5e',
                },
                grid: {
                  color: isDarkMode ? 'rgba(139, 148, 158, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                }
              }
            }
          }} />
        </div>
      </div>

      {/* Tabela de Categorias */}
      <div className="bg-white dark:bg-volus-dark-800 rounded-2xl shadow-card overflow-hidden dark:border dark:border-volus-dark-700">
        <div className="p-6 border-b dark:border-volus-dark-700">
          <h2 className="text-xl font-semibold text-volus-jet dark:text-volus-dark-500">Distribuição por Categoria</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-volus-dark-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-volus-dark-600 uppercase">Categoria</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-volus-dark-600 uppercase">Quantidade</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-volus-dark-600 uppercase">Percentual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-volus-dark-700">
              {reportData.categoriesDistribution.map(cat => (
                <tr key={cat.name} className="hover:bg-gray-50 dark:hover:bg-volus-dark-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-volus-dark-500">{cat.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 dark:text-volus-dark-600">{cat.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-emerald-600 font-semibold">{cat.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;

