import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importar o Link
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { isCrazyModeEnabled } from '../utils/validation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Header = ({ onToggleSidebar, sidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [crazyModeActive, setCrazyModeActive] = useState(false);

  useEffect(() => {
    const checkCrazyMode = () => {
      setCrazyModeActive(isCrazyModeEnabled());
    };
    checkCrazyMode();
    // Ouve por mudanças no localStorage para atualizar em tempo real
    window.addEventListener('storage', checkCrazyMode);
    return () => window.removeEventListener('storage', checkCrazyMode);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    if (crazyModeActive) {
        toast.warn("Você só pode sair quando a festa acabar");
        setDropdownOpen(false); // Fechar o dropdown
        return;
    }
    await logout();
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const names = user.username?.split(' ') || [];
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return (user.username || 'U').charAt(0).toUpperCase();
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
      <header className="fixed top-0 left-0 right-0 bg-volus-emerald shadow-lg z-50" style={{ backgroundColor: '#29C967' }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo e Hamburger */}
            <div className="flex items-center gap-3">
              {/* Mobile Sidebar Toggle */}
              <button
                onClick={onToggleSidebar}
                className="md:hidden p-2 hover:bg-white/10 rounded-lg transition text-white"
                aria-label="Toggle menu"
                aria-expanded={sidebarOpen}
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>

              <img
                src="/volus-logo2.png"
                alt="Vólus"
                className="h-14 md:h-16 w-auto"
              />
            </div>

            {/* User Menu (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              {/* User Profile Button */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition text-white"
                  aria-label="Menu do usuário"
                  aria-expanded={dropdownOpen}
                >
                  <div className="w-8 h-8 bg-white text-volus-emerald rounded-full flex items-center justify-center font-bold text-sm" style={{ color: '#29C967' }}>
                    {getUserInitials()}
                  </div>
                  <div className="text-left hidden xl:block">
                    <div className="text-sm font-medium">
                      {user?.first_name || user?.username || 'Usuário'}
                    </div>
                    <div className="text-xs opacity-90">
                      {user?.is_staff ? 'Administrador' : 'Usuário'}
                    </div>
                  </div>
                  <svg
                    className={`w-4 h-4 transition ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-40">
                      <ul>
                        <li>
                          <Link
                            to="/perfil"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-volus-jet hover:bg-gray-50 transition"
                          >
                            <svg
                              className="w-4 h-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span>Meu Perfil</span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-lg transition text-white"
                aria-label="Sair"
                title="Sair"
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
              </button>
            </div>

            {/* Mobile User Avatar - Redireciona para perfil */}
            <div className="md:hidden">
              <Link to="/perfil">
                <div className="w-10 h-10 bg-white text-white rounded-full flex items-center justify-center font-bold text-sm cursor-pointer" style={{ color: '#29C967' }}>
                  {getUserInitials()}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

