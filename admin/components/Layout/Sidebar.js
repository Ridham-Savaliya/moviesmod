import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  FiHome, FiFilm, FiFolder, FiMessageSquare, 
  FiDollarSign, FiBarChart2, FiLogOut, FiMenu, FiX, FiUpload 
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const router = useRouter();
  const { logout, user } = useAuth();

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', href: '/dashboard' },
    { icon: FiFilm, label: 'Movies', href: '/movies' },
    { icon: FiUpload, label: 'Bulk Import', href: '/movies/bulk-import' },
    { icon: FiFolder, label: 'Categories', href: '/categories' },
    { icon: FiMessageSquare, label: 'Feedback', href: '/feedback' },
    { icon: FiDollarSign, label: 'Ad Slots', href: '/ad-slots', adminOnly: true },
    { icon: FiBarChart2, label: 'Analytics', href: '/analytics' },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.adminOnly || user?.role === 'admin'
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white w-64 transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">
            Movies<span className="text-primary-500">Hub</span>
          </h1>
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-white font-semibold">{user?.name}</p>
              <p className="text-gray-400 text-sm capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.href || 
                              router.pathname.startsWith(item.href + '/');
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        toggleSidebar();
                      }
                    }}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors w-full"
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
