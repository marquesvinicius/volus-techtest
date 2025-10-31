import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose, onCollapseChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState([]);
  const location = useLocation();
  const { logout } = useAuth();

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

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      label: 'Produtos',
      path: '/produtos', // Adicionado path para o item pai
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ),
      submenu: [
        // { id: 'produtos-lista', label: 'Catálogo', path: '/produtos' }, // Removido
        { id: 'produtos-categorias', label: 'Categorias', path: '/produtos/categorias' },
        { id: 'produtos-estoque', label: 'Controle de Estoque', path: '/produtos/estoque' },
      ],
    },
    {
      id: 'relatorios',
      label: 'Relatórios',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="20" x2="12" y2="10"></line>
          <line x1="18" y1="20" x2="18" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="16"></line>
        </svg>
      ),
      path: '/relatorios',
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"></path>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"></path>
        </svg>
      ),
      path: '/configuracoes',
    },
  ];

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
    await logout();
  };

  return (
    <>
      {/* Overlay Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-20 md:top-20 bottom-0 bg-white border-r border-gray-200 z-40 transition-all duration-300 flex flex-col ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          isOpen
            ? 'left-0'
            : '-left-64 md:left-0'
        }`}
      >
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Container para alinhar botão e navegação */}
          <div className={`p-4 ${collapsed ? 'flex flex-col items-center' : ''}`}>
            {/* Collapse Button (Desktop) */}
            <div className={`hidden md:flex ${collapsed ? 'justify-center' : 'justify-end'} mb-4`}>
              <button
                onClick={toggleCollapse}
                className="p-2 hover:bg-gray-100 rounded-lg transition text-volus-davys-gray"
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
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition group ${
                            isSubmenuActive(item)
                              ? 'bg-emerald-50 text-volus-emerald'
                              : 'text-volus-jet hover:bg-gray-50'
                          } ${collapsed ? 'justify-center' : ''}`}
                          title={collapsed ? item.label : ''}
                        >
                          <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
                          {!collapsed && (
                            <>
                              <span className="flex-1 text-left text-sm font-medium">
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
                                  className={`block px-3 py-2 text-sm rounded-lg transition ${
                                    isActive(subitem.path)
                                      ? 'bg-volus-emerald text-white'
                                      : 'text-volus-davys-gray hover:bg-gray-50'
                                  }`}
                                  onClick={onClose}
                                >
                                  {subitem.label}
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
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                          isActive(item.path)
                            ? 'bg-emerald-50 text-volus-emerald'
                            : 'text-volus-jet hover:bg-gray-50'
                        } ${collapsed ? 'justify-center' : ''}`}
                        title={collapsed ? item.label : ''}
                        onClick={onClose}
                      >
                        <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
                        {!collapsed && (
                          <span className="text-sm font-medium">{item.label}</span>
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
        <div className="md:hidden border-t border-gray-200 p-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition"
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

