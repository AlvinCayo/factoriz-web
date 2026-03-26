// frontend/src/components/FloatingNav.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, Briefcase, Phone, X, Info } from 'lucide-react'; // Quitamos 'Plus'
import './FloatingNav.css';

const FloatingNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Alternar abrir/cerrar menú
  const toggleMenu = () => setIsOpen(!isOpen);

  // Función mejorada: Cierra el menú y sube al inicio de la página suavemente
  const handleNavigation = () => {
    setIsOpen(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Esto hace que la subida sea animada y elegante
    });
  };

  return (
    <div className="floating-nav-container">
      {/* Opciones del menú flotante */}
      <div className={`floating-nav-menu ${isOpen ? 'open' : ''}`}>
        <Link to="/" className="floating-nav-item" onClick={handleNavigation}>
          <Home size={18} />
          <span className="floating-nav-label">Inicio</span>
        </Link>
        
        <Link to="/nosotros" className="floating-nav-item" onClick={handleNavigation}>
          <Users size={18} />
          <span className="floating-nav-label">Nosotros</span>
        </Link>
        
        <Link to="/servicios" className="floating-nav-item" onClick={handleNavigation}>
          <Briefcase size={18} />
          <span className="floating-nav-label">Nuestra App</span>
        </Link>

        <Link to="/informacion" className="floating-nav-item" onClick={handleNavigation}>
          <Info size={18} />
          <span className="floating-nav-label">Información</span>
        </Link>
        
        <Link to="/contacto" className="floating-nav-item" onClick={handleNavigation}>
          <Phone size={18} />
          <span className="floating-nav-label">Contacto</span>
        </Link>
      </div>

      {/* Botón Principal (Ahora con el ícono de la casita) */}
      <button 
        className="floating-nav-main-btn" 
        onClick={toggleMenu}
        aria-label="Menú de navegación rápido"
      >
        {isOpen ? <X size={28} /> : <Home size={28} />}
      </button>
    </div>
  );
};

export default FloatingNav;