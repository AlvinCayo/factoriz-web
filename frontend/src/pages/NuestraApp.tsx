import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NuestraApp.css';
import './Home.css'; 

import logoFactoriz from '../assets/logo.png';
import Footer from '../components/Footer';
import mackreserva from '../assets/mackreserva.png';
import mackgeolocalizacion from '../assets/mackubica.png';
import mackfacial from '../assets/mackfacial.png';
import mackdashboard from '../assets/mackdash.png';
import interaccion from '../assets/interaccion.jpg';

const NuestraApp: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    const savedRole = localStorage.getItem('userRole');
    
    if (savedUserId) {
      setCurrentUser(savedRole === 'centro' ? 'Negocio' : 'Usuario'); 
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    setCurrentUser(null);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="servicios-container">
      {/* NAVEGACIÓN */}
      <nav className="navbar">
        <Link to="/" className="logo-container">
          <img src={logoFactoriz} alt="Logo Factoriz" className="logo-img" />
        </Link>
        <div className="nav-links">
          <Link to="/">Principal</Link>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/servicios">Nuestra App</Link>
          <Link to="/contacto">Contacto</Link>
        </div>
        <div className="nav-buttons">
          {currentUser ? (
            <>
              <span style={{ fontWeight: 600, marginRight: '10px', color: '#000' }}>Hola, {currentUser}</span>
              <button onClick={handleLogout} className="btn-logout">Salir</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn-login">Iniciar Sesión</button>
              <button onClick={() => navigate('/registro')} className="btn-register">Registrarme</button>
            </>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="servicios-hero">
        <div className="hero-tags">
          <a href="#belleza" className="tag interactive-tag" onClick={(e) => scrollToSection(e, 'belleza')}>Belleza</a>
          <a href="#innovacion" className="tag interactive-tag" onClick={(e) => scrollToSection(e, 'innovacion')}>Innovación</a>
          <a href="#aplicaciones" className="tag interactive-tag" onClick={(e) => scrollToSection(e, 'aplicaciones')}>Servicios</a>
        </div>
        <h1>Nuestra App</h1>
        <p>
          Herramientas tecnológicas para salones, peluquerías y barberías. 
          Optimiza la gestión de tu negocio y mejora la experiencia de tus clientes 
          a través de nuestra plataforma moderna e intuitiva.
        </p>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="servicios-content">
        <section className="oferta-header-section" id="aplicaciones">
          <div className="oferta-header-content">
            <span className="oferta-badge">Características</span>
            <h2>Lo que te ofrecemos</h2>
            <p>Descubre todo lo que nuestra plataforma puede hacer por tu negocio y tus clientes.</p>
            <div className="oferta-line"></div>
          </div>
        </section>

        <section className="servicio-row" id="innovacion">
          <div className="servicio-text">
            <h2>Gestión de reservas digitales</h2>
            <p>Implementamos sistemas que permiten administrar citas de manera eficiente, reduciendo tiempos de espera y mejorando la organización del negocio.</p>
            <div className="servicio-features">
              <h4>Incluye:</h4>
              <ul>
                <li>Agenda digital organizada</li>
                <li>Reservas en tiempo real</li>
                <li>Confirmación automática de citas</li>
              </ul>
            </div>
          </div>
          <div className="servicio-image-wrapper">
            <img src={mackreserva} alt="Gestión de reservas" className="servicio-image" />
          </div>
        </section>

        <section className="servicio-row reverse">
          <div className="servicio-text">
            <h2>Geolocalización de servicios</h2>
            <p>Facilitamos la búsqueda de establecimientos cercanos, permitiendo a los usuarios encontrar rápidamente opciones disponibles según su ubicación.</p>
            <div className="servicio-features">
              <h4>Funciones:</h4>
              <ul>
                <li>Búsqueda por ubicación</li>
                <li>Visualización de negocios cercanos</li>
                <li>Acceso directo a información y reservas</li>
              </ul>
            </div>
          </div>
          <div className="servicio-image-wrapper">
            <img src={mackgeolocalizacion} alt="Geolocalización" className="servicio-image" />
          </div>
        </section>

        <section className="servicio-row" id="belleza">
          <div className="servicio-text">
            <h2>Análisis facial inteligente</h2>
            <p>Integramos tecnología que permite recomendar estilos de corte, peinados o barba según las características del rostro del usuario.</p>
            <div className="servicio-features">
              <h4>Beneficios:</h4>
              <ul>
                <li>Recomendaciones personalizadas</li>
                <li>Mejora en la toma de decisiones</li>
                <li>Experiencia innovadora para el cliente</li>
              </ul>
            </div>
          </div>
          <div className="servicio-image-wrapper">
            <img src={mackfacial} alt="Análisis Facial" className="servicio-image" />
          </div>
        </section>

        <section className="servicio-row reverse">
          <div className="servicio-text">
            <h2>Herramientas de gestión para negocios</h2>
            <p>Brindamos soluciones que ayudan a los establecimientos a organizar mejor sus servicios y clientes.</p>
            <div className="servicio-features">
              <h4>Permite:</h4>
              <ul>
                <li>Control de citas y servicios</li>
                <li>Mejor administración del tiempo</li>
                <li>Optimización de la atención al cliente</li>
              </ul>
            </div>
          </div>
          <div className="servicio-image-wrapper">
            <img src={mackdashboard} alt="Herramientas de gestión" className="servicio-image" />
          </div>
        </section>

        <section className="servicio-row">
          <div className="servicio-text">
            <h2>Conexión entre clientes y negocios</h2>
            <p>Nuestra plataforma facilita la interacción directa entre usuarios y profesionales, mejorando la comunicación y el acceso a los servicios.</p>
            <div className="servicio-features">
              <h4>Ventajas:</h4>
              <ul>
                <li>Mayor visibilidad para los negocios</li>
                <li>Acceso a nuevos clientes</li>
                <li>Experiencia más rápida y eficiente</li>
              </ul>
            </div>
          </div>
          <div className="servicio-image-wrapper">
            <img src={interaccion} alt="Conexión clientes y negocios" className="servicio-image" />
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default NuestraApp;