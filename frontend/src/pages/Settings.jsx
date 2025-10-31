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
    <div>
      <h1 className="text-3xl font-bold text-volus-jet mb-6">Configurações</h1>
      
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="space-y-6">
          {/* Modo MALUQUICE */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-medium text-volus-jet">
                🎭 Modo MALUQUICE
              </h3>
              <p className="text-sm text-volus-davys-gray mt-1">
                Ativa comportamentos criativos e inesperados no sistema
              </p>
            </div>
            <button
              onClick={handleCrazyModeToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                crazyMode ? 'bg-volus-emerald' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  crazyMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Info Box */}
          {crazyMode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Modo MALUQUICE ativado!</strong> O sistema agora
                contém comportamentos criativos e não convencionais. Use com
                cautela!
              </p>
            </div>
          )}

          {/* Outras configurações podem ser adicionadas aqui */}
          <div>
            <h3 className="text-lg font-medium text-volus-jet mb-4">
              Outras Configurações
            </h3>
            <p className="text-sm text-volus-davys-gray">
              Mais opções de configuração serão adicionadas aqui.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

