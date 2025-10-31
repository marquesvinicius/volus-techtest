import { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const defaultColors = ['#1CCF6C', '#22D97A', '#4FE58F', '#7BEDA8', '#1F2B3A'];

const DonutChart = ({ data = [], colors = defaultColors, currency = false, loading = false }) => {
  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  const chartConfig = useMemo(() => {
    if (!data.length) {
      return null;
    }

    return {
      labels: data.map((item) => item.label),
      datasets: [
        {
          data: data.map((item) => item.value),
          backgroundColor: data.map((_, index) => colors[index % colors.length]),
          hoverBackgroundColor: data.map((_, index) => colors[index % colors.length]),
          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    };
  }, [data, colors]);

  const formattedLegend = useMemo(() => {
    if (!data.length) return [];

    return data.map((item, index) => ({
      ...item,
      color: colors[index % colors.length],
      percentage: total ? ((item.value / total) * 100).toFixed(1) : 0,
    }));
  }, [data, colors, total]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-volus-davys-gray">Carregando gráfico...</p>
      </div>
    );
  }

  if (!data.length || !chartConfig) {
    return (
      <div className="flex items-center justify-center w-full h-64 bg-gray-50 rounded-lg">
        <p className="text-volus-davys-gray">Sem dados disponíveis</p>
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    layout: {
      padding: 20,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1f2937',
        padding: 12,
        titleFont: {
          family: 'Roboto, sans-serif',
          size: 14,
          weight: '600',
        },
        bodyFont: {
          family: 'Roboto, sans-serif',
          size: 13,
          weight: '500',
        },
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const perc = total ? ((value / total) * 100).toFixed(1) : 0;
            const formatter = new Intl.NumberFormat('pt-BR', {
              style: currency ? 'currency' : 'decimal',
              currency: 'BRL',
              maximumFractionDigits: currency ? 2 : 0,
            });
            const formattedValue = currency ? formatter.format(value) : `${formatter.format(value)} itens`;
            return `${formattedValue} • ${perc}%`;
          },
          title: (context) => context[0].label,
        },
      },
    },
  };

  return (
    <div className="flex flex-col">
      <div className="relative h-[360px]">
        <Doughnut data={chartConfig} options={options} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
        {formattedLegend.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-volus-davys-gray">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></span>
            <span>{item.label} • {item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
