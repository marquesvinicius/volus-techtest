import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-bold text-volus-jet">
            Sistema Vólus
          </h1>
          <p className="text-volus-davys-gray mt-2">
            Faça login para continuar
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-card p-8">
          <form onSubmit={handleSubmit}>
            {/* Mensagem de Erro */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Username */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-volus-jet mb-2"
              >
                Usuário
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-volus-emerald focus:border-transparent transition"
                placeholder="Digite seu usuário"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-volus-jet mb-2"
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-volus-emerald focus:border-transparent transition"
                placeholder="Digite sua senha"
                disabled={loading}
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
          © 2024 Vólus. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
};

export default Login;

