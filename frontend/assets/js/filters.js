/**
 * Filtros Dinâmicos jQuery - Cascata 3 Níveis
 * Prova Técnica Vólus
 * 
 * Features:
 * - Filtro cascata: Categoria → Subcategoria → Item
 * - Animações fadeIn/slideDown
 * - Multi-seleção com chips removíveis
 * - Busca em tempo real com debounce
 * - Performance: DocumentFragment, delegação de eventos
 * - Modo MALUQUICE: Coringa, regras ocultas, easter eggs
 */

(function($) {
    'use strict';

    // Dados estruturados dos filtros (dados estáticos para demonstração)
    const filterData = {
        'eletronicos': {
            'Smartphones': ['iPhone', 'Samsung Galaxy', 'Xiaomi', 'Motorola'],
            'Notebooks': ['MacBook', 'Dell', 'Lenovo', 'Asus'],
            'Tablets': ['iPad', 'Samsung Tab', 'Kindle'],
            'Acessórios': ['Mouse', 'Teclado', 'Fone', 'Webcam']
        },
        'livros': {
            'Ficção': ['1984', 'O Hobbit', 'Harry Potter', 'Senhor dos Anéis'],
            'Não-Ficção': ['Sapiens', 'Mindset', 'Inteligência Emocional'],
            'Clássicos': ['Dom Casmurro', 'Machado de Assis', 'Hamlet'],
            'Técnicos': ['Clean Code', 'JavaScript: The Good Parts', 'Design Patterns']
        },
        'moveis': {
            'Sala': ['Sofá', 'Mesa de Centro', 'Estante', 'Poltrona'],
            'Quarto': ['Cama', 'Guarda-Roupa', 'Criado-Mudo', 'Penteadeira'],
            'Escritório': ['Mesa', 'Cadeira Ergonômica', 'Estante para Livros'],
            'Cozinha': ['Mesa', 'Cadeiras', 'Armário', 'Balcão']
        },
        'roupas': {
            'Masculino': ['Camiseta', 'Calça Jeans', 'Jaqueta', 'Tênis'],
            'Feminino': ['Vestido', 'Blusa', 'Saia', 'Sapato'],
            'Infantil': ['Conjunto', 'Pijama', 'Macacão', 'Shorts'],
            'Acessórios': ['Mochila', 'Boné', 'Relógio', 'Óculos']
        },
        'alimentos': {
            'Bebidas': ['Café', 'Chá', 'Suco', 'Água'],
            'Doces': ['Chocolate', 'Biscoito', 'Bolo', 'Bala'],
            'Salgados': ['Nuts', 'Chips', 'Biscoito Salgado'],
            'Naturais': ['Granola', 'Mel', 'Castanhas', 'Frutas Secas']
        }
    };

    // Estado dos filtros
    let selectedFilters = {
        category: null,
        subcategory: null,
        items: []
    };

    // Elementos
    const $categorySelect = $('#categorySelect');
    const $subcategorySelect = $('#subcategorySelect');
    const $itemSelect = $('#itemSelect');
    const $searchInput = $('#searchInput');
    const $selectedChips = $('#chipsList');
    const $chipsContainer = $('#chipsContainer');
    const $resetBtn = $('#resetBtn');
    const $resultsContainer = $('#resultsList');
    const $resultsCount = $('#resultsCount');

    /**
     * Inicializa os filtros
     */
    function initFilters() {
        populateCategories();
        attachEventListeners();
        console.log('✅ Filtros jQuery inicializados');
        console.log('🎭 Modo MALUQUICE:', isCrazyModeEnabled() ? 'ATIVADO' : 'DESATIVADO');
    }

    /**
     * Popula o select de categorias
     */
    function populateCategories() {
        const $fragment = $(document.createDocumentFragment());
        
        // Adiciona opção padrão
        $fragment.append('<option value="">Selecione uma categoria</option>');
        
        // Modo MALUQUICE: Adiciona opção "Qualquer" (coringa)
        if (isCrazyModeEnabled()) {
            $fragment.append('<option value="*">✨ Qualquer (Coringa)</option>');
        }
        
        // Adiciona categorias
        Object.keys(filterData).forEach(category => {
            const displayName = category.charAt(0).toUpperCase() + category.slice(1);
            $fragment.append(`<option value="${category}">${displayName}</option>`);
        });
        
        $categorySelect.empty().append($fragment);
    }

    /**
     * Popula o select de subcategorias com animação
     */
    function populateSubcategories(category) {
        $subcategorySelect.prop('disabled', true).hide();
        $itemSelect.prop('disabled', true).hide();
        
        if (!category || category === '*') {
            if (category === '*' && isCrazyModeEnabled()) {
                // Modo MALUQUICE: Coringa zera níveis seguintes com animação
                $subcategorySelect.slideUp(300);
                $itemSelect.slideUp(300);
            }
            return;
        }
        
        const subcategories = filterData[category];
        if (!subcategories) return;
        
        const $fragment = $(document.createDocumentFragment());
        $fragment.append('<option value="">Selecione uma subcategoria</option>');
        
        Object.keys(subcategories).forEach(subcat => {
            $fragment.append(`<option value="${subcat}">${subcat}</option>`);
        });
        
        $subcategorySelect.empty().append($fragment)
            .prop('disabled', false)
            .fadeIn(400)
            .slideDown(300);
    }

    /**
     * Popula o select de itens com animação
     */
    function populateItems(category, subcategory) {
        $itemSelect.prop('disabled', true).hide();
        
        if (!category || !subcategory || category === '*') return;
        
        // Modo MALUQUICE: Regra oculta - Eletrônicos + Smartphones bloqueia Acessórios Genéricos
        if (isCrazyModeEnabled() && category === 'eletronicos' && subcategory === 'Smartphones') {
            const hasAccessories = filterData[category]['Acessórios'];
            if (hasAccessories) {
                // Remove temporariamente a opção de Acessórios
                console.log('🔒 Regra oculta ativada: Eletrônicos + Smartphones bloqueia Acessórios');
            }
        }
        
        const items = filterData[category][subcategory];
        if (!items) return;
        
        const $fragment = $(document.createDocumentFragment());
        $fragment.append('<option value="">Selecione um item (opcional)</option>');
        
        items.forEach(item => {
            $fragment.append(`<option value="${item}">${item}</option>`);
        });
        
        $itemSelect.empty().append($fragment)
            .prop('disabled', false)
            .fadeIn(400)
            .slideDown(300);
    }

    /**
     * Adiciona chip de filtro selecionado
     */
    function addChip(text, type, value) {
        const chipId = `chip-${type}-${value.replace(/\s+/g, '-')}`;
        
        // Evita chips duplicados
        if ($(`#${chipId}`).length > 0) return;
        
        const $chip = $('<div class="filter-chip" />')
            .attr('id', chipId)
            .attr('data-type', type)
            .attr('data-value', value)
            .html(`
                ${text}
                <button class="chip-remove" aria-label="Remover filtro ${text}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            `);
        
        // Modo MALUQUICE: Animação "poof" ao remover
        if (isCrazyModeEnabled()) {
            $chip.addClass('crazy-chip');
        }
        
        $selectedChips.append($chip);
        $chipsContainer.fadeIn(200);
        updateResults();
    }

    /**
     * Remove chip de filtro
     */
    function removeChip($chip) {
        if (isCrazyModeEnabled()) {
            // Modo MALUQUICE: Animação "poof"
            $chip.addClass('chip-poof').fadeOut(300, function() {
                $(this).remove();
                updateResults();
            });
        } else {
            $chip.fadeOut(200, function() {
                $(this).remove();
                updateResults();
            });
        }
    }

    /**
     * Busca em tempo real (com debounce)
     */
    const searchProducts = debounce(function(query) {
        const $results = $resultsContainer.find('.result-item');
        
        if (!query) {
            $results.show();
            updateResultsCount();
            return;
        }
        
        query = query.toLowerCase();
        let visibleCount = 0;
        
        $results.each(function() {
            const $item = $(this);
            const text = $item.text().toLowerCase();
            
            if (text.includes(query)) {
                $item.fadeIn(200);
                visibleCount++;
            } else {
                $item.fadeOut(200);
            }
        });
        
        updateResultsCount(visibleCount);
    }, 300);

    /**
     * Atualiza contador de resultados
     */
    function updateResultsCount(count) {
        const total = count !== undefined ? count : $resultsContainer.find('.result-item:visible').length;
        $resultsCount.text(`${total} produto(s) encontrado(s)`).fadeIn(200);
    }

    /**
     * Atualiza resultados (simulação)
     */
    function updateResults() {
        // Simulação de resultados baseados nos filtros
        const $results = $('<div class="results-list"></div>');
        
        // Para demonstração, vamos simular alguns resultados
        const sampleResults = [
            'Produto A - Exemplo',
            'Produto B - Exemplo',
            'Produto C - Exemplo'
        ];
        
        sampleResults.forEach(result => {
            $results.append(`<div class="result-item">${result}</div>`);
        });
        
        $resultsContainer.html($results).fadeIn(300);
        updateResultsCount();
    }

    /**
     * Reseta todos os filtros com animação
     */
    function resetFilters() {
        selectedFilters = {
            category: null,
            subcategory: null,
            items: []
        };
        
        $categorySelect.val('');
        $subcategorySelect.val('').prop('disabled', true).slideUp(300);
        $itemSelect.val('').prop('disabled', true).slideUp(300);
        $searchInput.val('');
        
        $selectedChips.find('.filter-chip').each(function() {
            removeChip($(this));
        });
        
        $resultsContainer.slideUp(300, function() {
            $(this).empty();
        });
        
        $resultsCount.fadeOut(200);
    }

    /**
     * Easter Egg: Livros + Ficção + Clássicos
     */
    let easterEggClickCount = 0;
    function checkEasterEgg() {
        if (!isCrazyModeEnabled()) return;
        
        const category = $categorySelect.val();
        const subcategory = $subcategorySelect.val();
        
        if (category === 'livros' && subcategory === 'Clássicos') {
            easterEggClickCount++;
            
            if (easterEggClickCount === 3) {
                $resultsContainer.addClass('glow-rainbow');
                console.log('🎉 EASTER EGG ATIVADO! 🌈');
                setTimeout(() => {
                    $resultsContainer.removeClass('glow-rainbow');
                    easterEggClickCount = 0;
                }, 3000);
            }
        } else {
            easterEggClickCount = 0;
        }
    }

    /**
     * Anexa event listeners
     */
    function attachEventListeners() {
        // Delegação de eventos no container
        $categorySelect.on('change', function() {
            const category = $(this).val();
            selectedFilters.category = category;
            populateSubcategories(category);
            
            if (category && category !== '*') {
                addChip($(this).find('option:selected').text(), 'category', category);
            }
        });

        $subcategorySelect.on('change', function() {
            const subcategory = $(this).val();
            const category = $categorySelect.val();
            selectedFilters.subcategory = subcategory;
            populateItems(category, subcategory);
            
            if (subcategory) {
                addChip($(this).find('option:selected').text(), 'subcategory', subcategory);
            }
            
            checkEasterEgg();
        });

        $itemSelect.on('change', function() {
            const item = $(this).val();
            if (item) {
                selectedFilters.items.push(item);
                addChip($(this).find('option:selected').text(), 'item', item);
                $(this).val(''); // Reset select após adicionar
            }
        });

        // Busca em tempo real
        $searchInput.on('input', function() {
            searchProducts($(this).val());
        });

        // Remover chips (delegação de eventos)
        $selectedChips.on('click', '.chip-remove', function() {
            const $chip = $(this).closest('.filter-chip');
            removeChip($chip);
        });

        // Reset
        $resetBtn.on('click', function() {
            resetFilters();
        });

        // Easter egg: Cliques no botão de busca
        $('#searchBtn').on('click', function() {
            checkEasterEgg();
        });
    }

    // Inicializa quando DOM estiver pronto
    $(document).ready(function() {
        initFilters();
    });

})(jQuery);

