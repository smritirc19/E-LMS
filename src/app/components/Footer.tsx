import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">LearnHub</h3>
            <p className="text-sm mb-4">
              Empowering learners worldwide with high-quality courses and expert instructors.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-purple-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="hover:text-purple-400 transition-colors">Web Development</Link></li>
              <li><Link to="/courses" className="hover:text-purple-400 transition-colors">Data Science</Link></li>
              <li><Link to="/courses" className="hover:text-purple-400 transition-colors">Mobile Development</Link></li>
              <li><Link to="/courses" className="hover:text-purple-400 transition-colors">Design</Link></li>
              <li><Link to="/courses" className="hover:text-purple-400 transition-colors">Business</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-purple-400 transition-colors">About Us</Link></li>
              <li><Link to="/" className="hover:text-purple-400 transition-colors">Become Instructor</Link></li>
              <li><Link to="/" className="hover:text-purple-400 transition-colors">Contact</Link></li>
              <li><Link to="/" className="hover:text-purple-400 transition-colors">Career</Link></li>
              <li><Link to="/" className="hover:text-purple-400 transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-sm mb-4">Subscribe to get updates on new courses</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">© 2026 LearnHub. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link to="/" className="hover:text-purple-400 transition-colors">Terms of Service</Link>
            <Link to="/" className="hover:text-purple-400 transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-purple-400 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
