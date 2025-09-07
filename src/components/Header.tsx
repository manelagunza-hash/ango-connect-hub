
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/context/SubscriptionContext";
import { useRole } from "@/context/RoleContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { currentPlan } = useSubscription();
  const { isAdmin } = useRole();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isActivePath = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-accent font-extrabold text-2xl">Ango</span>
          <span className="text-primary font-bold text-2xl">Connect</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 ${
              isActivePath("/") ? "text-accent" : "text-gray-700"
            }`}
          >
            Início
          </Link>
          <Link
            to="/services"
            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 ${
              isActivePath("/services") ? "text-accent" : "text-gray-700"
            }`}
          >
            Serviços
          </Link>
          <Link
            to="/how-it-works"
            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 ${
              isActivePath("/how-it-works") ? "text-accent" : "text-gray-700"
            }`}
          >
            Como Funciona
          </Link>
          <Link
            to="/about"
            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 ${
              isActivePath("/about") ? "text-accent" : "text-gray-700"
            }`}
          >
            Sobre
          </Link>
          <Link
            to="/contact"
            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 ${
              isActivePath("/contact") ? "text-accent" : "text-gray-700"
            }`}
          >
            Contato
          </Link>

          {/* Mostrar o botão apropriado baseado na autenticação */}
          <div className="ml-4 flex items-center space-x-2">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/PFLGMANEGER"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/client-dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <Link
                  to="/professional-registration"
                  className="px-3 py-2 rounded-md text-sm font-medium text-primary hover:bg-primary/10"
                >
                  Seja um Profissional
                </Link>
                {currentPlan === 'basic' && (
                  <Link to="/premium" className="inline-flex items-center px-3 py-1 text-sm bg-accent/10 text-accent rounded-full font-medium">
                    Upgrade
                  </Link>
                )}
                <Button asChild variant="ghost" size="sm">
                  <Link to="/profile">
                    Meu Perfil
                  </Link>
                </Button>
                <Button onClick={signOut} variant="outline" size="sm">
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">
                    Login
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/register">
                    Registrar
                  </Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container-custom py-2 space-y-1">
            <Link
              to="/"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 ${
                isActivePath("/") ? "text-accent" : "text-gray-700"
              }`}
            >
              Início
            </Link>
            <Link
              to="/services"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 ${
                isActivePath("/services") ? "text-accent" : "text-gray-700"
              }`}
            >
              Serviços
            </Link>
            <Link
              to="/how-it-works"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 ${
                isActivePath("/how-it-works") ? "text-accent" : "text-gray-700"
              }`}
            >
              Como Funciona
            </Link>
            <Link
              to="/about"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 ${
                isActivePath("/about") ? "text-accent" : "text-gray-700"
              }`}
            >
              Sobre
            </Link>
            <Link
              to="/contact"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 ${
                isActivePath("/contact") ? "text-accent" : "text-gray-700"
              }`}
            >
              Contato
            </Link>
            
            {/* Botões de autenticação para mobile */}
            <div className="pt-4 pb-2 border-t border-gray-200">
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/PFLGMANEGER"
                      onClick={closeMenu}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/client-dashboard"
                    onClick={closeMenu}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/professional-registration"
                    onClick={closeMenu}
                    className="block px-3 py-2 text-base font-medium text-primary hover:bg-primary/10 rounded-md"
                  >
                    Seja um Profissional
                  </Link>
                  {currentPlan === 'basic' && (
                    <Link 
                      to="/premium" 
                      onClick={closeMenu}
                      className="block px-3 py-2 text-base font-medium text-accent bg-accent/10 rounded-md mb-2 text-center"
                    >
                      Upgrade para Premium
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Meu Perfil
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      closeMenu();
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="block px-3 py-2 text-base font-medium text-accent hover:bg-accent/10 rounded-md"
                  >
                    Registrar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
