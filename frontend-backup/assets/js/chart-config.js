/**
 * Configuração do Chart.js - Gráfico de Vendas por Categoria
 * Prova Técnica Vólus
 * 
 * Features:
 * - Modo Normal: Gráfico estático e funcional
 * - Modo MALUQUICE: Redistribuição mantendo total constante
 */

(function() {
    'use strict';

    // Dados do gráfico (serão carregados da API)
    let categoryData = {
        labels: [],
        values: [],
        colors: [
            '#1CCC67', // Verde Vólus
            '#17A555', // Verde escuro
            '#76C96E', // Verde claro
            '#5E5E5E', // Cinza
            '#2C3E50'  // Cinza escuro
        ]
    };

    // Total constante (será calculado após carregar dados)
    let TOTAL_CONSTANT = 0;

    // Estado do gráfico
    let chartInstance = null;
    let originalValues = [...categoryData.values];
    let isHovering = false;

    /**
     * Carrega dados da API Django
     */
    async function loadChartData() {
        try {
            const response = await fetch('/api/products/');
            const data = await response.json();
            
            // Agregar por categoria
            const categoryTotals = {};
            const categoryLabels = {
                'eletronicos': 'Eletrônicos',
                'livros': 'Livros',
                'moveis': 'Móveis',
                'roupas': 'Roupas',
                'alimentos': 'Alimentos'
            };
            
            data.products.forEach(product => {
                const price = parseFloat(product.price);
                if (!categoryTotals[product.category]) {
                    categoryTotals[product.category] = 0;
                }
                categoryTotals[product.category] += price * product.stock;
            });
            
            // Preenche arrays
            categoryData.labels = [];
            categoryData.values = [];
            
            Object.keys(categoryLabels).forEach(key => {
                if (categoryTotals[key]) {
                    categoryData.labels.push(categoryLabels[key]);
                    categoryData.values.push(categoryTotals[key]);
                }
            });
            
            // Se não há dados, usa valores de exemplo
            if (categoryData.values.length === 0) {
                categoryData.labels = ['Eletrônicos', 'Livros', 'Móveis', 'Roupas', 'Alimentos'];
                categoryData.values = [45000, 32000, 28000, 21000, 14000];
            }
            
            TOTAL_CONSTANT = categoryData.values.reduce((acc, val) => acc + val, 0);
            originalValues = [...categoryData.values];
            
            return true;
        } catch (error) {
            console.error('Erro ao carregar dados do gráfico:', error);
            // Usa dados de exemplo em caso de erro
            categoryData.labels = ['Eletrônicos', 'Livros', 'Móveis', 'Roupas', 'Alimentos'];
            categoryData.values = [45000, 32000, 28000, 21000, 14000];
            TOTAL_CONSTANT = categoryData.values.reduce((acc, val) => acc + val, 0);
            originalValues = [...categoryData.values];
            return false;
        }
    }

    /**
     * Inicializa o gráfico
     */
    async function initChart() {
        const canvas = document.getElementById('salesChart');
        if (!canvas) {
            console.error('Canvas #salesChart não encontrado');
            return;
        }

        // Carrega dados antes de criar o gráfico
        await loadChartData();

        const ctx = canvas.getContext('2d');

        // Configuração do Chart.js
        chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categoryData.labels,
                datasets: [{
                    data: categoryData.values,
                    backgroundColor: categoryData.colors,
                    borderWidth: 2,
                    borderColor: '#FFFFFF',
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#FFFFFF'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 16,
                            font: {
                                family: 'Roboto, sans-serif',
                                size: 14,
                                weight: '500'
                            },
                            color: '#212529',
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        enabled: false, // Desabilita tooltip padrão para usar custom
                        external: handleTooltip
                    }
                },
                onHover: (event, activeElements) => {
                    if (isCrazyModeEnabled()) {
                        handleCrazyModeHover(activeElements);
                    }
                },
                animation: {
                    duration: 200,
                    easing: 'easeInOutQuad'
                }
            }
        });

        console.log('✅ Chart.js inicializado com sucesso');
        console.log('🎭 Modo MALUQUICE:', isCrazyModeEnabled() ? 'ATIVADO' : 'DESATIVADO');
    }

    /**
     * Tooltip personalizado externo
     */
    function handleTooltip(context) {
        const tooltipEl = document.getElementById('chartTooltip');
        if (!tooltipEl) return;

        const tooltipModel = context.tooltip;

        // Oculta se não há tooltip
        if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = '0';
            tooltipEl.style.pointerEvents = 'none';
            return;
        }

        // Renderiza conteúdo
        if (tooltipModel.body) {
            const dataIndex = tooltipModel.dataPoints[0].dataIndex;
            const label = categoryData.labels[dataIndex];
            const value = tooltipModel.dataPoints[0].parsed;
            const percentage = ((value / TOTAL_CONSTANT) * 100).toFixed(1);

            tooltipEl.innerHTML = `
                <div class="tooltip-header">${label}</div>
                <div class="tooltip-body">
                    <strong>${formatCurrency(value)}</strong>
                    <span class="tooltip-percentage">${percentage}%</span>
                </div>
            `;
        }

        // Posiciona tooltip
        const canvas = chartInstance.canvas;
        const position = canvas.getBoundingClientRect();

        tooltipEl.style.opacity = '1';
        tooltipEl.style.pointerEvents = 'auto';
        tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
        tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
    }

    /**
     * 🎭 Modo MALUQUICE: Redistribuição mantendo total constante
     * Quando hover em um segmento, seu valor aumenta sutilmente
     * e os outros diminuem proporcionalmente para manter o total
     */
    function handleCrazyModeHover(activeElements) {
        if (!chartInstance) return;

        // Se não há hover, restaura valores originais
        if (activeElements.length === 0) {
            if (isHovering) {
                chartInstance.data.datasets[0].data = [...originalValues];
                chartInstance.update('none'); // Sem animação para suavidade
                isHovering = false;
            }
            return;
        }

        isHovering = true;
        const hoveredIndex = activeElements[0].index;
        const newValues = [];

        // Aumenta o valor hover em 5%
        const hoveredValue = originalValues[hoveredIndex];
        const increase = hoveredValue * 0.05;
        newValues[hoveredIndex] = hoveredValue + increase;

        // Redistribui a diferença nos outros
        const remainingIndices = originalValues
            .map((_, idx) => idx)
            .filter(idx => idx !== hoveredIndex);

        let totalRemaining = TOTAL_CONSTANT - newValues[hoveredIndex];
        let originalRemaining = TOTAL_CONSTANT - hoveredValue;

        remainingIndices.forEach(idx => {
            const proportion = originalValues[idx] / originalRemaining;
            newValues[idx] = totalRemaining * proportion;
        });

        // Atualiza gráfico sem animação para transição suave
        chartInstance.data.datasets[0].data = newValues;
        chartInstance.update('none');
    }

    /**
     * Inicializa quando DOM carregar
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChart);
    } else {
        initChart();
    }

})();
