import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedInput from '../components/AnimatedInput';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar se há mensagem de sucesso do registro
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Limpar a mensagem após 5 segundos
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpar erro quando usuário digitar
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.username, formData.password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/volus-logo.png"
            alt="Vólus Logo"
            className="h-16 mx-auto mb-4"
          />
          <p className="text-volus-davys-gray mt-2">
            Faça login para continuar
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-card p-8">
          <form onSubmit={handleSubmit}>
            {/* Mensagem de Sucesso */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {successMessage}
              </div>
            )}

            {/* Mensagem de Erro */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Username */}
            <div className="mb-4">
              <AnimatedInput
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                label="Usuário"
                placeholder="Digite seu usuário"
                error={error && error.includes('usuário') ? error : null}
                disabled={loading}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <AnimatedInput
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                label="Senha"
                placeholder="Digite sua senha"
                error={error && error.includes('senha') ? error : null}
                disabled={loading}
                required
              />
            </div>

            {/* Botão de Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-volus-emerald hover:bg-volus-emerald-dark text-white font-medium py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Link para Registro */}
          <div className="mt-6 text-center text-sm text-volus-davys-gray">
            Não tem uma conta?{' '}
            <Link
              to="/register"
              className="text-volus-emerald hover:text-volus-emerald-dark font-medium"
            >
              Cadastre-se
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

export default Login;



