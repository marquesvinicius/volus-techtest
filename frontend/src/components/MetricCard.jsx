import { useTheme } from '../context/ThemeContext';

/**
 * Componente de Card de Métrica com estilo aprimorado
 */
const MetricCard = ({
  title,
  value,
  icon: Icon,
  accentColor = '#1CCF6C',
  delta,
  deltaPositive = true,
}) => {

  const { isDarkMode } = useTheme();

  const deltaBg = deltaPositive ? 'bg-emerald-50 text-volus-emerald dark:bg-volus-emerald/10 dark:text-volus-emerald' : 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400';
  const iconBg = `${accentColor}${isDarkMode ? '33' : '22'}`;

  return (
    <div
      className="metric-card bg-white dark:bg-volus-dark-800 relative overflow-hidden rounded-2xl p-5 border border-transparent dark:border-volus-dark-700"
      style={{ '--metric-accent-color': accentColor }}
    >
      <div className="metric-card-bar"></div>
      
      {/* Conteúdo */}
      <div className="relative pl-3">
        {/* Header do Card */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-volus-davys-gray dark:text-volus-dark-600">
            {title}
          </span>
          {Icon && (
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: iconBg }}
            >
              <Icon className="w-5 h-5" style={{ color: accentColor }} />
            </div>
          )}
        </div>

        {/* Valor Principal */}
        <p className="mt-2 text-3xl font-bold text-volus-jet dark:text-volus-dark-500 tracking-tight">
          {value}
        </p>

        {/* Delta (Variação) */}
        {delta && (
          <div className="flex items-center justify-between mt-2">
            <div
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${deltaBg}`}
            >
              <svg
                className="w-3 h-3"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                {deltaPositive ? (
                  <path d="M2 8l4-4 4 4" />
                ) : (
                  <path d="M2 4l4 4 4-4" />
                )}
              </svg>
              <span className="dark:text-volus-dark-500">{delta}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
