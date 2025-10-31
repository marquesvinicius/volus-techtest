import api from './api';

const productService = {
  /**
   * Buscar todos os produtos com filtros opcionais
   * @param {Object} params - Parâmetros de query (search, category, subcategory, ordering)
   * @returns {Promise<Object>} Lista de produtos paginada
   */
  async getProducts(params = {}) {
    try {
      const response = await api.get('/api/products/', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erro ao buscar produtos' };
    }
  },

  /**
   * Buscar um produto específico por ID
   * @param {number} id - ID do produto
   * @returns {Promise<Object>}
   */
  async getProduct(id) {
    try {
      const response = await api.get(`/api/products/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erro ao buscar produto' };
    }
  },

  /**
   * Criar novo produto
   * @param {Object} productData - Dados do produto
   * @returns {Promise<Object>}
   */
  async createProduct(productData) {
    try {
      const response = await api.post('/api/products/', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erro ao criar produto' };
    }
  },

  /**
   * Atualizar produto existente
   * @param {number} id - ID do produto
   * @param {Object} productData - Dados atualizados
   * @returns {Promise<Object>}
   */
  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/api/products/${id}/`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erro ao atualizar produto' };
    }
  },

  /**
   * Atualizar parcialmente um produto
   * @param {number} id - ID do produto
   * @param {Object} productData - Dados parciais para atualizar
   * @returns {Promise<Object>}
   */
  async patchProduct(id, productData) {
    try {
      const response = await api.patch(`/api/products/${id}/`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erro ao atualizar produto' };
    }
  },

  /**
   * Deletar produto
   * @param {number} id - ID do produto
   * @returns {Promise<void>}
   */
  async deleteProduct(id) {
    try {
      await api.delete(`/api/products/${id}/`);
    } catch (error) {
      throw error.response?.data || { detail: 'Erro ao deletar produto' };
    }
  },

  /**
   * Buscar categorias disponíveis
   * @returns {Promise<Array>}
   */
  async getCategories() {
    try {
      const response = await api.get('/api/categories/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Erro ao buscar categorias' };
    }
  },
};

export default productService;

