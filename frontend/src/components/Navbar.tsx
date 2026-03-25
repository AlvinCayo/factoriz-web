// frontend/src/components/Navbar.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Iconos para el menú móvil
import logoFactoriz from '../assets/logo.png'; // Importamos el logo real
import './Navbar.css'; // <-- IMPORTAMOS EL NUEVO CSS

const Navbar = () => {
  // Estado para controlar el menú móvil
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        
        {/* LOGO CORREGIDO (Imagen grande y responsiva) */}
        <Link to="/" className="navbar-logo-container">
          <img 
            src={logoFactoriz} 
            alt="Logo Factoriz" 
            className="navbar-logo-img" 
          />
        </Link>

        {/* MENÚ CENTRAL (Escritorio) */}
        <nav className="navbar-menu-escritorio">
          {['Principal', 'Nosotros', 'Servicios', 'Contacto'].map(item => (
            <Link 
              key={item} 
              to={`/${item.toLowerCase() === 'principal' ? '' : item.toLowerCase()}`} 
              className="navbar-menu-link"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* BOTONES DERECHA (Escritorio) */}
        <div className="navbar-botones-escritorio">
          <button className="btn btn-outline-dark">Regístrate</button>
          <button className="btn btn-filled-primary">Ingresar</button>
        </div>

        {/* BOTÓN HAMBURGUESA (Móvil) - Ahora funcional */}
        <button className="navbar-mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* MENÚ DESPLEGABLE (Móvil) - Ahora responsivo */}
      {isMenuOpen && (
        <div className="navbar-mobile-menu-dropdown">
          {['Principal', 'Nosotros', 'Servicios', 'Contacto'].map(item => (
            <Link 
              key={item} 
              to={`/${item.toLowerCase() === 'principal' ? '' : item.toLowerCase()}`} 
              className="navbar-mobile-link"
              onClick={() => setIsMenuOpen(false)} // Cierra el menú al hacer click
            >
              {item}
            </Link>
          ))}
          <div className="navbar-mobile-buttons-container">
            <button className="btn btn-outline-dark" style={{ width: '100%' }}>Regístrate</button>
            <button className="btn btn-filled-primary" style={{ width: '100%' }}>Ingresar</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;