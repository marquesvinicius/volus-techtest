import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const defaultColors = ['#1CCF6C', '#0EA5E9', '#8B5CF6', '#F59E0B', '#22D97A', '#FB7185'];

const DonutChart = ({ data = [], colors = defaultColors, currency = false, loading = false }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const chartRef = useRef(null);

  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  const originalValues = useMemo(() => data.map((item) => item.value), [data]);

  const redistributeValues = useCallback((hoveredIdx) => {
    if (hoveredIdx === null || !originalValues.length) {
      return [...originalValues];
    }

    const hoveredValue = originalValues[hoveredIdx] || 0;
    const otherTotal = originalValues.reduce((sum, value, index) => index === hoveredIdx ? sum : sum + value, 0);

    if (otherTotal === 0) {
      return [...originalValues];
    }

    const redistributionAmount = hoveredValue * 0.3;

    return originalValues.map((value, index) => {
      if (index === hoveredIdx) {
        return value - redistributionAmount;
      }

      const proportion = value / otherTotal;
      return value + redistributionAmount * proportion;
    });
  }, [originalValues]);

  const applyRedistribution = useCallback((hoveredIdx) => {
    const chartInstance = chartRef.current;
    if (!chartInstance) return;

    const dataset = chartInstance.data.datasets[0];
    if (!dataset) return;

    dataset.data = redistributeValues(hoveredIdx);
    chartInstance.update('none');
  }, [redistributeValues]);

  useEffect(() => {
    applyRedistribution(null);
  }, [applyRedistribution, originalValues]);

  const chartConfig = useMemo(() => {
    if (!data.length) {
      return null;
    }

    return {
      labels: data.map((item) => item.label),
      datasets: [
        {
          data: originalValues,
          backgroundColor: data.map((_, index) => colors[index % colors.length]),
          hoverBackgroundColor: data.map((_, index) => colors[index % colors.length]),
          borderWidth: 0,
          hoverOffset: 12,
          borderRadius: 6,
        },
      ],
    };
  }, [data, colors, originalValues]);

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
    animation: {
      duration: 0, // Desativa animações do Chart.js para evitar conflitos
    },
    onHover: (event, elements) => {
      const chartInstance = chartRef.current;
      if (!chartInstance) return;

      if (elements.length > 0) {
        const hoveredIdx = elements[0].index;
        if (hoveredIdx !== hoveredIndex) {
          setHoveredIndex(hoveredIdx);
        }
      } else if (hoveredIndex !== null) {
        setHoveredIndex(null);
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(31, 41, 55, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#e5e7eb',
        borderColor: '#1CCF6C',
        borderWidth: 2,
        cornerRadius: 12,
        padding: 16,
        displayColors: true,
        titleFont: {
          family: 'Roboto, sans-serif',
          size: 16,
          weight: '700',
        },
        bodyFont: {
          family: 'Roboto, sans-serif',
          size: 14,
          weight: '500',
        },
        footerFont: {
          family: 'Roboto, sans-serif',
          size: 12,
          weight: '400',
        },
        callbacks: {
          title: (context) => {
            return ` ${context[0].label}`;
          },
          label: (context) => {
            // Sempre usar os valores originais no tooltip
            const originalValue = data[context.dataIndex]?.value || context.parsed;
            const perc = total ? ((originalValue / total) * 100).toFixed(1) : 0;
            const formatter = new Intl.NumberFormat('pt-BR', {
              style: currency ? 'currency' : 'decimal',
              currency: 'BRL',
              maximumFractionDigits: currency ? 2 : 0,
            });
            const formattedValue = currency ? formatter.format(originalValue) : `${formatter.format(originalValue)} itens`;
            return `Valor: ${formattedValue}`;
          },
          afterLabel: (context) => {
            const originalValue = data[context.dataIndex]?.value || context.parsed;
            const perc = total ? ((originalValue / total) * 100).toFixed(1) : 0;
            const lines = [`Participação: ${perc}%`];
            
            if (context.dataIndex === hoveredIndex) {
              lines.push('Redistribuindo valores dinamicamente...');
            }
            
            // Adicionar informação sobre posição no ranking
            const sortedData = [...data].sort((a, b) => b.value - a.value);
            const position = sortedData.findIndex(item => item.label === context.label) + 1;
            lines.push(`Posição no ranking: ${position}º lugar`);
            
            return lines;
          },
          footer: (context) => {
            if (context.length > 0) {
              return ['', 'Passe o mouse sobre outras fatias para comparar'];
            }
            return [];
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col">
      <div className="relative h-[360px]">
        <Doughnut ref={chartRef} data={chartConfig} options={options} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {formattedLegend.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-volus-davys-gray dark:text-volus-dark-600">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></span>
            <span>{item.label} • {item.percentage}%</span>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-volus-davys-gray/80 dark:text-volus-dark-600/80 mt-4">
        Passe seu mouse sobre os itens para ver mais detalhes.
      </p>
    </div>
  );
};

export default DonutChart;
