/**
 * Sidebar Interativa com Toggle
 * Comportamento colapsável em mobile + animações suaves
 */

(function() {
    'use strict';
    
    // Elementos
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
    const layout = document.querySelector('.layout');
    const navItems = document.querySelectorAll('.nav-item.has-submenu');
    const userProfileBtn = document.getElementById('userProfileBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutBtnMobile = document.getElementById('logoutBtnMobile');
    
    // Estado
    let sidebarOpen = false;
    let sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    let userDropdownOpen = false;
    
    /**
     * Toggle da sidebar em mobile
     */
    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
        
        sidebar.classList.toggle('active', sidebarOpen);
        sidebarToggle.setAttribute('aria-expanded', sidebarOpen);
        
        // Criar overlay para fechar ao clicar fora
        if (sidebarOpen && window.innerWidth < 768) {
            createOverlay();
        } else {
            removeOverlay();
        }
    }
    
    /**
     * Criar overlay para mobile
     */
    function createOverlay() {
        let overlay = document.querySelector('.sidebar-overlay');
        
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.addEventListener('click', toggleSidebar);
            document.body.appendChild(overlay);
        }
        
        // Forçar reflow para animação funcionar
        overlay.offsetHeight;
        overlay.classList.add('is-visible');
    }
    
    /**
     * Remover overlay
     */
    function removeOverlay() {
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (overlay) {
            overlay.classList.remove('is-visible');
            setTimeout(() => overlay.remove(), 300);
        }
    }
    
    /**
     * Toggle de submenu
     */
    function toggleSubmenu(navItem) {
        const isExpanded = navItem.classList.contains('is-expanded');
        
        // Fechar todos os outros submenus
        navItems.forEach(item => {
            if (item !== navItem) {
                item.classList.remove('is-expanded');
            }
        });
        
        // Toggle do submenu atual
        navItem.classList.toggle('is-expanded', !isExpanded);
    }
    
    /**
     * Fechar sidebar ao redimensionar para desktop
     */
    function handleResize() {
        if (window.innerWidth >= 768) {
            sidebarOpen = false;
            sidebar.classList.remove('active');
            sidebarToggle.setAttribute('aria-expanded', 'false');
            removeOverlay();
        }
    }
    
    /**
     * Toggle do collapse da sidebar (Desktop)
     */
    function toggleSidebarCollapse() {
        sidebarCollapsed = !sidebarCollapsed;
        
        sidebar.classList.toggle('collapsed', sidebarCollapsed);
        layout.classList.toggle('sidebar-collapsed', sidebarCollapsed);
        
        // Salvar preferência no localStorage
        localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
    }
    
    /**
     * Restaurar estado do collapse ao carregar
     */
    function restoreSidebarState() {
        if (sidebarCollapsed && window.innerWidth >= 768) {
            sidebar.classList.add('collapsed');
            layout.classList.add('sidebar-collapsed');
        }
    }
    
    /**
     * Toggle do dropdown do usuário
     */
    function toggleUserDropdown() {
        userDropdownOpen = !userDropdownOpen;
        
        if (userProfileBtn) {
            userProfileBtn.classList.toggle('active', userDropdownOpen);
            userProfileBtn.setAttribute('aria-expanded', userDropdownOpen);
        }
    }
    
    /**
     * Fechar dropdown ao clicar fora
     */
    function handleClickOutside(event) {
        if (userProfileBtn && !userProfileBtn.contains(event.target) && userDropdownOpen) {
            toggleUserDropdown();
        }
    }
    
    /**
     * Logout do usuário
     */
    function handleLogout() {
        if (confirm('Deseja realmente sair?')) {
            // Aqui você faria o logout real
            console.log('Logout realizado');
            window.location.href = '/login'; // Redirecionar para login
        }
    }
    
    /**
     * Navegação por teclado (acessibilidade)
     */
    function handleKeyboard(event) {
        // ESC para fechar sidebar em mobile
        if (event.key === 'Escape' && sidebarOpen && window.innerWidth < 768) {
            toggleSidebar();
        }
        
        // ESC para fechar dropdown do usuário
        if (event.key === 'Escape' && userDropdownOpen) {
            toggleUserDropdown();
        }
    }
    
    // Event Listeners
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // Collapse button (Desktop)
    if (sidebarCollapseBtn) {
        sidebarCollapseBtn.addEventListener('click', toggleSidebarCollapse);
    }
    
    // Restaurar estado ao carregar
    restoreSidebarState();
    
    // User dropdown toggle
    if (userProfileBtn) {
        userProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleUserDropdown();
        });
    }
    
    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Logout button mobile
    if (logoutBtnMobile) {
        logoutBtnMobile.addEventListener('click', handleLogout);
    }
    
    // Click outside to close dropdown
    document.addEventListener('click', handleClickOutside);
    
    // Submenu click handlers
    navItems.forEach(navItem => {
        const navLink = navItem.querySelector('.nav-link');
        
        navLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSubmenu(navItem);
        });
    });
    
    // Resize listener com debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 150);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
    
    // Fechar sidebar ao clicar em links internos (mobile)
    sidebar.querySelectorAll('.submenu a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                toggleSidebar();
            }
        });
    });
})();

