import { useState, useEffect } from 'react';

/**
 * Hook customizado para "debounce" de um valor.
 * Atrasa a atualização de um valor até que um determinado tempo tenha passado
 * sem que o valor original tenha mudado. Útil para buscas em tempo real.
 *
 * @param {any} value - O valor a ser "debounced".
 * @param {number} delay - O tempo de atraso em milissegundos.
 * @returns {any} O valor "debounced".
 */
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Configura um timer para atualizar o valor debounced após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer se o valor mudar (ex: usuário continua digitando)
    // ou se o componente for desmontado.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Roda o efeito apenas se o valor ou o delay mudar

  return debouncedValue;
};

export default useDebounce;


