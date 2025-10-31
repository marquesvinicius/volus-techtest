import { useState, useEffect } from 'react';
import productService from '../../services/productService';
import { isChecksumValid } from '../../utils/validation';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
    category: '',
    subcategory: '',
    item: '',
    description: '',
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSkuValid, setIsSkuValid] = useState(null);

  useEffect(() => {
    productService.getCategories().then(data => {
      setCategories(data.categories || []); // Correção: Extrai o array da resposta
    });
  }, []);

  useEffect(() => {
    if (product) {
      // Logic to populate form for editing an existing product
      // This can be expanded later
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        price: product.price || '',
        stock: product.stock || '',
        category: product.category?.id || '',
        description: product.description || '',
      });
    }
  }, [product]);

  const handleSkuChange = (e) => {
    const sku = e.target.value;
    setFormData({ ...formData, sku });
    if (sku.trim() === '') {
      setIsSkuValid(null);
      setErrors((prev) => ({ ...prev, sku: '' }));
    } else {
      const isValid = isChecksumValid(sku);
      setIsSkuValid(isValid);
      if (!isValid) {
        setErrors((prev) => ({ ...prev, sku: 'SKU inválido (checksum falhou).' }));
      } else {
        setErrors((prev) => ({ ...prev, sku: '' }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Nome é obrigatório.';
    if (!formData.sku) newErrors.sku = 'SKU é obrigatório.';
    else if (!isChecksumValid(formData.sku)) newErrors.sku = 'SKU inválido (checksum falhou).';
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) newErrors.price = 'Preço deve ser um número positivo.';
    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) newErrors.stock = 'Estoque deve ser um número não-negativo.';
    if (!formData.category) newErrors.category = 'Categoria é obrigatória.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // Simplificando o payload para a API
    const payload = {
        name: formData.name,
        sku: formData.sku,
        price: formData.price,
        stock: formData.stock,
        category: formData.category, // API espera o ID da categoria
        description: formData.description,
    };

    onSave(payload);
  };

  // Esta linha foi removida pois não há campo de subcategoria no formulário ainda.
  // const availableSubcategories = Array.isArray(categories) ? categories.find(c => c.id === parseInt(formData.category))?.subcategories || [] : [];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-volus-jet">{product ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome do Produto */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* SKU */}
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">SKU (Código)</label>
              <div className="relative">
                <input type="text" name="sku" id="sku" value={formData.sku} onChange={handleSkuChange} className={`w-full p-2 border rounded-md pr-10 ${errors.sku ? 'border-red-500' : 'border-gray-300'}`} />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {isSkuValid === true && <span className="text-green-500">✓</span>}
                  {isSkuValid === false && <span className="text-red-500">✗</span>}
                </span>
              </div>
              {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
            </div>

            {/* Categoria */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select name="category" id="category" value={formData.category} onChange={handleChange} className={`w-full p-2 border rounded-md ${errors.category ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">Selecione...</option>
                {Array.isArray(categories) && categories.map((cat, index) => (
                  <option key={`${cat.name}-${cat.display_name}-${index}`} value={cat.name}>{cat.display_name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            {/* Preço */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
              <input type="number" name="price" id="price" step="0.01" value={formData.price} onChange={handleChange} className={`w-full p-2 border rounded-md ${errors.price ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            {/* Estoque */}
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
              <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} className={`w-full p-2 border rounded-md ${errors.stock ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
            </div>

            {/* Descrição */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea name="description" id="description" rows="4" value={formData.description} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md"></textarea>
            </div>
          </div>
        </form>

        <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Cancelar</button>
          <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-volus-emerald text-white rounded-lg hover:bg-emerald-600 transition">Salvar Produto</button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
