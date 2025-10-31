import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const getInitialCollapsed = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  return localStorage.getItem('sidebarCollapsed') === 'true';
};

const getInitialDesktop = () => {
  if (typeof window === 'undefined') {
    return true;
  }
  return window.innerWidth >= 1024;
};

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(getInitialCollapsed);
  const [isDesktop, setIsDesktop] = useState(getInitialDesktop);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleCollapseChange = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  const computedMarginLeft = isDesktop ? (sidebarCollapsed ? 80 : 256) : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar}
        onCollapseChange={handleCollapseChange}
      />
      
      {/* Main Content */}
      <main 
        className="pt-24 transition-all duration-300"
        style={{ marginLeft: computedMarginLeft }}
      >
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

