import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Nosotros.css';
import './Home.css';

import logoFactoriz from '../assets/logo.png';
import Footer from '../components/Footer';
import objetivos from '../assets/objetivo.jpg';
import quienesSomos from '../assets/quienes.jpg';
import mision from '../assets/mision.jpg';
import vision from '../assets/vision.jpg';

const Nosotros: React.FC = () => {
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

  return (
    <div className="nosotros-container">
      {/* --- NAVEGACIÓN --- */}
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

      {/* --- HERO SECTION NOSOTROS --- */}
      <header className="nosotros-hero">
        <div className="hero-tags">
          <span className="tag">Belleza</span>
          <span className="tag">Innovación</span>
          <span className="tag">Aplicaciones</span>
        </div>
        <h1>Nosotros</h1>
      </header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="nosotros-content">
        <section className="info-row">
          <div className="watermark">FACTORIZ</div>
          <div className="info-text">
            <h2>Objetivo</h2>
            <p>Facilitar el acceso a herramientas digitales que permitan a los negocios del sector de la belleza mejorar su organización, aumentar su visibilidad y ofrecer un servicio más eficiente, conectándolos con clientes de manera rápida y sencilla.</p>
          </div>
          <div className="info-image-wrapper">
            <img src={objetivos} alt="Objetivo Factoriz" className="info-image" />
          </div>
        </section>

        <section className="info-row reverse">
          <div className="watermark right">FACTORIZ</div>
          <div className="info-text">
            <h2>¿Quiénes somos?</h2>
            <p>Somos una empresa enfocada en el desarrollo de soluciones tecnológicas para el sector de la belleza. Nos especializamos en crear herramientas digitales que conectan a usuarios con salones de belleza, peluquerías unisex y barberías, mejorando la forma en que se gestionan los servicios y la experiencia del cliente.</p>
            <p>Buscamos modernizar el sector estético mediante el uso de tecnologías innovadoras que optimicen procesos y faciliten la interacción entre negocios y clientes.</p>
          </div>
          <div className="info-image-wrapper">
            <img src={quienesSomos} alt="Equipo Factoriz" className="info-image" />
          </div>
        </section>

        <section className="info-row">
          <div className="watermark">FACTORIZ</div>
          <div className="info-text">
            <h2>Misión</h2>
            <p>Diseñar e implementar soluciones tecnológicas innovadoras que permitan a los negocios del sector estético mejorar su funcionamiento, optimizar la atención al cliente y adaptarse a las nuevas tendencias digitales del mercado.</p>
          </div>
          <div className="info-image-wrapper">
            <img src={mision} alt="Misión Factoriz" className="info-image" />
          </div>
        </section>

        <section className="info-row reverse">
          <div className="info-text">
            <h2>Visión</h2>
            <p>Posicionarnos como una empresa referente en el desarrollo de soluciones digitales para el sector de la belleza en América Latina, destacando por nuestra innovación, calidad de servicio y aporte a la transformación digital de los negocios.</p>
          </div>
          <div className="info-image-wrapper">
            <img src={vision} alt="Visión Factoriz" className="info-image" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Nosotros;