import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Database, 
  Activity, 
  Menu, 
  X,
  ChevronRight,
  Zap,
  Terminal
} from 'lucide-react';

const drawerWidth = 280;

interface LayoutProps {
  children: ReactNode;
}

interface MenuItem {
  text: string;
  icon: ReactNode;
  path: string;
  description: string;
  color: string;
}

const menuItems: MenuItem[] = [
  { 
    text: 'Dashboard', 
    icon: <BarChart3 className="w-5 h-5" />, 
    path: '/',
    description: 'Panel principal',
    color: 'from-cyan-500 to-blue-500'
  },
  { 
    text: 'Operations', 
    icon: <Database className="w-5 h-5" />, 
    path: '/operations',
    description: 'Gestión de datos',
    color: 'from-purple-500 to-pink-500'
  },
  { 
    text: 'Monitoring', 
    icon: <Activity className="w-5 h-5" />, 
    path: '/monitoring',
    description: 'Monitoreo en tiempo real',
    color: 'from-green-500 to-emerald-500'
  },
];

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    console.log('Navegando a:', path);
    navigate(path);
    setMobileOpen(false); // Cerrar sidebar móvil después de navegar
  };

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem?.text || 'MongoDB Replica Set Manager';
  };

  // Efecto para cerrar el sidebar móvil al cambiar de ruta
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="h-full bg-gradient-to-b from-gray-900 via-gray-800 to-black border-r border-cyan-500/20 relative overflow-hidden">
      {/* Efecto de fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>
      
      {/* Header del sidebar */}
      <div className="relative z-10 p-6 border-b border-gray-700/50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/25">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          {(!isCollapsed || isMobile) && (
            <div>
              <h2 className="text-lg font-bold text-white">MongoDB</h2>
              <p className="text-xs text-gray-400">Replica Manager</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation - Usando la lógica que SÍ funciona */}
      <nav className="relative z-10 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <div
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleNavigation(item.path);
                }
              }}
              className={`
                w-full group relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer select-none
                ${isActive 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 shadow-lg shadow-cyan-500/20' 
                  : 'hover:bg-gradient-to-r hover:from-gray-700/30 hover:to-gray-600/30 border border-transparent hover:border-gray-600/30'
                }
              `}
            >
              {/* Efecto de brillo en hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
              
              <div className="relative flex items-center p-4 space-x-3">
                {/* Icono */}
                <div className={`
                  p-2 rounded-lg transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25' 
                    : 'bg-gray-700/50 text-gray-400 group-hover:bg-gray-600/50 group-hover:text-gray-300'
                  }
                `}>
                  {item.icon}
                </div>

                {/* Texto */}
                {(!isCollapsed || isMobile) && (
                  <div className="flex-1 text-left">
                    <div className={`font-medium transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    }`}>
                      {item.text}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                )}

                {/* Indicador activo */}
                {isActive && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    {(!isCollapsed || isMobile) && (
                      <ChevronRight className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                )}
              </div>

              {/* Barra lateral activa */}
              {isActive && (
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-cyan-400 to-blue-500 pointer-events-none"></div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer del sidebar */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/30 rounded-xl p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            {(!isCollapsed || isMobile) && (
              <span className="text-xs text-gray-400">Sistema operativo</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Sidebar Desktop */}
      <div className={`hidden md:flex transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-80'}`}>
        <SidebarContent />
      </div>

      {/* Sidebar Mobile */}
      <div className={`
        md:hidden fixed inset-0 z-50 transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleDrawerToggle}></div>
        <div className="relative w-80 h-full">
          <SidebarContent isMobile />
          <button
            onClick={handleDrawerToggle}
            className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Botón mobile menu */}
              <button
                onClick={handleDrawerToggle}
                className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Botón colapsar sidebar (desktop) */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:block p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Título de página */}
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {getCurrentPageTitle()}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                  <span className="text-xs text-gray-500">Tiempo real</span>
                </div>
              </div>
            </div>

            {/* Indicadores de estado */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-1.5 rounded-lg">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Activo</span>
              </div>
            </div>
          </div>
        </header>

        {/* Área de contenido */}
        <main className="flex-1 overflow-auto">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}