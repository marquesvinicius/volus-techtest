import { useState, useEffect } from 'react';

const AnimatedInput = ({
  type = 'text',
  name,
  id,
  value,
  onChange,
  placeholder,
  label,
  error,
  success,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const getInputClasses = () => {
    let classes = `
      w-full px-4 py-3 border rounded-lg transition-all duration-300 
      focus:outline-none focus:ring-2 
      ${className}
    `;

    if (error) {
      classes += ` 
        border-red-500 focus:ring-red-200 focus:border-red-500
        bg-gradient-to-r from-red-50 via-white to-red-50
        animate-gradient-x
      `;
    } else if (success) {
      classes += ` 
        border-green-500 focus:ring-green-200 focus:border-green-500
        bg-gradient-to-r from-green-50 via-white to-green-50
      `;
    } else {
      classes += ` 
        border-gray-300 focus:ring-volus-emerald/20 focus:border-volus-emerald
        ${isFocused ? 'bg-gradient-to-r from-emerald-50 via-white to-emerald-50' : 'bg-white'}
      `;
    }

    if (disabled) {
      classes += ' opacity-50 cursor-not-allowed';
    }

    return classes;
  };

  const getLabelClasses = () => {
    let classes = 'block text-sm font-medium mb-2 transition-colors duration-300';
    
    if (error) {
      classes += ' text-red-600';
    } else if (success) {
      classes += ' text-green-600';
    } else if (isFocused) {
      classes += ' text-volus-emerald';
    } else {
      classes += ' text-volus-jet';
    }

    return classes;
  };

  return (
    <div className="relative">
      {label && (
        <label htmlFor={id} className={getLabelClasses()}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type={type}
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={getInputClasses()}
          {...props}
        />
        
        {/* Ícone de status */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {success && (
            <svg className="w-5 h-5 text-green-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          )}
          {error && (
            <svg className="w-5 h-5 text-red-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
      </div>

      {/* Mensagem de erro com animação */}
      {error && (
        <div className={`mt-2 transition-all duration-300 ${showError ? 'animate-shake' : ''}`}>
          <p className="text-red-600 text-sm flex items-center">
            <svg className="w-4 h-4 mr-1 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Mensagem de sucesso */}
      {success && (
        <div className="mt-2">
          <p className="text-green-600 text-sm flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {success}
          </p>
        </div>
      )}

      {/* Barra de progresso animada para erros */}
      {error && showError && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-red-500 to-red-600 animate-progress-bar"></div>
        </div>
      )}
    </div>
  );
};

export default AnimatedInput;
