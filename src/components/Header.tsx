
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom flex justify-between items-center py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-primary">Ango Connect</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="text-gray-700 hover:text-accent font-medium transition-colors">
            Início
          </Link>
          <Link to="/services" className="text-gray-700 hover:text-accent font-medium transition-colors">
            Serviços
          </Link>
          <Link to="/how-it-works" className="text-gray-700 hover:text-accent font-medium transition-colors">
            Como Funciona
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-accent font-medium transition-colors">
            Sobre
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-accent font-medium transition-colors">
            Contato
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login" className="text-gray-700 hover:text-accent font-medium transition-colors">
            Entrar
          </Link>
          <Button className="bg-accent hover:bg-accent-hover text-white rounded-md">
            Comece Agora
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="container-custom py-4 flex flex-col space-y-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-accent font-medium transition-colors px-2 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              to="/services"
              className="text-gray-700 hover:text-accent font-medium transition-colors px-2 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Serviços
            </Link>
            <Link
              to="/how-it-works"
              className="text-gray-700 hover:text-accent font-medium transition-colors px-2 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Como Funciona
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-accent font-medium transition-colors px-2 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-accent font-medium transition-colors px-2 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>

            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
              <Link
                to="/login"
                className="text-gray-700 hover:text-accent font-medium transition-colors px-2 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Entrar
              </Link>
              <Button
                className="bg-accent hover:bg-accent-hover text-white rounded-md w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                Comece Agora
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
