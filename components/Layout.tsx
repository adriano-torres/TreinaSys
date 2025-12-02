import React, { PropsWithChildren } from 'react';
import { GraduationCap, Users, Settings, LogOut, Menu, School } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

interface LayoutProps {
  // children is now handled by PropsWithChildren
}

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-sm shadow-blue-200">
      <School size={24} strokeWidth={2.5} />
    </div>
    <span className="font-bold text-xl text-slate-800 tracking-tight">TreinaSys</span>
  </div>
);

const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { label: 'Turmas', path: '/', icon: <GraduationCap size={20} /> },
    { label: 'Lideranças', path: '/lideranca', icon: <Users size={20} /> },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/turmas');
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm z-20 relative">
        <div>
          <Logo />
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600">
          <Menu />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 flex flex-col
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b border-slate-100 hidden md:block">
          <div className="flex items-center justify-center">
            <Logo />
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                ${isActive(item.path) 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-blue-500'}
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link 
            to="/configuracoes"
            onClick={() => setMobileMenuOpen(false)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
              ${location.pathname === '/configuracoes'
                ? 'bg-blue-50 text-blue-600 font-medium' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-blue-500'}
            `}
          >
            <Settings size={20} />
            <span>Configurações</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </main>
      
      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-0 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;