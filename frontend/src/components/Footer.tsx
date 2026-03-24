// frontend/src/components/Footer.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import './Footer.css';

import logoFactoriz from '../assets/logo.png';

const Footer: React.FC = () => {
  const location = useLocation();

  // Función para las opciones del Navegador: Fuerza a la página a ir hasta arriba
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para Información: Fuerza el scroll a la sección exacta, incluso si ya estamos en esa página
  const handleInfoClick = (id: string) => {
    if (location.pathname === '/informacion') {
      const element = document.getElementById(id);
      if (element) {
        // Un pequeño retraso para asegurar que la animación sea fluida
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-grid">
          
          {/* 1. MARCA Y REDES SOCIALES */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo" onClick={scrollToTop}>
              <img src={logoFactoriz} alt="Logo Factoriz" className="logo-img" />
              FACTORIZ
            </Link>
            <p>Innovando la experiencia en salones de belleza, peluquerías y barberías.</p>
            
            <div className="social-media">
              <p>Síguenos en nuestras redes sociales</p>
              <div className="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* 2. NAVEGADOR (Ahora siempre van al inicio de la página) */}
          <div className="footer-column">
            <h4>Navegador</h4>
            <ul className="footer-links">
              <li><Link to="/" onClick={scrollToTop}>Principal</Link></li>
              <li><Link to="/nosotros" onClick={scrollToTop}>Nosotros</Link></li>
              <li><Link to="/servicios" onClick={scrollToTop}>Servicios</Link></li>
              <li><Link to="/contacto" onClick={scrollToTop}>Contacto</Link></li>
            </ul>
          </div>

          {/* 3. INFORMACIÓN (Ahora siempre saltan a su sección) */}
          <div className="footer-column">
            <h4>Información</h4>
            <ul className="footer-links">
              <li>
                <Link to="/informacion#terminos" onClick={() => handleInfoClick('terminos')}>
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link to="/informacion#cookies" onClick={() => handleInfoClick('cookies')}>
                  Política de cookies
                </Link>
              </li>
              <li>
                <Link to="/informacion#aviso-legal" onClick={() => handleInfoClick('aviso-legal')}>
                  Aviso legal
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. CONTACTOS */}
          <div className="footer-column">
            <h4>Contactos</h4>
            <ul className="contact-list">
              <li className="contact-item">
                <Phone size={18} className="contact-icon" />
                <a href="tel:+59170638989" className="contact-link">+591 70638989</a>
              </li>
              <li className="contact-item">
                <Mail size={18} className="contact-icon" />
                <a href="mailto:Factoriz@gmail.com" className="contact-link">Factoriz@gmail.com</a>
              </li>
              <li className="contact-item">
                <MapPin size={18} className="contact-icon" />
                <a href="https://www.google.com/maps/search/?api=1&query=EMI+Irpavi+La+Paz+Bolivia" target="_blank" rel="noreferrer" className="contact-link">
                  EMI Irpavi
                </a>
              </li>
            </ul>
          </div>

          {/* 5. DESCARGA LA APP */}
          <div className="app-download">
            <h4>Descarga nuestra app</h4>
            <p>Transforma tu experiencia en belleza desde la palma de tu mano.</p>
            <div className="store-badges">
              <a href="#" className="store-badge">
                <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.36 14c.08-.66.14-1.32.14-2 0-2.4-1.21-4.06-3.48-4.06-.5 0-1.11.13-1.62.33-.51.2-.95.3-1.22.3-.23 0-.61-.09-1.07-.27-.47-.18-1.03-.28-1.63-.28-2.31 0-4.08 1.68-4.08 4.24 0 1.25.32 2.65.91 4.14.62 1.5 1.34 2.8 2.12 3.82.72 1 1.45 1.51 2.17 1.51.52 0 1.07-.18 1.62-.51.53-.33 1.12-.51 1.74-.51.58 0 1.15.17 1.67.48.55.33 1.11.51 1.66.51.72 0 1.48-.52 2.22-1.52.74-1.01 1.4-2.28 1.93-3.7-.76-.41-1.16-1.12-1.16-2.07zM14.61 6.8c0-1.22-.44-2.27-1.26-3.08C12.51 2.91 11.45 2.5 10.23 2.5c0 1.24.45 2.3 1.28 3.12.82.82 1.88 1.24 3.1 1.18z"/>
                </svg>
                <div className="badge-text">
                  <span className="badge-small">Download on the</span>
                  <span className="badge-large">App Store</span>
                </div>
              </a>
              <a href="#" className="store-badge">
                <svg width="26" height="26" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 22.45L21.32 12 5 1.55v20.9z"/>
                </svg>
                <div className="badge-text">
                  <span className="badge-small">GET IT ON</span>
                  <span className="badge-large">Google Play</span>
                </div>
              </a>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2026 Factoriz. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;