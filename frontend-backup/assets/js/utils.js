/**
 * Utilidades JavaScript - Helpers Globais
 * Prova Técnica Vólus
 */

/**
 * Verifica se o Modo MALUQUICE está ativado
 * @returns {boolean}
 */
function isCrazyModeEnabled() {
    return localStorage.getItem('crazyMode') === 'true';
}

/**
 * Alterna o Modo MALUQUICE
 */
function toggleCrazyMode() {
    const currentState = isCrazyModeEnabled();
    localStorage.setItem('crazyMode', !currentState);
    
    // Reload para aplicar mudanças
    window.location.reload();
}

/**
 * Debounce helper para otimização de performance
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function}
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Gera um número aleatório entre min e max
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Formata número para moeda BRL
 * @param {number} value
 * @returns {string}
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

/**
 * Formata número com separadores
 * @param {number} value
 * @returns {string}
 */
function formatNumber(value) {
    return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Valida checksum (soma de dígitos % 3 == 0)
 * @param {string} code
 * @returns {boolean}
 */
function validateChecksum(code) {
    const digits = code.replace(/\D/g, '');
    const sum = digits.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    return sum % 3 === 0;
}

/**
 * Detecta se está em mobile
 * @returns {boolean}
 */
function isMobile() {
    return window.innerWidth < 768;
}

/**
 * Copia texto para clipboard
 * @param {string} text
 * @returns {Promise}
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Erro ao copiar:', err);
        return false;
    }
}

