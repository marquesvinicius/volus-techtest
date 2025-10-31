import { useState } from 'react';
import { isCrazyModeEnabled } from '../utils/validation';

const Settings = () => {
  const [crazyMode, setCrazyMode] = useState(isCrazyModeEnabled());

  const handleCrazyModeToggle = () => {
    const newValue = !crazyMode;
    setCrazyMode(newValue);
    localStorage.setItem('crazyMode', newValue.toString());
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-volus-jet">Configurações do Sistema</h1>
        <p className="text-volus-davys-gray mt-1">Personalize a experiência do seu dashboard.</p>
      </div>
      
      {/* Grid de Configurações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Modo MALUQUICE */}
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-card border border-purple-100 p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-volus-jet">
                Modo MALUQUICE
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Ativa comportamentos criativos e inesperados no sistema
              </p>
            </div>
            <button
              onClick={handleCrazyModeToggle}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all ${
                crazyMode ? 'bg-volus-emerald shadow-lg shadow-emerald-200' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-all shadow-sm ${
                  crazyMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          {crazyMode && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg animate-pulse">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <div>
                  <p className="text-sm font-semibold text-yellow-800">Modo MALUQUICE ativado!</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    O sistema agora contém easter eggs, animações especiais e comportamentos não convencionais. Explore e divirta-se!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preferências Adicionais */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-card border border-blue-100 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m6-12v6m0 6v6M6 1v6m0 6v6"></path>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-volus-jet">
                Preferências do Sistema
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Personalize a aparência e o comportamento da interface
              </p>
              <div className="mt-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                    <span className="text-sm text-gray-700">Tema Escuro</span>
                  </div>
                  <span className="text-xs text-gray-500">Em breve</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informações do Sistema */}
      <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-volus-jet mb-4">Sobre o Sistema</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-volus-emerald">v1.0.0</div>
            <div className="text-xs text-gray-600 mt-1">Versão</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-volus-emerald">React</div>
            <div className="text-xs text-gray-600 mt-1">Framework</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-volus-emerald">Django</div>
            <div className="text-xs text-gray-600 mt-1">Backend</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

