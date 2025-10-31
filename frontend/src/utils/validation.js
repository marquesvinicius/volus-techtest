/**
 * Utilitários de Validação
 * Portado do frontend HTML estático
 */

/**
 * Aplica máscara de telefone (XX) X XXXX-XXXX
 * @param {string} value - Valor do input
 * @returns {string} Valor com máscara aplicada
 */
export const applyPhoneMask = (value) => {
  // Remove tudo que não é número
  let digits = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  digits = digits.substring(0, 11);
  
  // Aplica a máscara
  if (digits.length <= 2) {
    return digits;
  } else if (digits.length <= 3) {
    return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
  } else if (digits.length <= 7) {
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 3)} ${digits.substring(3)}`;
  } else {
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 3)} ${digits.substring(3, 7)}-${digits.substring(7)}`;
  }
};

/**
 * Remove máscara do telefone, retornando apenas números
 * @param {string} phone - Telefone com máscara
 * @returns {string} Apenas números
 */
export const removePhoneMask = (phone) => {
  return phone.replace(/\D/g, '');
};

/**
 * Valida checksum do código (soma dígitos % 3 == 0)
 * @param {string} code - Código do produto
 * @returns {boolean} True se válido
 */
export const validateCodeChecksum = (code) => {
  const digits = code.replace(/\D/g, '');
  if (!digits) return false;
  
  const sum = digits.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  return sum % 3 === 0;
};

/**
 * Valida se o telefone tem 11 dígitos completos
 * @param {string} phone - Telefone com ou sem máscara
 * @returns {boolean} True se válido
 */
export const validatePhone = (phone) => {
  const digits = removePhoneMask(phone);
  return digits.length === 11;
};

/**
 * Valida email
 * @param {string} email - Email a validar
 * @returns {boolean} True se válido
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida se um campo não está vazio
 * @param {string} value - Valor a validar
 * @returns {boolean} True se não vazio
 */
export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

/**
 * Valida preço (deve ser maior que zero)
 * @param {number|string} price - Preço a validar
 * @returns {boolean} True se válido
 */
export const validatePrice = (price) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return !isNaN(numPrice) && numPrice > 0;
};

/**
 * Valida estoque (deve ser >= 0)
 * @param {number|string} stock - Estoque a validar
 * @returns {boolean} True se válido
 */
export const validateStock = (stock) => {
  const numStock = typeof stock === 'string' ? parseInt(stock, 10) : stock;
  return !isNaN(numStock) && numStock >= 0;
};

/**
 * Valida senha forte (min 8 caracteres, letras e números)
 * @param {string} password - Senha a validar
 * @returns {boolean} True se válida
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) return false;
  
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return hasLetter && hasNumber;
};

/**
 * Formata preço para exibição (R$ X.XXX,XX)
 * @param {number} price - Preço em número
 * @returns {string} Preço formatado
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

/**
 * Verifica se o Modo MALUQUICE está ativo
 * @returns {boolean}
 */
export const isCrazyModeEnabled = () => {
  return localStorage.getItem('crazyMode') === 'true';
};

/**
 * Valida um SKU usando um algoritmo de checksum.
 * A soma de todos os dígitos deve ser divisível por 3.
 * @param {string} sku - O SKU a ser validado.
 * @returns {boolean} - True se o checksum for válido, false caso contrário.
 */
export const isChecksumValid = (sku) => {
  if (!sku || typeof sku !== 'string') {
    return false;
  }
  const digits = sku.replace(/\D/g, ''); // Remove não-dígitos
  if (digits.length === 0) {
    return false;
  }
  const sum = digits.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  return sum % 3 === 0;
};

