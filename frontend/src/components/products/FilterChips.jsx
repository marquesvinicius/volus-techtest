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
        return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-400/40';
      case 'subcategory':
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-400/40';
      case 'item':
        return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-400/40';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-400/40';
    }
  };

  return (
    <div className="chips-container bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 shadow-sm dark:from-volus-dark-800/80 dark:to-volus-dark-700/80 dark:border-volus-dark-700 dark:shadow-none">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-volus-jet dark:text-volus-dark-500 flex items-center gap-2">
          <svg className="w-4 h-4 text-volus-emerald dark:text-volus-emerald/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
          </svg>
          Filtros Ativos ({chips.length})
        </h3>
        {chips.length > 1 && (
          <button
            onClick={() => chips.forEach(chip => handleRemove(chip.id, chip.type, chip.value))}
            className="text-xs text-volus-davys-gray dark:text-volus-dark-600 hover:text-red-600 transition-colors duration-200"
          >
            Limpar todos
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-3" role="list">
        {chips.map((chip, index) => {
          const chipId = chip.id || `chip-${chip.type}-${chip.value}`;
          const chipColor = getChipColor(chip.type);

          return (
            <div
              key={chipId}
              className={`filter-chip group flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-300 transform ${
                chipColor
              } ${
                crazyMode
                  ? 'hover:scale-110 hover:shadow-lg hover:rotate-1 animate-bounce-in'
                  : 'hover:shadow-md hover:scale-105'
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
              role="listitem"
            >
              {/* Ícone do tipo de filtro */}
              <span className="flex-shrink-0">
                
              </span>
              
              <span className="font-medium">{chip.text}</span>
              
              <button
                onClick={() => handleRemove(chipId, chip.type, chip.value)}
                className={`chip-remove flex-shrink-0 w-5 h-5 rounded-full bg-white/50 hover:bg-white flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-200 ${
                  crazyMode ? 'hover:rotate-90 hover:scale-110' : 'hover:scale-110'
                }`}
                aria-label={`Remover filtro ${chip.text}`}
                type="button"
              >
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
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
      
      {/* Indicador visual de que mais filtros podem ser adicionados */}
      <div className="mt-4 text-xs text-volus-davys-gray dark:text-volus-dark-600 flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Continue selecionando nos filtros acima para adicionar mais chips
      </div>
    </div>
  );
};

export default FilterChips;

