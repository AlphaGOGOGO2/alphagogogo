
import { Link } from "react-router-dom";
import { Zap, Twitter, Linkedin, Github, Instagram } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-heading text-xl md:text-2xl font-semibold mb-4">
              <Zap size={24} className="text-purple-600" />
              <span>AI.Pulse</span>
            </Link>
            <p className="text-gray-600 mb-6 text-balance">
              Exploring the future of artificial intelligence through in-depth reporting and analysis.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-purple-700 transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-purple-700 transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-purple-700 transition-colors" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-purple-700 transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Navigation</h3>
            <ul className="space-y-3">
              {["Home", "News", "Topics", "About"].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-gray-600 hover:text-purple-700 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-3">
              {["Technology", "Ethics", "Research", "Healthcare", "Business", "Education"].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/topics/${item.toLowerCase()}`}
                    className="text-gray-600 hover:text-purple-700 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR Compliance"].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/legal/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-gray-600 hover:text-purple-700 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm order-2 md:order-1 mt-4 md:mt-0">
            © {currentYear} AI.Pulse. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm order-1 md:order-2">
            <Link to="#" className="text-gray-600 hover:text-purple-700 transition-colors">
              Privacy
            </Link>
            <Link to="#" className="text-gray-600 hover:text-purple-700 transition-colors">
              Terms
            </Link>
            <Link to="#" className="text-gray-600 hover:text-purple-700 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
