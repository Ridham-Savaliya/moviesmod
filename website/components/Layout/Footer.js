import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer = ({ categories }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-50 border-t border-dark-100 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              Movies<span className="text-primary-500">Hub</span>
            </h3>
            <p className="text-gray-400 mb-4">
              Your ultimate destination for the latest movies in HD quality. 
              Watch and download your favorite movies for free.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors" aria-label="Facebook">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors" aria-label="Twitter">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors" aria-label="Instagram">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors" aria-label="YouTube">
                <FiYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories?.slice(0, 6).map((category) => (
                <li key={category._id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-gray-400 hover:text-primary-500 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/trending" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Trending Movies
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="text-gray-400 hover:text-primary-500 transition-colors">
                  DMCA
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-400 hover:text-primary-500 transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-100 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} MoviesHub. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Disclaimer: This site does not host any files on its server. All contents are provided by non-affiliated third parties.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
