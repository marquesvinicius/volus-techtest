import { useState, useEffect } from 'react';
import authService from '../services/authService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { applyPhoneMask, validateEmail, validatePhone } from '../utils/validation';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authService.fetchCurrentUser();
        setUser(currentUser);
        setFormData({
          username: currentUser.username || '',
          first_name: currentUser.first_name || '',
          last_name: currentUser.last_name || '',
          email: currentUser.email || '',
          phone: currentUser.phone ? applyPhoneMask(currentUser.phone) : '',
        });
      } catch (error) {
        toast.error("Erro ao buscar dados do usuário.");
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const setters = {
      formData: setFormData,
      passwordData: setPasswordData,
    };
    const formName = e.target.closest('form').dataset.formname;

    setters[formName](prev => ({ ...prev, [name]: value }));

    if (name === 'email') {
      if (!validateEmail(value)) {
        setErrors(prev => ({...prev, email: 'Formato de email inválido.'}));
      } else {
        setErrors(prev => ({...prev, email: null}));
      }
    }
  };
  
  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    const maskedValue = applyPhoneMask(value);
    setFormData(prev => ({ ...prev, [name]: maskedValue }));
    
    if (!validatePhone(maskedValue)) {
      setErrors(prev => ({...prev, phone: 'O telefone deve ter 11 dígitos.'}));
    } else {
      setErrors(prev => ({...prev, phone: null}));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (errors.email || errors.phone) {
      toast.warn('Por favor, corrija os erros antes de salvar.');
      return;
    }
    
    try {
      const payload = { ...formData, phone: formData.phone.replace(/\D/g, '') };
      const updatedUser = await authService.updateCurrentUser(payload);
      setUser(updatedUser);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil.');
      console.error("Erro ao atualizar perfil:", error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.new_password_confirm) {
      toast.warn('As novas senhas não coincidem.');
      return;
    }
    if (passwordData.new_password.length < 8) {
        toast.warn('A nova senha deve ter no mínimo 8 caracteres.');
        return;
    }

    try {
      await authService.changePassword(passwordData);
      toast.success('Senha alterada com sucesso!');
      setPasswordData({ old_password: '', new_password: '', new_password_confirm: '' });
    } catch (error) {
      // Tratar erros do backend
      let errorMessage = 'Erro ao alterar a senha.';
      
      if (error.old_password) {
        errorMessage = error.old_password;
      } else if (error.new_password) {
        errorMessage = Array.isArray(error.new_password) 
          ? error.new_password.join('. ') 
          : error.new_password;
      } else if (error.new_password_confirm) {
        errorMessage = error.new_password_confirm;
      } else if (error.detail) {
        errorMessage = error.detail;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast.error(errorMessage);
      console.error("Erro ao alterar senha:", error);
    }
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={4000} hideProgressBar={false} />
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-volus-jet">Meu Perfil</h1>
          <p className="text-volus-davys-gray mt-1">Gerencie suas informações pessoais e de segurança.</p>
        </div>
        
        {loading ? <p>Carregando perfil...</p> : (
          <>
            {/* -- Formulário de Informações Pessoais -- */}
            <div className="bg-white rounded-2xl shadow-card border border-white/60 p-8">
              <h2 className="text-xl font-semibold text-volus-jet mb-6">Informações Pessoais</h2>
              <form onSubmit={handleProfileUpdate} data-formname="formData" className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nome de Usuário</label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Nome</label>
                    <input type="text" name="first_name" id="first_name" value={formData.first_name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-volus-emerald" />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Sobrenome</label>
                    <input type="text" name="last_name" id="last_name" value={formData.last_name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-volus-emerald" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-volus-emerald" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
                  <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handlePhoneChange} placeholder="(XX) X XXXX-XXXX" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-volus-emerald" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" className="px-5 py-2.5 bg-volus-emerald text-white font-semibold rounded-lg hover:bg-volus-emerald/90 transition shadow-sm">
                    Salvar Informações
                  </button>
                </div>
              </form>
            </div>

            {/* -- Formulário de Alteração de Senha -- */}
            <div className="bg-white rounded-2xl shadow-card border border-white/60 p-8">
              <h2 className="text-xl font-semibold text-volus-jet mb-6">Alterar Senha</h2>
              <form onSubmit={handlePasswordChange} data-formname="passwordData" className="space-y-4">
                <div>
                  <label htmlFor="old_password">Senha Atual</label>
                  <input type="password" name="old_password" id="old_password" value={passwordData.old_password} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-volus-emerald" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="new_password">Nova Senha</label>
                    <input type="password" name="new_password" id="new_password" value={passwordData.new_password} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-volus-emerald" required />
                  </div>
                  <div>
                    <label htmlFor="new_password_confirm">Confirmar Nova Senha</label>
                    <input type="password" name="new_password_confirm" id="new_password_confirm" value={passwordData.new_password_confirm} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-volus-emerald" required />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" className="px-5 py-2.5 bg-volus-jet text-white font-semibold rounded-lg hover:bg-opacity-90 transition shadow-sm">
                    Alterar Senha
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
