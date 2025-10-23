import { FiMenu, FiBell } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <FiMenu size={24} />
          </button>
          
          <h2 className="text-xl font-semibold text-gray-800">
            Admin Panel
          </h2>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <button className="relative text-gray-600 hover:text-gray-900">
            <FiBell size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:block">
              {user?.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
