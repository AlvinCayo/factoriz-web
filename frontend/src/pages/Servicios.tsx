// frontend/src/pages/Servicios.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Servicios.css';
import './Home.css'; // Hereda estilos del Navbar y Modales

import logoFactoriz from '../assets/logo.png';
import Footer from '../components/Footer';
import mackreserva from '../assets/mackreserva.png';
import mackgeolocalizacion from '../assets/mackubica.png';
import mackfacial from '../assets/mackfacial.png';
import mackdashboard from '../assets/mackdash.png';
import interaccion from '../assets/interaccion.jpg';
const Servicios: React.FC = () => {
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
    <div className="servicios-container">
      {/* --- MODALES --- */}
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

      {/* NAVEGACIÓN (Navbar) */}
      <nav className="navbar">
        <Link to="/" className="logo-container">
          <img src={logoFactoriz} alt="Logo Factoriz" className="logo-img" />
        </Link>
        <div className="nav-links">
          <Link to="/">Principal</Link>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/servicios">Servicios</Link>
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

      {/* --- HERO SECTION SERVICIOS --- */}
      <header className="servicios-hero">
        <div className="hero-tags">
          <span className="tag">Belleza</span>
          <span className="tag">Innovación</span>
          <span className="tag">Aplicaciones</span>
        </div>
        <h1>Nuestros Servicios</h1>
        <p>
          Soluciones digitales para el sector de la belleza. Ofrecemos herramientas tecnológicas diseñadas para optimizar la gestión de servicios en salones de belleza, peluquerías unisex y barberías, mejorando la organización interna y la experiencia de los clientes a través de una plataforma moderna e intuitiva.
        </p>
      </header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="servicios-content">
        
        {/* SERVICIO 1 */}
        <section className="servicio-row">
          <div className="servicio-text">
            <h2>Gestión de reservas digitales</h2>
            <p>
              Implementamos sistemas que permiten administrar citas de manera eficiente, reduciendo tiempos de espera y mejorando la organización del negocio.
            </p>
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

        {/* SERVICIO 2 (Invertido) */}
        <section className="servicio-row reverse">
          <div className="servicio-text">
            <h2>Geolocalización de servicios</h2>
            <p>
              Facilitamos la búsqueda de establecimientos cercanos, permitiendo a los usuarios encontrar rápidamente opciones disponibles según su ubicación.
            </p>
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

        {/* SERVICIO 3 */}
        <section className="servicio-row">
          <div className="servicio-text">
            <h2>Análisis facial inteligente</h2>
            <p>
              Integramos tecnología que permite recomendar estilos de corte, peinados o barba según las características del rostro del usuario.
            </p>
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

        {/* SERVICIO 4 (Invertido) */}
        <section className="servicio-row reverse">
          <div className="servicio-text">
            <h2>Herramientas de gestión para negocios</h2>
            <p>
              Brindamos soluciones que ayudan a los establecimientos a organizar mejor sus servicios y clientes.
            </p>
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

        {/* SERVICIO 5 */}
        <section className="servicio-row">
          <div className="servicio-text">
            <h2>Conexión entre clientes y negocios</h2>
            <p>
              Nuestra plataforma facilita la interacción directa entre usuarios y profesionales, mejorando la comunicación y el acceso a los servicios.
            </p>
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

      {/* FOOTER GLOBAL */}
      <Footer />
    </div>
  );
};

export default Servicios;