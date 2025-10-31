import { useMemo, useState, useRef } from 'react';
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
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [redistributedData, setRedistributedData] = useState(null);
  const chartRef = useRef(null);

  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  // Função para redistribuir valores no hover
  const redistributeValues = (hoveredIdx) => {
    if (hoveredIdx === null || !data.length) return data;
    
    const hoveredValue = data[hoveredIdx].value;
    const otherValues = data.filter((_, idx) => idx !== hoveredIdx);
    const otherTotal = otherValues.reduce((sum, item) => sum + item.value, 0);
    
    // Redistribuir 30% do valor hover para os outros itens proporcionalmente
    const redistributionAmount = hoveredValue * 0.3;
    const newHoveredValue = hoveredValue - redistributionAmount;
    
    return data.map((item, idx) => {
      if (idx === hoveredIdx) {
        return { ...item, value: newHoveredValue };
      } else {
        const proportion = item.value / otherTotal;
        const additionalValue = redistributionAmount * proportion;
        return { ...item, value: item.value + additionalValue };
      }
    });
  };

  const chartConfig = useMemo(() => {
    if (!data.length) {
      return null;
    }

    const displayData = redistributedData || data;

    return {
      labels: data.map((item) => item.label),
      datasets: [
        {
          data: displayData.map((item) => item.value),
          backgroundColor: data.map((_, index) => colors[index % colors.length]),
          hoverBackgroundColor: data.map((_, index) => colors[index % colors.length]),
          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    };
  }, [data, colors, redistributedData]);

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
      duration: 300,
      easing: 'easeInOutQuart',
    },
    onHover: (event, elements) => {
      if (elements.length > 0) {
        const hoveredIdx = elements[0].index;
        if (hoveredIdx !== hoveredIndex) {
          setHoveredIndex(hoveredIdx);
          setRedistributedData(redistributeValues(hoveredIdx));
        }
      } else {
        setHoveredIndex(null);
        setRedistributedData(null);
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
            const position = sortedData.findIndex(item => item.value === originalValue) + 1;
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
