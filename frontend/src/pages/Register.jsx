import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedInput from '../components/AnimatedInput';
import { validateEmail, validatePassword, validateRequired, applyPhoneMask } from '../utils/validation';
import authService from '../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    // Aplicar máscara de telefone
    if (name === 'phone') {
      processedValue = applyPhoneMask(value);
    }
    
    setFormData({
      ...formData,
      [name]: processedValue,
    });
    
    // Limpar erro quando usuário digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validações obrigatórias
    if (!validateRequired(formData.username)) {
      newErrors.username = 'Nome de usuário é obrigatório';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Nome de usuário deve ter pelo menos 3 caracteres';
    }

    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = 'Senha é obrigatória';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres, incluindo letras e números';
    }

    if (!validateRequired(formData.password_confirm)) {
      newErrors.password_confirm = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = 'Senhas não coincidem';
    }

    if (!validateRequired(formData.first_name)) {
      newErrors.first_name = 'Nome é obrigatório';
    }

    if (!validateRequired(formData.last_name)) {
      newErrors.last_name = 'Sobrenome é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Preparar dados para envio
      const userData = { ...formData };
      
      // Remover máscara do telefone se preenchido
      if (userData.phone) {
        userData.phone = userData.phone.replace(/\D/g, '');
      }
      
      // Registrar usuário
      const response = await authService.register(userData);

      if (response) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Cadastro realizado com sucesso! Faça login para continuar.' 
            }
          });
        }, 2000);
      } else {
        const errorData = await response.json();
        
        // Mapear erros da API para os campos do formulário
        const apiErrors = {};
        Object.keys(errorData).forEach(key => {
          if (Array.isArray(errorData[key])) {
            apiErrors[key] = errorData[key][0];
          } else {
            apiErrors[key] = errorData[key];
          }
        });
        
        setErrors(apiErrors);
      }
    } catch (error) {
      console.error('Erro ao registrar:', error);
      setErrors({ general: 'Erro interno do servidor. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-card p-8">
            <div className="text-6xl mb-4"></div>
            <h2 className="text-2xl font-bold text-volus-jet mb-4">Cadastro Realizado!</h2>
            <p className="text-volus-davys-gray mb-6">
              Sua conta foi criada com sucesso. Você será redirecionado para a página de login.
            </p>
            <div className="animate-spin w-8 h-8 border-4 border-volus-emerald border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/volus-logo.png"
            alt="Vólus Logo"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-volus-jet">Criar Nova Conta</h1>
          <p className="text-volus-davys-gray mt-2">
            Preencha os dados abaixo para se cadastrar
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-card p-8">
          <form onSubmit={handleSubmit}>
            {/* Mensagem de Erro Geral */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {errors.general}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome de Usuário */}
              <div className="md:col-span-2">
                <AnimatedInput
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  label="Nome de Usuário"
                  placeholder="Digite seu nome de usuário"
                  error={errors.username}
                  disabled={loading}
                  required
                />
              </div>

              {/* Nome */}
              <div>
                <AnimatedInput
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  label="Nome"
                  placeholder="Digite seu nome"
                  error={errors.first_name}
                  disabled={loading}
                  required
                />
              </div>

              {/* Sobrenome */}
              <div>
                <AnimatedInput
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  label="Sobrenome"
                  placeholder="Digite seu sobrenome"
                  error={errors.last_name}
                  disabled={loading}
                  required
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <AnimatedInput
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  label="Email"
                  placeholder="Digite seu email"
                  error={errors.email}
                  disabled={loading}
                  required
                />
              </div>

              {/* Telefone */}
              <div className="md:col-span-2">
                <AnimatedInput
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  label="Telefone (opcional)"
                  placeholder="(11) 9 1234-5678"
                  error={errors.phone}
                  disabled={loading}
                />
              </div>

              {/* Senha */}
              <div>
                <AnimatedInput
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  label="Senha"
                  placeholder="Digite sua senha"
                  error={errors.password}
                  disabled={loading}
                  required
                />
              </div>

              {/* Confirmação de Senha */}
              <div>
                <AnimatedInput
                  type="password"
                  id="password_confirm"
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  label="Confirmar Senha"
                  placeholder="Confirme sua senha"
                  error={errors.password_confirm}
                  success={formData.password && formData.password_confirm && formData.password === formData.password_confirm ? "Senhas coincidem!" : null}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Botão de Submit */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-volus-emerald hover:bg-volus-emerald-dark text-white font-medium py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Criando conta...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Criar Conta
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Link para Login */}
          <div className="mt-6 text-center text-sm text-volus-davys-gray">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-volus-emerald hover:text-volus-emerald-dark font-medium"
            >
              Faça login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-volus-davys-gray">
          © 2025 Vólus. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
};

export default Register;
