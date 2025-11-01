import { useTheme } from '../context/ThemeContext';

/**
 * Componente de Card de Métrica com estilo aprimorado
 */
const MetricCard = ({ title, value, icon: Icon, accentColor, crazyMode, onClick, isDropped }) => {
    const cardClasses = `
        relative overflow-hidden
        bg-gradient-to-br from-white to-gray-50 
        dark:from-volus-dark-800 dark:to-volus-dark-700/60
        rounded-2xl shadow-card border border-white/60 dark:border-volus-dark-700
        p-5 flex items-center gap-5 transition-all duration-1000
        hover:shadow-lg hover:-translate-y-1
        ${crazyMode ? 'transform hover:rotate-3 cursor-pointer' : ''}
        ${isDropped ? 'translate-y-[200vh] rotate-45' : ''}
    `;

    const iconContainerClasses = `
        w-12 h-12 rounded-xl flex-shrink-0
        flex items-center justify-center
        transition-all duration-300
        ${crazyMode ? 'animate-bounce' : ''}
    `;

    return (
        <div className={cardClasses} onClick={crazyMode ? onClick : null}>
            <div 
                className={iconContainerClasses}
                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
            >
                <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
                <p className="text-sm text-volus-davys-gray dark:text-volus-dark-600 mb-1">{title}</p>
                <h3 className={`text-2xl font-bold text-volus-jet dark:text-volus-dark-500 ${crazyMode ? 'crazy-text-shadow' : ''}`}>{value}</h3>
            </div>
            {crazyMode && (
                <div 
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full"
                    style={{ background: accentColor, animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}
                ></div>
            )}
        </div>
    );
};

export default MetricCard;
