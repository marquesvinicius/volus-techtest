/**
 * Validações de Formulário com Feedback Visual
 * Prova Técnica Vólus
 * 
 * Features:
 * - Máscara de telefone customizada (XX) X XXXX-XXXX
 * - Validação checksum do código (soma dígitos % 3 == 0)
 * - Feedback visual com borda gradiente animada
 * - Acessibilidade com aria-live
 * - Modo MALUQUICE: comportamentos inesperados
 */

(function() {
    'use strict';

    // Elementos do formulário
    const form = document.getElementById('productForm');
    const productCode = document.getElementById('productCode');
    const productPhone = document.getElementById('productPhone');
    const codeError = document.getElementById('codeError');
    const phoneError = document.getElementById('phoneError');

    /**
     * Aplica máscara de telefone (XX) X XXXX-XXXX
     */
    function applyPhoneMask(input) {
        // Remove tudo que não é número
        let value = input.value.replace(/\D/g, '');
        
        // Limita a 11 dígitos
        value = value.substring(0, 11);
        
        // Aplica a máscara
        if (value.length <= 2) {
            input.value = value;
        } else if (value.length <= 3) {
            input.value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
        } else if (value.length <= 7) {
            input.value = `(${value.substring(0, 2)}) ${value.substring(2, 3)} ${value.substring(3)}`;
        } else {
            input.value = `(${value.substring(0, 2)}) ${value.substring(2, 3)} ${value.substring(3, 7)}-${value.substring(7)}`;
        }
    }

    /**
     * Valida checksum do código (soma dígitos % 3 == 0)
     */
    function validateCodeChecksum(code) {
        const digits = code.replace(/\D/g, '');
        if (!digits) return false;
        
        const sum = digits.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
        return sum % 3 === 0;
    }

    /**
     * Adiciona classe de erro com animação gradiente
     */
    function showError(input, errorElement, message) {
        input.classList.add('form-error-input');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Modo MALUQUICE: Animação gradiente aleatória
        if (isCrazyModeEnabled()) {
            const gradients = [
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
            ];
            const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
            input.style.borderImage = randomGradient;
            input.style.borderImageSlice = '1';
        }
    }

    /**
     * Remove classe de erro
     */
    function clearError(input, errorElement) {
        input.classList.remove('form-error-input');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        input.style.borderImage = '';
        input.style.borderImageSlice = '';
    }

    /**
     * Valida código do produto
     */
    function validateProductCode() {
        const code = productCode.value.trim();
        
        // Verifica se o campo está vazio
        if (!code) {
            showError(productCode, codeError, 'O código do produto é obrigatório.');
            return false;
        }
        
        // Verifica formato ABC-123
        const formatRegex = /^[A-Z]{3}-\d{3}$/i;
        if (!formatRegex.test(code)) {
            showError(productCode, codeError, 'Formato inválido. Use: ABC-123');
            return false;
        }
        
        // Valida checksum
        if (!validateCodeChecksum(code)) {
            const digits = code.replace(/\D/g, '');
            const sum = digits.split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
            
            if (isCrazyModeEnabled()) {
                // Modo MALUQUICE: Mensagem enigmática
                showError(productCode, codeError, `🔮 Os números não estão em harmonia... (soma: ${sum}, esperado: múltiplo de 3)`);
            } else {
                showError(productCode, codeError, `Checksum inválido. A soma dos dígitos (${sum}) deve ser divisível por 3.`);
            }
            return false;
        }
        
        clearError(productCode, codeError);
        return true;
    }

    /**
     * Valida telefone
     */
    function validatePhone() {
        const phone = productPhone.value.trim();
        
        // Telefone é opcional, mas se preenchido deve estar completo
        if (phone && phone.length < 16) {
            showError(productPhone, phoneError, 'Telefone incompleto. Use o formato: (XX) X XXXX-XXXX');
            return false;
        }
        
        clearError(productPhone, phoneError);
        return true;
    }

    /**
     * Event listeners
     */
    if (productPhone) {
        // Máscara ao digitar
        productPhone.addEventListener('input', (e) => {
            applyPhoneMask(e.target);
            validatePhone();
        });

        // Tratamento de paste - Modo MALUQUICE: inverte números
        productPhone.addEventListener('paste', (e) => {
            if (isCrazyModeEnabled()) {
                e.preventDefault();
                const pastedText = e.clipboardData.getData('text');
                const digits = pastedText.replace(/\D/g, '');
                const reversed = digits.split('').reverse().join('');
                e.target.value = reversed;
                applyPhoneMask(e.target);
            }
        });

        // Validação ao sair do campo
        productPhone.addEventListener('blur', validatePhone);

        // Previne caracteres não numéricos no paste sem modo MALUQUICE
        if (!isCrazyModeEnabled()) {
            productPhone.addEventListener('paste', (e) => {
                setTimeout(() => applyPhoneMask(e.target), 0);
            });
        }
    }

    if (productCode) {
        // Converte para maiúsculas automaticamente
        productCode.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase();
        });

        // Validação em tempo real
        productCode.addEventListener('input', debounce(validateProductCode, 500));

        // Validação ao sair do campo
        productCode.addEventListener('blur', validateProductCode);

        // Modo MALUQUICE: Placeholder animado que some com efeito aleatório
        if (isCrazyModeEnabled()) {
            const effects = ['fade', 'slide', 'scale'];
            const randomEffect = effects[Math.floor(Math.random() * effects.length)];
            
            productCode.addEventListener('focus', () => {
                productCode.dataset.originalPlaceholder = productCode.placeholder;
                productCode.classList.add(`placeholder-${randomEffect}`);
                setTimeout(() => {
                    productCode.placeholder = '';
                }, 300);
            });

            productCode.addEventListener('blur', () => {
                if (!productCode.value) {
                    productCode.placeholder = productCode.dataset.originalPlaceholder;
                    productCode.classList.remove(`placeholder-${randomEffect}`);
                }
            });
        }
    }

    /**
     * Validação do formulário ao submit
     */
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const isCodeValid = validateProductCode();
            const isPhoneValid = validatePhone();
            
            if (isCodeValid && isPhoneValid) {
                // Sucesso - Modo MALUQUICE: Confetti
                if (isCrazyModeEnabled()) {
                    console.log('🎉 MALUQUICE MODE: Produto adicionado com sucesso! (confetti seria renderizado aqui)');
                }
                
                alert('✅ Produto validado com sucesso!\n\n' +
                      `Código: ${productCode.value}\n` +
                      `Telefone: ${productPhone.value || 'Não informado'}`);
                
                // Reset do formulário
                form.reset();
            } else {
                console.log('❌ Validação falhou');
            }
        });
    }

    console.log('✅ Validações de formulário inicializadas');
    console.log('🎭 Modo MALUQUICE:', isCrazyModeEnabled() ? 'ATIVADO' : 'DESATIVADO');

})();
