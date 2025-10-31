import { useState, useEffect, useMemo } from 'react';
import { isCrazyModeEnabled } from '../../utils/validation';

/**
 * Componente de Filtro Cascata (3 níveis)
 * Categoria → Subcategoria → Item
 * 
 * Features:
 * - Integração com API /api/categories/
 * - Animações fadeIn/slideDown
 * - Modo MALUQUICE: coringa, regra oculta
 */
const FilterCascade = ({ categoriesData, onSelectionChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLevel2, setShowLevel2] = useState(false);
  const [showLevel3, setShowLevel3] = useState(false);

  const crazyMode = isCrazyModeEnabled();

  // Estrutura de dados local para facilitar acesso
  const [filterData, setFilterData] = useState({});

  // Processa dados da API quando recebidos
  useEffect(() => {
    if (!categoriesData?.categories) return;

    const data = {};
    categoriesData.categories.forEach((cat) => {
      data[cat.name] = {};
      cat.subcategories.forEach((sub) => {
        data[cat.name][sub.name] = sub.items || [];
      });
    });
    setFilterData(data);
  }, [categoriesData]);

  // Prepara lista de categorias para o select, garantindo unicidade
  const categoryOptions = useMemo(() => {
    if (!categoriesData?.categories) return [];
    const seen = new Set();
    return categoriesData.categories.filter(cat => {
      const duplicate = seen.has(cat.name);
      seen.add(cat.name);
      return !duplicate;
    });
  }, [categoriesData]);

  // Atualiza subcategorias quando categoria muda
  useEffect(() => {
    if (!selectedCategory) {
      setAvailableSubcategories([]);
      setShowLevel2(false);
      setShowLevel3(false);
      setSelectedSubcategory('');
      setSelectedItem('');
      return;
    }

    // Modo MALUQUICE: Coringa zera níveis seguintes
    if (selectedCategory === '*') {
      setAvailableSubcategories([]);
      setShowLevel2(false);
      setShowLevel3(false);
      setSelectedSubcategory('');
      setSelectedItem('');
      return;
    }

    const subcats = filterData[selectedCategory] || {};
    const subcatList = Object.keys(subcats).map((name) => ({
      name,
      items: subcats[name],
    }));

    setAvailableSubcategories(subcatList);
    setShowLevel2(true);
    setSelectedSubcategory('');
    setSelectedItem('');
    setShowLevel3(false);
  }, [selectedCategory, filterData]);

  // Atualiza itens quando subcategoria muda
  useEffect(() => {
    if (!selectedCategory || !selectedSubcategory || selectedCategory === '*') {
      setAvailableItems([]);
      setShowLevel3(false);
      setSelectedItem('');
      return;
    }

    const items = filterData[selectedCategory]?.[selectedSubcategory] || [];

    // Modo MALUQUICE: Regra oculta - Eletrônicos + Smartphones bloqueia Acessórios
    if (crazyMode && selectedCategory === 'eletronicos' && selectedSubcategory === 'Smartphones') {
      // Remove Acessórios se existir
      const filteredItems = items.filter((item) => !item.toLowerCase().includes('acessório'));
      setAvailableItems(filteredItems);
      console.log('🔒 Regra oculta ativada: Eletrônicos + Smartphones bloqueia Acessórios');
    } else {
      setAvailableItems(items);
    }

    setShowLevel3(true);
    setSelectedItem('');
  }, [selectedCategory, selectedSubcategory, filterData, crazyMode]);

  // Notifica mudanças para componente pai
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({
        category: selectedCategory,
        subcategory: selectedSubcategory,
        item: selectedItem,
      });
    }
  }, [selectedCategory, selectedSubcategory, selectedItem, onSelectionChange]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
  };

  const handleSubcategoryChange = (e) => {
    const value = e.target.value;
    setSelectedSubcategory(value);
  };

  const handleItemChange = (e) => {
    const value = e.target.value;
    setSelectedItem(value);
    
    // Após selecionar item, reseta o select mas mantém o valor para adicionar chip
    if (value && onSelectionChange) {
      setTimeout(() => {
        setSelectedItem('');
      }, 100);
    }
  };

  if (!categoriesData || !categoryOptions.length) {
    return (
      <div className="text-center py-8 text-volus-davys-gray">
        <p>Carregando categorias...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Nível 1: Categoria */}
      <div className="filter-level">
        <label htmlFor="categorySelect" className="block text-sm font-medium text-volus-jet mb-2">
          Categoria
        </label>
        <select
          id="categorySelect"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-volus-emerald/50 transition-all duration-200 bg-white"
          aria-label="Selecionar categoria"
        >
          <option value="">Selecione uma categoria...</option>
          {crazyMode && (
            <option value="*">✨ Qualquer (Coringa)</option>
          )}
          {categoryOptions.map((cat, index) => (
            <option key={`${cat.name}-${index}`} value={cat.name}>
              {cat.display_name || cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Nível 2: Subcategoria */}
      <div
        className={`filter-level transition-all duration-300 ${
          showLevel2
            ? 'opacity-100 max-h-96 translate-y-0'
            : 'opacity-0 max-h-0 overflow-hidden -translate-y-2'
        }`}
      >
        <label htmlFor="subcategorySelect" className="block text-sm font-medium text-volus-jet mb-2">
          Subcategoria
        </label>
        <select
          id="subcategorySelect"
          value={selectedSubcategory}
          onChange={handleSubcategoryChange}
          disabled={!showLevel2}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-volus-emerald/50 transition-all duration-200 ${
            !showLevel2 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white'
          }`}
          aria-label="Selecionar subcategoria"
        >
          <option value="">Selecione uma subcategoria...</option>
          {availableSubcategories.map((subcat, index) => (
            <option key={`${subcat.name}-${index}`} value={subcat.name}>
              {subcat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Nível 3: Item */}
      <div
        className={`filter-level transition-all duration-300 ${
          showLevel3
            ? 'opacity-100 max-h-96 translate-y-0'
            : 'opacity-0 max-h-0 overflow-hidden -translate-y-2'
        }`}
      >
        <label htmlFor="itemSelect" className="block text-sm font-medium text-volus-jet mb-2">
          Item (opcional)
        </label>
        <select
          id="itemSelect"
          value={selectedItem}
          onChange={handleItemChange}
          disabled={!showLevel3}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-volus-emerald/50 transition-all duration-200 ${
            !showLevel3 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white'
          }`}
          aria-label="Selecionar item"
        >
          <option value="">Selecione um item...</option>
          {availableItems.map((item, index) => (
            <option key={`${item}-${index}`} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterCascade;

