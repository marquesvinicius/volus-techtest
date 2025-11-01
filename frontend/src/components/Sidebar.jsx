import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isCrazyModeEnabled } from '../utils/validation';
import SnakeGame from './SnakeGame'; // Importe o jogo
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sidebar = ({ isOpen, onClose, onCollapseChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState([]);
  const [crazyModeActive, setCrazyModeActive] = useState(false);
  const [menuItemClicks, setMenuItemClicks] = useState({});
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [showSnakeGame, setShowSnakeGame] = useState(false); // Estado para o jogo
  const location = useLocation();
  const { logout } = useAuth();

  // Verifica o modo MALUQUICE periodicamente
  useEffect(() => {
    const checkCrazyMode = () => {
      setCrazyModeActive(isCrazyModeEnabled());
    };
    
    checkCrazyMode();
    const interval = setInterval(checkCrazyMode, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Aplicar estado salvo do localStorage ao carregar
  useEffect(() => {
    const savedState =
      typeof window !== 'undefined' && localStorage.getItem('sidebarCollapsed') === 'true';
    setCollapsed(savedState);
    if (onCollapseChange) {
      onCollapseChange(savedState);
    }
  }, [onCollapseChange]);

  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarCollapsed', newState.toString());
    }
    if (onCollapseChange) {
      onCollapseChange(newState);
    }
  };

  const toggleSubmenu = (menuId) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  // Comportamentos especiais do Modo MALUQUICE
  const handleMenuItemClick = (itemId) => {
    if (!crazyModeActive) return;

    setMenuItemClicks(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));

    // Easter egg: clicar 5 vezes no Dashboard
    if (itemId === 'dashboard' && (menuItemClicks.dashboard || 0) >= 4) {
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 3000);
      setMenuItemClicks(prev => ({ ...prev, [itemId]: 0 }));
    }
  };

  const getMenuItemClasses = (item, isSubmenuActive) => {
    let baseClasses = `flex items-center gap-3 px-3 rounded-lg transition-all duration-300 ${
      collapsed ? 'justify-center py-2.5' : 'py-3 md:py-2.5'
    }`;

    if (isSubmenuActive) {
      baseClasses += ' bg-emerald-50 text-volus-emerald dark:bg-volus-emerald/10';
    } else {
      baseClasses += ' text-volus-jet dark:text-volus-dark-500 hover:bg-gray-50 dark:hover:bg-volus-dark-700';
    }

    // Comportamentos especiais do Modo MALUQUICE
    if (crazyModeActive) {
      if (item.id === 'snake-game') {
        baseClasses += ' snake-game-special';
      }
      const clickCount = menuItemClicks[item.id] || 0;
      
      if (clickCount > 0) {
        baseClasses += ' animate-pulse';
      }
      if (clickCount > 2) {
        baseClasses += ' hover:rotate-3 hover:scale-105';
      }
      if (clickCount > 4) {
        baseClasses += ' animate-bounce bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-500/10 dark:to-pink-500/10';
      }
    }

    return baseClasses;
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: crazyModeActive && (menuItemClicks.dashboard || 0) > 3 ? 'Dashboard Mágico' : 'Dashboard',
      icon: (
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className={crazyModeActive ? 'animate-spin-slow' : ''}
        >
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
      path: '/',
    },
    {
      id: 'produtos',
      label: crazyModeActive ? 'Produtos Mágicos' : 'Produtos',
      path: '/produtos', // Adicionado path para o item pai
      icon: (
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className={crazyModeActive ? 'hover:animate-bounce' : ''}
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ),
      submenu: [
        // { id: 'produtos-lista', label: 'Catálogo', path: '/produtos' }, // Removido
        { id: 'produtos-categorias', label: 'Busca Avançada', path: '/produtos/busca-avancada' },
        { id: 'produtos-estoque', label: 'Controle de Estoque', path: '/produtos/estoque' },
      ],
    },
    {
      id: 'relatorios',
      label: crazyModeActive ? 'Relatórios Fantásticos' : 'Relatórios',
      icon: (
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className={crazyModeActive ? 'hover:animate-pulse' : ''}
        >
          <line x1="12" y1="20" x2="12" y2="10"></line>
          <line x1="18" y1="20" x2="18" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="16"></line>
        </svg>
      ),
      path: '/relatorios',
    },
    {
      id: 'configuracoes',
      label: crazyModeActive ? 'Configurações Especiais' : 'Configurações',
      icon: (
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className={crazyModeActive ? 'animate-spin-slow' : ''}
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"></path>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"></path>
        </svg>
      ),
      path: '/configuracoes',
    },
  ];

  if (crazyModeActive) {
    menuItems.push({
      id: 'snake-game',
      label: 'Jogo da Cobrinha',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`hover:animate-spin ${crazyModeActive ? 'sidebar-neon-icon' : ''}`}
        >
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M15.5 8.5c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5z" />
          <path d="M8.5 8.5c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5z" />
          <path d="M16 14s-1.5 2-4 2-4-2-4-2" />
        </svg>
      ),
      action: () => setShowSnakeGame(true),
    });
  }

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isSubmenuActive = (item) => {
    if (item.id === 'produtos') {
      return location.pathname.startsWith('/produtos');
    }
    if (item.path) {
      return isActive(item.path);
    }
    return false;
  };

  const handleLogout = async () => {
    if (crazyModeActive) {
      toast.warn("Você só pode sair quando a festa acabar");
      return;
    }
    await logout();
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
      {/* Overlay Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Easter Egg Modal */}
      {showEasterEgg && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8 rounded-2xl text-white text-center animate-bounce shadow-2xl">
            <div className="text-4xl mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">MODO MALUQUICE ATIVADO!</h2>
            <p className="text-lg">Você descobriu o easter egg do menu!</p>
            <div className="mt-4 text-4xl animate-spin"></div>
          </div>
        </div>
      )}

      {/* Snake Game Modal */}
      {showSnakeGame && <SnakeGame onClose={() => setShowSnakeGame(false)} />}

      {/* Sidebar - Mobile sempre expandido */}
      <aside
        className={`fixed top-20 md:top-20 bottom-0 bg-white dark:bg-volus-dark-800 border-r border-gray-200 dark:border-volus-dark-700 z-40 transition-all duration-300 flex flex-col ${
          collapsed && 'md:w-20'
        } ${
          !collapsed || isOpen ? 'w-64' : 'w-64 md:w-20'
        } ${
          isOpen
            ? 'left-0'
            : '-left-64 md:left-0'
        } ${
          crazyModeActive ? 'bg-gradient-to-b from-white via-purple-50 to-pink-50 dark:from-volus-dark-800 dark:via-purple-900/20 dark:to-pink-900/20' : 'bg-white'
        }`}
      >
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Container para alinhar botão e navegação */}
          <div className={`p-4 ${collapsed ? 'flex flex-col items-center' : ''}`}>
        {/* Collapse Button (Desktop) */}
            <div className={`hidden md:flex ${collapsed ? 'justify-center' : 'justify-end'} mb-4`}>
          <button
            onClick={toggleCollapse}
            className="p-2 hover:bg-gray-100 dark:hover:bg-volus-dark-700 rounded-lg transition text-volus-davys-gray dark:text-volus-dark-600"
            aria-label={collapsed ? 'Expandir menu' : 'Colapsar menu'}
            title={collapsed ? 'Expandir menu' : 'Colapsar menu'}
          >
            <svg
              className={`w-5 h-5 transition ${collapsed ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

            <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                {item.submenu ? (
                  /* Item com Submenu */
                  <>
                    <Link
                      to={item.path || '#'}
                      onClick={(e) => {
                        if (!item.path) e.preventDefault();
                        toggleSubmenu(item.id);
                        handleMenuItemClick(item.id);
                      }}
                      className={`w-full ${getMenuItemClasses(item, isSubmenuActive(item))}`}
                      title={collapsed ? item.label : ''}
                    >
                      <span className={`flex-shrink-0 ${collapsed ? 'w-5 h-5' : 'w-6 h-6 md:w-5 md:h-5'}`}>{item.icon}</span>
                      {!collapsed && (
                        <>
                          <span className={`flex-1 text-left text-base md:text-sm font-medium ${crazyModeActive && item.id !== 'snake-game' ? 'sidebar-neon-text' : ''}`}>
                            {item.label}
                          </span>
                          <svg
                            className={`w-4 h-4 transition ${
                              expandedMenus.includes(item.id) ? 'rotate-180' : ''
                            }`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </>
                      )}
                        </Link>

                    {/* Submenu */}
                    {!collapsed && expandedMenus.includes(item.id) && (
                      <ul className="ml-8 mt-2 space-y-1">
                        {item.submenu.map((subitem) => (
                          <li key={subitem.id}>
                            <Link
                              to={subitem.path}
                              className={`block px-3 rounded-lg transition ${
                                isActive(subitem.path)
                                  ? 'bg-volus-emerald text-white'
                                  : 'text-volus-davys-gray dark:text-volus-dark-600 hover:bg-gray-50 dark:hover:bg-volus-dark-700'
                              } py-2.5 md:py-2 text-base md:text-sm`}
                              onClick={onClose}
                            >
                              <span className={crazyModeActive ? 'sidebar-neon-text' : ''}>
                                {subitem.label}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  /* Item Simples */
                  <Link
                    to={item.path}
                    className={getMenuItemClasses(item, isActive(item.path))}
                    title={collapsed ? item.label : ''}
                    onClick={(e) => {
                      if (item.action) {
                        e.preventDefault();
                        item.action();
                      }
                      onClose();
                      handleMenuItemClick(item.id);
                    }}
                  >
                    <span className={`flex-shrink-0 ${collapsed ? 'w-5 h-5' : 'w-6 h-6 md:w-5 md:h-5'}`}>{item.icon}</span>
                    {!collapsed && (
                      <span className={`text-base md:text-sm font-medium ${crazyModeActive && item.id !== 'snake-game' ? 'sidebar-neon-text' : ''}`}>{item.label}</span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
          </div>
        </div>

        {/* Mobile User Menu (Bottom) */}
        <div className="md:hidden border-t border-gray-200 dark:border-volus-dark-700 p-2">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${crazyModeActive ? 'text-gray-500 cursor-not-allowed' : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10'}`}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

