// frontend/src/components/Navbar.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Download } from 'lucide-react'; // Importamos el ícono de descarga
import logoFactoriz from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // NOTA: Si vas a usar este componente globalmente, puedes pasar 
  // currentUser, handleLogout, setIsLoginOpen, etc., como props o contexto.
  // Por ahora dejamos la estructura visual lista.

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        
        {/* LOGO */}
        <Link to="/" className="navbar-logo-container">
          <img 
            src={logoFactoriz} 
            alt="Logo Factoriz" 
            className="navbar-logo-img" 
          />
        </Link>

        {/* MENÚ CENTRAL (Escritorio) */}
        <nav className="navbar-menu-escritorio">
          <Link to="/" className="navbar-menu-link">Inicio</Link>
          <Link to="/nosotros" className="navbar-menu-link">Nosotros</Link>
          <Link to="/nuestra-app" className="navbar-menu-link">Nuestra App</Link>
          <Link to="/informacion" className="navbar-menu-link">Información</Link>
          <Link to="/contacto" className="navbar-menu-link">Contacto</Link>
        </nav>

        {/* BOTONES DERECHA (Escritorio) */}
        <div className="navbar-botones-escritorio">
          {/* Botón Descargar App siempre visible */}
          <a href="#" className="btn-descargar-nav">
            <Download size={16} />
            Descargar App
          </a>
          
          <button className="btn-login-nav">Iniciar Sesión</button>
          <button className="btn-register-nav">Registrarme</button>
        </div>

        {/* BOTÓN HAMBURGUESA (Móvil) */}
        <button className="navbar-mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* MENÚ DESPLEGABLE (Móvil) */}
      {isMenuOpen && (
        <div className="navbar-mobile-menu-dropdown">
          <Link to="/" className="navbar-mobile-link" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
          <Link to="/nosotros" className="navbar-mobile-link" onClick={() => setIsMenuOpen(false)}>Nosotros</Link>
          <Link to="/nuestra-app" className="navbar-mobile-link" onClick={() => setIsMenuOpen(false)}>Nuestra App</Link>
          <Link to="/informacion" className="navbar-mobile-link" onClick={() => setIsMenuOpen(false)}>Información</Link>
          <Link to="/contacto" className="navbar-mobile-link" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
          
          <div className="navbar-mobile-buttons-container">
            <a href="#" className="btn-descargar-nav mobile-btn" onClick={() => setIsMenuOpen(false)}>
              <Download size={16} />
              Descargar App
            </a>
            <button className="btn-login-nav mobile-btn" onClick={() => setIsMenuOpen(false)}>Iniciar Sesión</button>
            <button className="btn-register-nav mobile-btn" onClick={() => setIsMenuOpen(false)}>Registrarme</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;