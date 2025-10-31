import { useState } from 'react';

const StockControlPage = () => {
  const [stocks, setStocks] = useState([
    { id: 1, code: 'ELE-123', name: 'Notebook Dell', current: 5, minimum: 10, status: 'critical' },
    { id: 2, code: 'LIV-456', name: 'Livro JavaScript', current: 25, minimum: 10, status: 'normal' },
    { id: 3, code: 'MOV-789', name: 'Mesa Escritório', current: 3, minimum: 5, status: 'warning' },
    { id: 4, code: 'ROU-321', name: 'Camisa Branca', current: 45, minimum: 20, status: 'normal' },
    { id: 5, code: 'ALI-654', name: 'Café Premium', current: 2, minimum: 15, status: 'critical' },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'bg-red-50 text-red-600';
      case 'warning':
        return 'bg-yellow-50 text-yellow-600';
      case 'normal':
        return 'bg-emerald-50 text-volus-emerald';
      default:
        return 'bg-gray-50 text-volus-davys-gray';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'critical':
        return 'Crítico';
      case 'warning':
        return 'Aviso';
      case 'normal':
        return 'Normal';
      default:
        return 'Desconhecido';
    }
  };

  const getStatus = (current, minimum) => {
    if (current <= 0) return 'critical';
    if (current <= minimum) return 'critical';
    if (current < minimum * 1.5) return 'warning';
    return 'normal';
  };

  const startEdit = (id, current) => {
    setEditingId(id);
    setEditingValue(current.toString());
  };

  const handleSaveStock = async (id) => {
    const newValue = parseInt(editingValue);
    
    if (isNaN(newValue) || newValue < 0) {
      alert('Digite um valor válido para o estoque');
      return;
    }

    setLoading(true);
    try {
      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 500));

      setStocks(stocks.map(stock => {
        if (stock.id === id) {
          return {
            ...stock,
            current: newValue,
            status: getStatus(newValue, stock.minimum)
          };
        }
        return stock;
      }));

      setEditingId(null);
      setEditingValue('');
      alert('Estoque atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar estoque');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-volus-jet">Controle de Estoque</h1>
        <p className="text-volus-davys-gray mt-1">Monitoramento e gerenciamento de quantidades e níveis mínimos</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-card border border-white/60 p-4">
          <div className="text-sm text-volus-davys-gray mb-1">Crítico</div>
          <div className="text-3xl font-bold text-red-600">
            {stocks.filter((s) => s.status === 'critical').length}
          </div>
          <div className="text-xs text-red-500 mt-2">Requer atenção imediata</div>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-white/60 p-4">
          <div className="text-sm text-volus-davys-gray mb-1">Aviso</div>
          <div className="text-3xl font-bold text-yellow-600">
            {stocks.filter((s) => s.status === 'warning').length}
          </div>
          <div className="text-xs text-yellow-600 mt-2">Abaixo do esperado</div>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-white/60 p-4">
          <div className="text-sm text-volus-davys-gray mb-1">Normal</div>
          <div className="text-3xl font-bold text-volus-emerald">
            {stocks.filter((s) => s.status === 'normal').length}
          </div>
          <div className="text-xs text-volus-emerald mt-2">Em níveis adequados</div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-2xl shadow-card border border-white/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-volus-jet">Código</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-volus-jet">Produto</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-volus-jet">Estoque Atual</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-volus-jet">Mínimo</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-volus-jet">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-volus-jet">Ação</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-mono text-volus-davys-gray">{stock.code}</td>
                  <td className="px-6 py-4 text-sm text-volus-jet font-medium">{stock.name}</td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-volus-jet">
                    {editingId === stock.id ? (
                      <input
                        type="number"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-volus-emerald/50"
                        autoFocus
                      />
                    ) : (
                      stock.current
                    )}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-volus-davys-gray">{stock.minimum}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(stock.status)}`}>
                      {getStatusLabel(stock.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {editingId === stock.id ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleSaveStock(stock.id)}
                          disabled={loading}
                          className="px-3 py-1 text-xs font-medium text-white bg-volus-emerald hover:bg-volus-emerald/90 rounded transition disabled:opacity-50"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(stock.id, stock.current)}
                        className="px-3 py-1 text-xs font-medium text-volus-emerald hover:bg-emerald-50 rounded transition"
                      >
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockControlPage;

