// frontend/src/components/FloatingNav.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, Briefcase, Phone, Plus, X, Info } from 'lucide-react';
import './FloatingNav.css';

const FloatingNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="floating-nav-container">
      {/* Opciones del menú flotante */}
      <div className={`floating-nav-menu ${isOpen ? 'open' : ''}`}>
        <Link to="/" className="floating-nav-item" onClick={closeMenu}>
          <Home size={18} />
          <span className="floating-nav-label">Inicio</span>
        </Link>
        
        <Link to="/nosotros" className="floating-nav-item" onClick={closeMenu}>
          <Users size={18} />
          <span className="floating-nav-label">Nosotros</span>
        </Link>
        
        <Link to="/servicios" className="floating-nav-item" onClick={closeMenu}>
          <Briefcase size={18} />
          <span className="floating-nav-label">Servicios</span>
        </Link>

        <Link to="/informacion" className="floating-nav-item" onClick={closeMenu}>
          <Info size={18} />
          <span className="floating-nav-label">Información</span>
        </Link>
        
        <Link to="/contacto" className="floating-nav-item" onClick={closeMenu}>
          <Phone size={18} />
          <span className="floating-nav-label">Contacto</span>
        </Link>
      </div>

      {/* Botón Principal */}
      <button 
        className="floating-nav-main-btn" 
        onClick={toggleMenu}
        aria-label="Menú de navegación rápido"
      >
        {isOpen ? <X size={28} /> : <Plus size={28} />}
      </button>
    </div>
  );
};

export default FloatingNav;