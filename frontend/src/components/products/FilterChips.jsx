import { isCrazyModeEnabled } from '../../utils/validation';

/**
 * Componente de Chips de Filtros Removíveis
 * Exibe filtros selecionados como chips removíveis
 * 
 * Features:
 * - Multi-seleção de filtros
 * - Chips removíveis com animação
 * - Modo MALUQUICE: animação "poof" especial
 */
const FilterChips = ({ chips = [], onRemoveChip }) => {
  const crazyMode = isCrazyModeEnabled();

  if (!chips || chips.length === 0) {
    return null;
  }

  const handleRemove = (chipId, type, value) => {
    if (onRemoveChip) {
      onRemoveChip(chipId, type, value);
    }
  };

  const getChipColor = (type) => {
    switch (type) {
      case 'category':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'subcategory':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'item':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="chips-container bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 className="text-sm font-semibold text-volus-jet mb-3">Filtros Ativos:</h3>
      <div className="flex flex-wrap gap-2" role="list">
        {chips.map((chip) => {
          const chipId = chip.id || `chip-${chip.type}-${chip.value}`;
          const chipColor = getChipColor(chip.type);

          return (
            <div
              key={chipId}
              className={`filter-chip group flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                chipColor
              } ${
                crazyMode
                  ? 'hover:scale-110 hover:shadow-lg hover:rotate-1'
                  : 'hover:shadow-md'
              }`}
              role="listitem"
            >
              <span>{chip.text}</span>
              <button
                onClick={() => handleRemove(chipId, chip.type, chip.value)}
                className={`chip-remove opacity-70 hover:opacity-100 transition-opacity ${
                  crazyMode ? 'hover:rotate-90' : ''
                }`}
                aria-label={`Remover filtro ${chip.text}`}
                type="button"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterChips;

