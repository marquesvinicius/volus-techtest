import { useState, useEffect } from 'react';
import productService from '../services/productService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StockControlPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [saving, setSaving] = useState(false);

  // Carrega os produtos da API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({ page_size: 500 }); // Busca todos
      setProducts(response.results || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getStatus = (stock) => {
    if (stock <= 0) return { label: 'Esgotado', color: 'bg-red-50 text-red-600' };
    if (stock <= 5) return { label: 'Crítico', color: 'bg-yellow-50 text-yellow-600' };
    if (stock <= 15) return { label: 'Aviso', color: 'bg-blue-50 text-blue-600' };
    return { label: 'Normal', color: 'bg-emerald-50 text-volus-emerald' };
  };

  const startEdit = (id, current) => {
    setEditingId(id);
    setEditingValue(current.toString());
  };

  const handleSaveStock = async (id) => {
    const newValue = parseInt(editingValue, 10);
    
    if (isNaN(newValue) || newValue < 0) {
      alert('Digite um valor de estoque válido (número maior ou igual a zero).');
      return;
    }

    setSaving(true);
    try {
      // Envia requisição PATCH para atualizar apenas o estoque
      await productService.patchProduct(id, { stock: newValue });

      // Atualiza o estado local para refletir a mudança instantaneamente
      setProducts(products.map(p => 
        p.id === id ? { ...p, stock: newValue } : p
      ));
      
      setEditingId(null);
      setEditingValue('');
      toast.success('Estoque atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar estoque. Tente novamente.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-volus-davys-gray">Carregando estoque...</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-volus-jet dark:text-volus-dark-500">Controle de Estoque</h1>
          <p className="text-volus-davys-gray dark:text-volus-dark-600 mt-1">Monitoramento e gerenciamento de quantidades em tempo real</p>
        </div>

        {/* Stock Table */}
        <div className="bg-white dark:bg-volus-dark-800 rounded-2xl shadow-card border border-white/60 dark:border-volus-dark-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-volus-dark-900 border-b border-gray-200 dark:border-volus-dark-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-volus-jet dark:text-volus-dark-500">Código</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-volus-jet dark:text-volus-dark-500">Produto</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-volus-jet dark:text-volus-dark-500">Estoque Atual</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-volus-jet dark:text-volus-dark-500">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-volus-jet dark:text-volus-dark-500">Ação</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const status = getStatus(product.stock);
                  return (
                    <tr key={product.id} className="border-b border-gray-200 dark:border-volus-dark-700 hover:bg-gray-50 dark:hover:bg-volus-dark-700 transition">
                      <td className="px-6 py-4 text-sm font-mono text-volus-davys-gray dark:text-volus-dark-600">{product.code}</td>
                      <td className="px-6 py-4 text-sm text-volus-jet font-medium dark:text-volus-dark-500">{product.name}</td>
                      <td className="px-6 py-4 text-center text-sm font-semibold text-volus-jet dark:text-volus-dark-500">
                        {editingId === product.id ? (
                          <input
                            type="number"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveStock(product.id)}
                            className="w-20 px-2 py-1 border border-gray-300 dark:border-volus-dark-600 dark:bg-volus-dark-900 rounded text-center focus:outline-none focus:ring-2 focus:ring-volus-emerald/50"
                            autoFocus
                            disabled={saving}
                          />
                        ) : (
                          product.stock
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {editingId === product.id ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleSaveStock(product.id)}
                              disabled={saving}
                              className="px-3 py-1 text-xs font-medium text-white bg-volus-emerald hover:bg-volus-emerald/90 rounded transition disabled:opacity-50"
                            >
                              {saving ? 'Salvando...' : 'Salvar'}
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-volus-dark-600 hover:bg-gray-100 dark:hover:bg-volus-dark-700 rounded transition"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(product.id, product.stock)}
                            className="px-3 py-1 text-xs font-medium text-volus-emerald hover:bg-emerald-50 dark:hover:bg-volus-emerald/10 rounded transition"
                          >
                            Editar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default StockControlPage;

