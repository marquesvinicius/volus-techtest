import api from './api';

const authService = {
  /**
   * Fazer login e obter tokens JWT
   * @param {string} username - Nome de usuário
   * @param {string} password - Senha
   * @returns {Promise<{access: string, refresh: string}>}
   */
  async login(username, password) {
    try {
      const response = await api.post('/api/auth/login/', {
        username,
        password,
      });

      const { access, refresh, user } = response.data;

      // Armazenar tokens no localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erro ao fazer login' };
    }
  },

  /**
   * Fazer logout e invalidar refresh token
   */
  async logout() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/api/auth/logout/', {
          refresh: refreshToken,
        });
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Limpar tokens independentemente do resultado
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Registrar novo usuário
   * @param {Object} userData - Dados do usuário
   * @returns {Promise<Object>}
   */
  async register(userData) {
    try {
      const response = await api.post('/api/auth/register/', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erro ao registrar usuário' };
    }
  },

  /**
   * Verificar se o usuário está autenticado
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    return !!token;
  },

  /**
   * Obter informações do usuário atual
   * @returns {Object|null}
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Renovar token de acesso
   * @returns {Promise<string>} Novo access token
   */
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('Refresh token não encontrado');
      }

      const response = await api.post('/api/auth/refresh/', {
        refresh: refreshToken,
      });

      const { access } = response.data;
      localStorage.setItem('access_token', access);
      return access;
    } catch (error) {
      // Se falhar, limpar tokens e forçar novo login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      throw error;
    }
  },
};

export default authService;

