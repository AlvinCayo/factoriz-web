// frontend/src/pages/Contacto.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Contacto.css';
import './Home.css'; // Hereda estilos del Navbar y Modales

import logoFactoriz from '../assets/logo.png';
import Footer from '../components/Footer';

const Contacto: React.FC = () => {
  // --- ESTADOS PARA MODALES DE AUTH ---
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Auth form states
  const [usernameAuth, setUsernameAuth] = useState('');
  const [passwordAuth, setPasswordAuth] = useState('');
  const [authMessage, setAuthMessage] = useState({ type: '', text: '' }); 
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // --- ESTADOS PARA EL FORMULARIO DE CONTACTO (NUEVOS CAMPOS) ---
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [motivo, setMotivo] = useState('');
  const [servicio, setServicio] = useState('');
  const [terminos, setTerminos] = useState(false);
  
  const [contactMessage, setContactMessage] = useState({ type: '', text: '' });
  const [isContactLoading, setIsContactLoading] = useState(false);

  // Efecto Sesión
  useEffect(() => {
    const savedUser = localStorage.getItem('username');
    if (savedUser) setCurrentUser(savedUser);
  }, []);

  const resetAuthForm = () => { setUsernameAuth(''); setPasswordAuth(''); setAuthMessage({ type: '', text: '' }); };
  const closeAllModals = () => { setIsLoginOpen(false); setIsRegisterOpen(false); resetAuthForm(); };
  const switchModal = (to: 'login' | 'register') => { resetAuthForm(); to === 'login' ? (setIsRegisterOpen(false), setIsLoginOpen(true)) : (setIsLoginOpen(false), setIsRegisterOpen(true)); };
  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('username'); setCurrentUser(null); };

  // Funciones de Auth (Omitidas visualmente por espacio, pero funcionales en el form)
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

  // --- LÓGICA DEL FORMULARIO DE CONTACTO ---
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactMessage({ type: '', text: '' });

    if (!terminos) {
      setContactMessage({ type: 'error', text: 'Debes aceptar los términos y condiciones.' });
      return;
    }

    setIsContactLoading(true);

    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombres, apellidos, email, motivo, servicio }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al enviar el mensaje');

      setContactMessage({ type: 'success', text: data.message });
      
      // Limpiamos todo el formulario
      setNombres(''); setApellidos(''); setEmail(''); setMotivo(''); setServicio(''); setTerminos(false);
    } catch (err: unknown) {
      setContactMessage({ type: 'error', text: err instanceof Error ? err.message : 'Ocurrió un error inesperado.' });
    } finally {
      setIsContactLoading(false);
    }
  };

  return (
    <div className="contacto-container">
      {/* MODALES DE AUTH */}
      {isRegisterOpen && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeAllModals}>&times;</button>
            <h2 className="modal-title">Crea tu Cuenta</h2>
            {authMessage.text && <div className={`alert-message ${authMessage.type === 'error' ? 'alert-error' : 'alert-success'}`}>{authMessage.text}</div>}
            <form onSubmit={handleRegister}>
              <div className="form-group"><label>Usuario</label><input type="text" className="form-input" value={usernameAuth} onChange={(e) => setUsernameAuth(e.target.value)} required /></div>
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
              <div className="form-group"><label>Usuario</label><input type="text" className="form-input" value={usernameAuth} onChange={(e) => setUsernameAuth(e.target.value)} required /></div>
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
          <Link to="/servicios">Servicios</Link>
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

      {/* CONTENIDO PRINCIPAL: FORMULARIO */}
      <main className="contacto-main">
        <div className="form-wrapper-contacto">
          
          <h1>Contáctanos!</h1>
          <p className="subtitle">Que nos quieres decir...</p>

          {contactMessage.text && (
            <div className={`alert-message ${contactMessage.type === 'error' ? 'alert-error' : 'alert-success'}`}>
              {contactMessage.text}
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="form-contacto">
            
            {/* Fila 1: Nombres y Apellidos */}
            <div className="form-row-2">
              <div className="field-group">
                <label>Nombres</label>
                <input 
                  type="text" 
                  className="form-input-contacto" 
                  placeholder="Placeholder" 
                  value={nombres} 
                  onChange={(e) => setNombres(e.target.value)} 
                  required 
                />
              </div>
              <div className="field-group">
                <label>Apellidos</label>
                <input 
                  type="text" 
                  className="form-input-contacto" 
                  placeholder="Placeholder" 
                  value={apellidos} 
                  onChange={(e) => setApellidos(e.target.value)} 
                  required 
                />
              </div>
            </div>

            {/* Fila 2: E-mail */}
            <div className="field-group">
              <label>E-mail</label>
              <input 
                type="email" 
                className="form-input-contacto" 
                placeholder="ejemplo@gmail.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            {/* Fila 3: Motivo */}
            <div className="field-group">
              <label>Motivo</label>
              <input 
                type="text" 
                className="form-input-contacto" 
                placeholder="Describa el motivo de querer contactanos" 
                value={motivo} 
                onChange={(e) => setMotivo(e.target.value)} 
                required 
              />
            </div>

            {/* Fila 4: Servicios (Dropdown) */}
            <div className="field-group">
              <label>Desea algún servicio?</label>
              <select 
                className={`form-select-contacto ${servicio ? 'selected' : ''}`}
                value={servicio} 
                onChange={(e) => setServicio(e.target.value)}
                required
              >
                <option value="" disabled hidden>Seleccione un servicio</option>
                <option value="Gestión de reservas">Gestión de reservas</option>
                <option value="Geolocalización">Geolocalización</option>
                <option value="Análisis facial">Análisis facial</option>
                <option value="Herramientas de gestión">Herramientas de gestión</option>
                <option value="Conexión clientes">Conexión entre clientes y negocios</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            {/* Checkbox Términos */}
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="terminos" 
                checked={terminos} 
                onChange={(e) => setTerminos(e.target.checked)} 
              />
              <label htmlFor="terminos">Acepto los términos y condiciones</label>
            </div>

            {/* Botón Enviar */}
            <button type="submit" className="btn-submit-contacto" disabled={isContactLoading}>
              {isContactLoading ? 'Enviando...' : 'Enviar'}
            </button>

          </form>
        </div>
      </main>

      {/* FOOTER GLOBAL */}
      <Footer />
    </div>
  );
};

export default Contacto;