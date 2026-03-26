// frontend/src/pages/Nosotros.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Nosotros.css';
import './Home.css'; // Hereda estilos del Navbar y Modales

import logoFactoriz from '../assets/logo.png';
import Footer from '../components/Footer';
import objetivos from '../assets/objetivo.jpg';
import quienesSomos from '../assets/quienes.jpg';
import mision from '../assets/mision.jpg';
import vision from '../assets/vision.jpg';

const Nosotros: React.FC = () => {
  // --- ESTADOS PARA MODALES ---
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' }); 
  const [isLoading, setIsLoading] = useState(false);

  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('username');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setMessage({ type: '', text: '' });
  };

  const closeAllModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    resetForm();
  };

  const switchModal = (to: 'login' | 'register') => {
    resetForm();
    if (to === 'login') {
      setIsRegisterOpen(false);
      setIsLoginOpen(true);
    } else {
      setIsLoginOpen(false);
      setIsRegisterOpen(true);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrar');

      setMessage({ type: 'success', text: '¡Cuenta creada! Ahora inicia sesión.' });
      setTimeout(() => switchModal('login'), 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Credenciales incorrectas');

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      
      setCurrentUser(data.username);
      closeAllModals();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setCurrentUser(null);
  };

  return (
    <div className="nosotros-container">
      {/* --- MODALES DE AUTH --- */}
      {isRegisterOpen && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeAllModals}>&times;</button>
            <h2 className="modal-title">Crea tu Cuenta</h2>
            {message.text && (
              <div className={`alert-message ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                {message.text}
              </div>
            )}
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Nombre de Usuario</label>
                <input type="text" className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn-main btn-submit" disabled={isLoading}>
                {isLoading ? 'Registrando...' : 'Registrarme'}
              </button>
            </form>
            <div className="auth-switch">
              ¿Ya tienes una cuenta? <button onClick={() => switchModal('login')}>Inicia Sesión</button>
            </div>
          </div>
        </div>
      )}

      {isLoginOpen && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeAllModals}>&times;</button>
            <h2 className="modal-title">Bienvenido de nuevo</h2>
            {message.text && (
              <div className={`alert-message ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                {message.text}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Nombre de Usuario</label>
                <input type="text" className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn-main btn-submit" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Ingresar'}
              </button>
            </form>
            <div className="auth-switch">
              ¿No tienes una cuenta? <button onClick={() => switchModal('register')}>Regístrate</button>
            </div>
          </div>
        </div>
      )}

      {/* --- NAVEGACIÓN (Navbar) --- */}
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
              <button onClick={() => setIsLoginOpen(true)} className="btn-login">Iniciar Sesión</button>
              <button onClick={() => setIsRegisterOpen(true)} className="btn-register">Registrarme</button>
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
        
        {/* BLOQUE 1: OBJETIVO (Texto Izquierda, Imagen Derecha) */}
        <section className="info-row">
          <div className="watermark">FACTORIZ</div>
          <div className="info-text">
            <h2>Objetivo</h2>
            <p>
              Facilitar el acceso a herramientas digitales que permitan a los negocios del sector de la belleza mejorar su organización, aumentar su visibilidad y ofrecer un servicio más eficiente, conectándolos con clientes de manera rápida y sencilla.
            </p>
          </div>
          <div className="info-image-wrapper">
            {/* Reemplaza este link por la ruta de tu imagen real, ej: src="/objetivo.jpg" */}
            <img src={objetivos} alt="Objetivo Factoriz" className="info-image" />
          </div>
        </section>

        {/* BLOQUE 2: ¿QUIÉNES SOMOS? (Imagen Izquierda, Texto Derecha) */}
        <section className="info-row reverse">
          <div className="watermark right">FACTORIZ</div>
          <div className="info-text">
            <h2>¿Quiénes somos?</h2>
            <p>
              Somos una empresa enfocada en el desarrollo de soluciones tecnológicas para el sector de la belleza. Nos especializamos en crear herramientas digitales que conectan a usuarios con salones de belleza, peluquerías unisex y barberías, mejorando la forma en que se gestionan los servicios y la experiencia del cliente.
            </p>
            <p>
              Buscamos modernizar el sector estético mediante el uso de tecnologías innovadoras que optimicen procesos y faciliten la interacción entre negocios y clientes.
            </p>
          </div>
          <div className="info-image-wrapper">
            {/* Reemplaza este link por la ruta de tu imagen real */}
            <img src={quienesSomos} alt="Equipo Factoriz" className="info-image" />
          </div>
        </section>

        {/* BLOQUE 3: MISIÓN (Texto Izquierda, Imagen Derecha) */}
        <section className="info-row">
          <div className="watermark">FACTORIZ</div>
          <div className="info-text">
            <h2>Misión</h2>
            <p>
              Diseñar e implementar soluciones tecnológicas innovadoras que permitan a los negocios del sector estético mejorar su funcionamiento, optimizar la atención al cliente y adaptarse a las nuevas tendencias digitales del mercado.
            </p>
          </div>
          <div className="info-image-wrapper">
            {/* Reemplaza este link por la ruta de tu imagen real */}
            <img src={mision} alt="Misión Factoriz" className="info-image" />
          </div>
        </section>

        {/* BLOQUE 4: VISIÓN (Imagen Izquierda, Texto Derecha) */}
        <section className="info-row reverse">
          <div className="info-text">
            <h2>Visión</h2>
            <p>
              Posicionarnos como una empresa referente en el desarrollo de soluciones digitales para el sector de la belleza en América Latina, destacando por nuestra innovación, calidad de servicio y aporte a la transformación digital de los negocios.
            </p>
          </div>
          <div className="info-image-wrapper">
            {/* Reemplaza este link por la ruta de tu imagen real */}
            <img src={vision} alt="Visión Factoriz" className="info-image" />
          </div>
        </section>

      </main>

      {/* FOOTER GLOBAL */}
      <Footer />
    </div>
  );
};

export default Nosotros;