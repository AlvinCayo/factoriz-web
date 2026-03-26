// frontend/src/pages/Informacion.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Informacion.css';
import './Home.css'; // Hereda estilos del Navbar y Modales

import logoFactoriz from '../assets/logo.png';
import Footer from '../components/Footer';

const Informacion: React.FC = () => {
  // --- LÓGICA DE ANCLAJE (#) PARA EL FOOTER ---
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  // --- ESTADOS PARA MODALES DE AUTH ---
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const [usernameAuth, setUsernameAuth] = useState('');
  const [passwordAuth, setPasswordAuth] = useState('');
  const [authMessage, setAuthMessage] = useState({ type: '', text: '' }); 
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('username');
    if (savedUser) setCurrentUser(savedUser);
  }, []);

  const resetAuthForm = () => { setUsernameAuth(''); setPasswordAuth(''); setAuthMessage({ type: '', text: '' }); };
  const closeAllModals = () => { setIsLoginOpen(false); setIsRegisterOpen(false); resetAuthForm(); };
  const switchModal = (to: 'login' | 'register') => { resetAuthForm(); to === 'login' ? (setIsRegisterOpen(false), setIsLoginOpen(true)) : (setIsLoginOpen(false), setIsRegisterOpen(true)); };
  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('username'); setCurrentUser(null); };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setIsAuthLoading(true); setAuthMessage({ type: '', text: '' });
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: usernameAuth, password: passwordAuth }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrar');
      setAuthMessage({ type: 'success', text: '¡Cuenta creada! Ahora inicia sesión.' });
      setTimeout(() => switchModal('login'), 2000);
    } catch (err: unknown) { setAuthMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error desconocido' }); } finally { setIsAuthLoading(false); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setIsAuthLoading(true); setAuthMessage({ type: '', text: '' });
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: usernameAuth, password: passwordAuth }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Credenciales incorrectas');
      localStorage.setItem('token', data.token); localStorage.setItem('username', data.username);
      setCurrentUser(data.username); closeAllModals();
    } catch (err: unknown) { setAuthMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error desconocido' }); } finally { setIsAuthLoading(false); }
  };

  return (
    <div className="informacion-container">
      
      {/* MODALES DE AUTH */}
      {isRegisterOpen && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeAllModals}>&times;</button>
            <h2 className="modal-title">Crea tu Cuenta</h2>
            {authMessage.text && <div className={`alert-message ${authMessage.type === 'error' ? 'alert-error' : 'alert-success'}`}>{authMessage.text}</div>}
            <form onSubmit={handleRegister}>
              <div className="form-group"><label>Nombre de Usuario</label><input type="text" className="form-input" value={usernameAuth} onChange={(e) => setUsernameAuth(e.target.value)} required /></div>
              <div className="form-group"><label>Contraseña</label><input type="password" className="form-input" value={passwordAuth} onChange={(e) => setPasswordAuth(e.target.value)} required /></div>
              <button type="submit" className="btn-main btn-submit" disabled={isAuthLoading}>{isAuthLoading ? 'Registrando...' : 'Registrarme'}</button>
            </form>
            <div className="auth-switch">¿Ya tienes una cuenta? <button onClick={() => switchModal('login')}>Inicia Sesión</button></div>
          </div>
        </div>
      )}

      {isLoginOpen && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeAllModals}>&times;</button>
            <h2 className="modal-title">Bienvenido de nuevo</h2>
            {authMessage.text && <div className={`alert-message ${authMessage.type === 'error' ? 'alert-error' : 'alert-success'}`}>{authMessage.text}</div>}
            <form onSubmit={handleLogin}>
              <div className="form-group"><label>Nombre de Usuario</label><input type="text" className="form-input" value={usernameAuth} onChange={(e) => setUsernameAuth(e.target.value)} required /></div>
              <div className="form-group"><label>Contraseña</label><input type="password" className="form-input" value={passwordAuth} onChange={(e) => setPasswordAuth(e.target.value)} required /></div>
              <button type="submit" className="btn-main btn-submit" disabled={isAuthLoading}>{isAuthLoading ? 'Entrando...' : 'Ingresar'}</button>
            </form>
            <div className="auth-switch">¿No tienes una cuenta? <button onClick={() => switchModal('register')}>Regístrate</button></div>
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
          <Link to="/servicios">Nuestra App</Link>
          <Link to="/contacto">Contacto</Link>
        </div>
        <div className="nav-buttons">
          {currentUser ? (
            <><span style={{ fontWeight: 600, marginRight: '10px', color: '#000' }}>Hola, {currentUser}</span><button onClick={handleLogout} className="btn-logout">Salir</button></>
          ) : (
            <><button onClick={() => setIsLoginOpen(true)} className="btn-login">Iniciar Sesión</button><button onClick={() => setIsRegisterOpen(true)} className="btn-register">Registrarme</button></>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="informacion-hero">
        <div className="hero-tags">
          <span className="tag">Belleza</span>
          <span className="tag">Innovación</span>
          <span className="tag">Aplicaciones</span>
        </div>
        <h1>INFORMACIÓN</h1>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="informacion-content">
        
        {/* =========================================
            SECCIÓN 1: TÉRMINOS Y CONDICIONES 
            ========================================= */}
        <section className="legal-section" id="terminos">
          <h2>Términos y Condiciones</h2>
          
          <div className="legal-grid">
            {/* Columna Izquierda (1-5) */}
            <div className="legal-col">
              <div className="legal-item">
                <h3>1. Objeto del servicio</h3>
                <p>La aplicación móvil desarrollada por Factoriz - Belleza, Innovación Aplicaciones tiene como finalidad facilitar la gestión de citas en centros de estética mediante herramientas digitales como geolocalización, análisis biométrico facial referencial y generación de códigos QR para validación de reservas.</p>
              </div>

              <div className="legal-item">
                <h3>2. Aceptación de los términos</h3>
                <p>Al descargar, registrarse o utilizar la aplicación, el usuario acepta los presentes Términos y Condiciones. En caso de no estar de acuerdo con alguno de los términos establecidos, se recomienda no utilizar la plataforma.</p>
              </div>

              <div className="legal-item">
                <h3>3. Registro de usuario</h3>
                <p>Para acceder a determinadas funcionalidades, el usuario deberá registrarse proporcionando información veraz y actualizada. El usuario es responsable de mantener la confidencialidad de su cuenta y contraseña.</p>
              </div>

              <div className="legal-item">
                <h3>4. Uso adecuado de la plataforma</h3>
                <p>El usuario se compromete a utilizar la aplicación únicamente para fines lícitos, evitando cualquier acción que pueda afectar el funcionamiento del sistema o perjudicar a otros usuarios.</p>
              </div>

              <div className="legal-item">
                <h3>5. Sistema de reservas</h3>
                <p>La aplicación permite reservar citas en centros de estética registrados dentro de la plataforma. Cada reserva confirmada generará un código QR que deberá presentarse en el establecimiento para validar la cita.</p>
              </div>
            </div>

            {/* Columna Derecha (6-10) */}
            <div className="legal-col">
              <div className="legal-item">
                <h3>6. Pagos y tarifas</h3>
                <p>La descarga de la aplicación es gratuita. Sin embargo, algunas funcionalidades, como la confirmación de reservas o el acceso a módulos adicionales de análisis estético, pueden requerir el pago de una tarifa dentro de la plataforma.</p>
              </div>

              <div className="legal-item">
                <h3>7. Política de cancelación y reembolso</h3>
                <p>En caso de incumplimiento de la cita por parte del establecimiento registrado, la plataforma podrá proceder con la devolución de la tarifa de reserva conforme a las políticas establecidas.</p>
              </div>

              <div className="legal-item">
                <h3>8. Limitación de responsabilidad</h3>
                <p>Las recomendaciones generadas por el sistema de análisis facial tienen carácter referencial y no garantizan resultados exactos en el servicio estético realizado por el establecimiento.</p>
              </div>

              <div className="legal-item">
                <h3>9. Modificaciones del servicio</h3>
                <p>Factoriz se reserva el derecho de modificar, actualizar o suspender temporalmente cualquier funcionalidad del sistema cuando sea necesario para mejorar el servicio.</p>
              </div>

              <div className="legal-item">
                <h3>10. Legislación aplicable</h3>
                <p>Los presentes términos se rigen por la normativa vigente del Estado Plurinacional de Bolivia.</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            SECCIÓN 2: POLÍTICA DE COOKIES (Nuevos Textos)
            ========================================= */}
        <section className="legal-section" id="cookies">
          <h2>Política de Cookies</h2>
          
          <div className="legal-grid">
            <div className="legal-col">
              <div className="legal-item">
                <h3>1. ¿Qué son las cookies?</h3>
                <p>Las cookies son pequeños archivos de texto que se almacenan en el dispositivo del usuario cuando visita una página web. Estas permiten mejorar la experiencia de navegación y optimizar el funcionamiento del sitio.</p>
              </div>

              <div className="legal-item">
                <h3>2. Tipos de cookies utilizadas</h3>
                <ul>
                  <li><strong>Cookies técnicas:</strong> necesarias para el funcionamiento básico del sitio web.</li>
                  <li><strong>Cookies de análisis:</strong> permiten recopilar información estadística sobre el uso del sitio para mejorar los servicios ofrecidos.</li>
                  <li><strong>Cookies de personalización:</strong> permiten recordar preferencias del usuario como idioma o configuración.</li>
                </ul>
              </div>

              <div className="legal-item">
                <h3>3. Finalidad del uso de cookies</h3>
                <p>Las cookies se utilizan para mejorar la navegación del usuario, analizar el comportamiento dentro del sitio y optimizar la experiencia de uso de la plataforma.</p>
              </div>
            </div>

            <div className="legal-col">
              <div className="legal-item">
                <h3>4. Gestión de cookies</h3>
                <p>El usuario puede configurar su navegador para aceptar, bloquear o eliminar cookies en cualquier momento. Sin embargo, la desactivación de algunas cookies podría afectar el funcionamiento del sitio web.</p>
              </div>

              <div className="legal-item">
                <h3>5. Actualizaciones</h3>
                <p>La presente política de cookies podrá ser modificada cuando sea necesario para adaptarse a cambios técnicos o legales.</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            SECCIÓN 3: AVISO LEGAL (Nuevos Textos)
            ========================================= */}
        <section className="legal-section" id="aviso-legal">
          <h2>Aviso Legal</h2>
          
          <div className="legal-grid">
            <div className="legal-col">
              <div className="legal-item">
                <h3>1. Información general</h3>
                <ul>
                  <li><strong>Empresa:</strong> Factoriz – Belleza · Innovación · Aplicaciones</li>
                  <li><strong>Actividad:</strong> Desarrollo de soluciones tecnológicas y aplicaciones móviles orientadas al sector de estética y cuidado personal.</li>
                  <li><strong>Ubicación:</strong> La Paz, Bolivia.</li>
                </ul>
              </div>

              <div className="legal-item">
                <h3>2. Propiedad intelectual</h3>
                <p>Todos los contenidos presentes en la aplicación y en la página web, incluyendo textos, diseños, logotipos, software, imágenes y funcionalidades, son propiedad de Factoriz o cuentan con autorización para su uso.</p>
                <p>Queda prohibida la reproducción, distribución o modificación del contenido sin autorización expresa del titular.</p>
              </div>

              <div className="legal-item">
                <h3>3. Responsabilidad del usuario</h3>
                <p>El usuario se compromete a utilizar la plataforma de manera responsable y conforme a la normativa vigente. Cualquier uso indebido de la plataforma será responsabilidad exclusiva del usuario.</p>
              </div>
            </div>

            <div className="legal-col">
              <div className="legal-item">
                <h3>4. Protección de datos</h3>
                <p>Factoriz se compromete a proteger la información personal de los usuarios y a aplicar medidas de seguridad para evitar accesos no autorizados o el uso indebido de datos.</p>
              </div>

              <div className="legal-item">
                <h3>5. Enlaces externos</h3>
                <p>La plataforma puede contener enlaces a sitios web externos. Factoriz no se responsabiliza del contenido ni del funcionamiento de dichos sitios.</p>
              </div>

              <div className="legal-item">
                <h3>6. Actualización del aviso legal</h3>
                <p>El presente aviso legal puede ser modificado en cualquier momento para adaptarse a cambios legales o técnicos del servicio.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER GLOBAL */}
      <Footer />
    </div>
  );
};

export default Informacion;