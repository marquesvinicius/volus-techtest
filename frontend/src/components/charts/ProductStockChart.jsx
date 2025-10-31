import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const barColors = ['#1CCF6C', '#0EA5E9', '#8B5CF6', '#F59E0B', '#F97316'];

const fallbackProducts = [
  { name: 'Café Gourmet Especial', category: 'Alimentos', stock: 14, price: 34.9 },
  { name: 'Notebook Acer Nitro 5', category: 'Eletrônicos', stock: 18, price: 3850 },
  { name: 'Cadeira Ergonômica Premium', category: 'Móveis', stock: 22, price: 1299 },
  { name: 'Jaqueta Tech Impermeável', category: 'Roupas', stock: 27, price: 459.9 },
  { name: 'Livro: Clean Architecture', category: 'Livros', stock: 31, price: 89.9 },
];

const ProductStockChart = ({ products = [], loading }) => {
  const spotlightProducts = useMemo(() => {
    if (loading) {
      return [];
    }

    const source = products.length ? products : fallbackProducts;

    const normalized = source
      .map((product) => ({
        label: product.name,
        category: product.category_display || product.category || 'Categoria não informada',
        stock: Number(product.stock) || 0,
        price: Number(product.price) || 0,
      }))
      .filter((item) => item.stock >= 0);

    if (!normalized.length) {
      return fallbackProducts;
    }

    return normalized
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5)
      .map((item) => ({
        ...item,
        totalValue: item.stock * item.price,
      }));
  }, [products, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-volus-davys-gray dark:text-volus-dark-600">
        Carregando indicadores de estoque...
      </div>
    );
  }

  const chartData = {
    labels: spotlightProducts.map((item) => item.label),
    datasets: [
      {
        data: spotlightProducts.map((item) => item.stock),
        backgroundColor: spotlightProducts.map((_, index) => barColors[index % barColors.length] + '33'),
        borderColor: spotlightProducts.map((_, index) => barColors[index % barColors.length]),
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    layout: {
      padding: {
        left: 12,
        right: 12,
        top: 8,
        bottom: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.15)',
        },
        ticks: {
          color: '#8B949E',
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#111827',
          callback: (value) => (value.length > 22 ? `${value.slice(0, 22)}…` : value),
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderColor: '#1CCF6C',
        borderWidth: 1.5,
        padding: 14,
        titleFont: {
          family: 'Roboto, sans-serif',
          size: 14,
          weight: '600',
        },
        bodyFont: {
          family: 'Roboto, sans-serif',
          size: 13,
        },
        callbacks: {
          title: (ctx) => spotlightProducts[ctx[0].dataIndex]?.label || '—',
          label: (ctx) => {
            const product = spotlightProducts[ctx.dataIndex];
            return product ? `Estoque: ${product.stock} unidade(s)` : '';
          },
          afterLabel: (ctx) => {
            const product = spotlightProducts[ctx.dataIndex];
            if (!product) return [];
            const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
            return [
              `Categoria: ${product.category}`,
              `Preço unitário: ${formatter.format(product.price)}`,
              `Valor em estoque: ${formatter.format(product.totalValue)}`,
            ];
          },
        },
      },
    },
  };

  return (
    <div>
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
      <p className="text-center text-xs text-volus-davys-gray/80 dark:text-volus-dark-600/80 mt-2">
        Passe seu mouse sobre os itens para ver mais detalhes.
      </p>
    </div>
  );
};

export default ProductStockChart;

