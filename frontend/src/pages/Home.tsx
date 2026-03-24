// frontend/src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Star } from 'lucide-react'; 
import './Home.css';

import logoFactoriz from '../assets/logo.png';
import fondoHero from '../assets/fondo.png';
import Footer from '../components/Footer';

interface Feedback {
  id: number;
  username: string;
  comment: string;
  rating: number;
  created_at: string;
}

const Home: React.FC = () => {
  // --- ESTADOS PARA MODALES DE AUTH ---
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const [usernameAuth, setUsernameAuth] = useState('');
  const [passwordAuth, setPasswordAuth] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' }); 
  const [isLoading, setIsLoading] = useState(false);

  // --- ESTADOS PARA VALORACIONES ---
  const [isFeedbacksOpen, setIsFeedbacksOpen] = useState(false);
  const [feedbacksList, setFeedbacksList] = useState<Feedback[]>([]);
  const [newFeedbackText, setNewFeedbackText] = useState('');
  const [newRating, setNewRating] = useState(5); 
  const [isPostingFeedback, setIsPostingFeedback] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('username');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const resetForm = () => {
    setUsernameAuth('');
    setPasswordAuth('');
    setMessage({ type: '', text: '' });
  };

  const closeAllModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setIsFeedbacksOpen(false); 
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
        body: JSON.stringify({ username: usernameAuth, password: passwordAuth }),
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
        body: JSON.stringify({ username: usernameAuth, password: passwordAuth }),
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

  // --- LÓGICA DE VALORACIONES ---
  useEffect(() => {
    if (isFeedbacksOpen) fetchFeedbacks();
  }, [isFeedbacksOpen]);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/feedbacks');
      const data = await res.json();
      setFeedbacksList(data);
    } catch (err) {
      console.error("Error cargando valoraciones", err);
    }
  };

  const handlePostFeedback = async () => {
    if (!newFeedbackText.trim() || !currentUser) return;
    setIsPostingFeedback(true);

    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser, comment: newFeedbackText, rating: newRating }),
      });
      
      if (res.ok) {
        setNewFeedbackText('');
        setNewRating(5);
        fetchFeedbacks(); 
      }
    } catch (err) {
      console.error("Error al publicar", err);
    } finally {
      setIsPostingFeedback(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const renderStaticStars = (rating: number) => {
    return (
      <div className="comment-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} size={16} fill={star <= rating ? "currentColor" : "none"} className={star <= rating ? "filled" : ""} />
        ))}
      </div>
    );
  };

  // Extrae la primera letra del nombre de usuario para el avatar
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="home-container">
      
      {/* --- BOTÓN FLOTANTE DE VALORACIONES (SIEMPRE VISIBLE) --- */}
      <button className="floating-btn-comments" onClick={() => setIsFeedbacksOpen(true)}>
        <MessageSquare size={20} /> Valoraciones
      </button>

      {/* --- MODAL DE VALORACIONES --- */}
      {isFeedbacksOpen && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="comments-modal-content" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header-comments">
              <button className="modal-close" onClick={closeAllModals}>&times;</button>
              <h2>Comunidad Factoriz</h2>
            </div>
            
            <div className="comments-list">
              {feedbacksList.length === 0 ? (
                <p className="empty-comments">Aún no hay valoraciones. ¡Anímate a compartir tu experiencia!</p>
              ) : (
                feedbacksList.map((feedback) => (
                  <div key={feedback.id} className="comment-item">
                    <div className="comment-header">
                      <div className="comment-author-info">
                        <div className="comment-avatar">
                          {getInitial(feedback.username)}
                        </div>
                        <div className="comment-name-date">
                          <span className="comment-author">@{feedback.username}</span>
                          <span className="comment-date">{formatDate(feedback.created_at)}</span>
                        </div>
                      </div>
                      {renderStaticStars(feedback.rating || 5)}
                    </div>
                    <p className="comment-text">{feedback.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* CONTROL DE ACCESO PARA COMENTAR */}
            {currentUser ? (
              <div className="comment-input-area">
                <div className="rating-selector">
                  <span>Tu calificación:</span>
                  <div className="interactive-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={24} 
                        fill={star <= newRating ? "currentColor" : "none"} 
                        className={star <= newRating ? "active" : ""}
                        onClick={() => setNewRating(star)}
                      />
                    ))}
                  </div>
                </div>
                <textarea 
                  className="comment-textarea" 
                  placeholder="Escribe tu experiencia con Factoriz..."
                  value={newFeedbackText}
                  onChange={(e) => setNewFeedbackText(e.target.value)}
                ></textarea>
                <button 
                  className="btn-main" 
                  onClick={handlePostFeedback}
                  disabled={isPostingFeedback || !newFeedbackText.trim()}
                >
                  {isPostingFeedback ? 'Publicando...' : 'Publicar Valoración'}
                </button>
              </div>
            ) : (
              <div className="login-prompt-area">
                <p>¿Tienes algo que decirnos? Inicia sesión para dejar tu valoración y contarnos tu experiencia.</p>
                <button className="btn-login-prompt" onClick={() => switchModal('login')}>
                  Iniciar Sesión
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* --- MODAL REGISTRO --- */}
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
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ej: alvin_admin"
                  value={usernameAuth}
                  onChange={(e) => setUsernameAuth(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="Crea una contraseña segura"
                  value={passwordAuth}
                  onChange={(e) => setPasswordAuth(e.target.value)}
                  required 
                />
              </div>
              <button type="submit" className="btn-main btn-submit" disabled={isLoading}>
                {isLoading ? 'Registrando...' : 'Registrarme'}
              </button>
            </form>
            <div className="auth-switch">
              ¿Ya tienes una cuenta? 
              <button onClick={() => switchModal('login')}>Inicia Sesión</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL LOGIN --- */}
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
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Tu usuario"
                  value={usernameAuth}
                  onChange={(e) => setUsernameAuth(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="Tu contraseña"
                  value={passwordAuth}
                  onChange={(e) => setPasswordAuth(e.target.value)}
                  required 
                />
              </div>
              <button type="submit" className="btn-main btn-submit" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Ingresar'}
              </button>
            </form>
            <div className="auth-switch">
              ¿No tienes una cuenta? 
              <button onClick={() => switchModal('register')}>Regístrate</button>
            </div>
          </div>
        </div>
      )}

      {/* NAVEGACIÓN */}
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
              <span style={{ fontWeight: 600, marginRight: '10px' }}>Hola, {currentUser}</span>
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

      {/* HERO SECTION */}
      <section className="hero">
        <img src={fondoHero} alt="Fondo Factoriz" className="hero-bg" />
        <div className="hero-content">
          <div className="hero-tags">
            <span className="tag">Belleza</span>
            <span className="tag">Innovación</span>
            <span className="tag">Aplicaciones</span>
          </div>
          <h1>FACTORIZ</h1>
          <p>
            El equipo detrás de aplicaciones profesionales. Desarrollamos aplicaciones y plataformas que combinan tecnología, innovación y experiencia de usuario para mejorar la forma en que las personas acceden a servicios y herramientas digitales.
          </p>
          <button className="btn-main">SABER MAS</button>
        </div>
      </section>

      {/* A QUIÉNES AYUDAMOS */}
      <section className="section" id="nosotros">
        <h2 className="section-title">¿A quiénes ayudamos?</h2>
        <p className="section-subtitle">
          Nuestra empresa desarrolla soluciones tecnológicas enfocadas en salones de belleza, peluquerías unisex y barberías, ayudando a modernizar la gestión de citas, mejorar la experiencia del cliente y optimizar el funcionamiento de los negocios del sector estético.
        </p>
        <div className="grid-3">
          <div className="card">
            <img src="https://via.placeholder.com/60?text=Icono+1" alt="Icono Peluquería" className="card-icon" />
            <h3>Peluquerías Unisex</h3>
          </div>
          <div className="card">
            <img src="https://via.placeholder.com/60?text=Icono+2" alt="Icono Salones" className="card-icon" />
            <h3>Salones de Belleza</h3>
          </div>
          <div className="card">
            <img src="https://via.placeholder.com/60?text=Icono+3" alt="Icono Barbería" className="card-icon" />
            <h3>Barberías</h3>
          </div>
        </div>
      </section>

      {/* QUÉ OFRECE LA EMPRESA Y FEATURES */}
      <section className="section" id="servicios">
        <h2 className="section-title">¿Qué ofrece la empresa?</h2>
        <p className="section-subtitle" style={{ marginBottom: '6rem' }}>
          Soluciones digitales para el sector estético. Nuestra empresa desarrolla herramientas tecnológicas que ayudan a los negocios del sector de la belleza a mejorar su organización, atraer nuevos clientes y ofrecer una experiencia moderna.
        </p>

        <div className="feature-row">
          <div className="feature-text">
            <h2>Aumenta la visibilidad de tu negocio y atrae a nuevos clientes</h2>
            <p>
              La mayoría de las personas buscan servicios de belleza por internet. Con nuestra plataforma, tu negocio estará visible para cientos de usuarios que buscan un servicio como el tuyo.
            </p>
          </div>
          <div className="feature-image-wrapper">
            <img src="https://via.placeholder.com/350x700?text=Pantalla+App+1" alt="Mockup App Visibilidad" className="feature-mockup" />
          </div>
        </div>

        <div className="feature-row reverse">
          <div className="feature-text">
            <h2>Aumenta el número de reservas y simplifica la gestión de tus citas</h2>
            <p>
              Olvídate de las llamadas perdidas y los mensajes sin responder. Con nuestra plataforma, tus clientes pueden reservar citas las 24 horas del día, los 7 días de la semana, desde cualquier dispositivo.
            </p>
          </div>
          <div className="feature-image-wrapper">
            <img src="https://via.placeholder.com/350x700?text=Pantalla+App+2" alt="Mockup App Reservas" className="feature-mockup" />
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS Y ESTADÍSTICAS */}
      <section className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <h2 className="section-title">¿Por qué elegirnos?</h2>
        <div className="grid-3" style={{ marginTop: '3rem' }}>
          <div className="card">
            <img src="https://via.placeholder.com/60?text=Icon" alt="Icono" className="card-icon" />
            <h3>Innovación tecnológica</h3>
            <p>Aplicamos herramientas modernas para mejorar la experiencia en salones de belleza.</p>
          </div>
          <div className="card">
            <img src="https://via.placeholder.com/60?text=Icon" alt="Icono" className="card-icon" />
            <h3>Optimización del servicio</h3>
            <p>Ayudamos a los negocios a organizar mejor sus citas y servicios.</p>
          </div>
          <div className="card">
            <img src="https://via.placeholder.com/60?text=Icon" alt="Icono" className="card-icon" />
            <h3>Conexión con clientes</h3>
            <p>Facilitamos que los usuarios encuentren fácilmente el servicio que necesitan.</p>
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-item"><span className="stat-number">8</span><span className="stat-label">Años de exp.</span></div>
          <div className="stat-item"><span className="stat-number">250+</span><span className="stat-label">Clientes atendidos</span></div>
          <div className="stat-item"><span className="stat-number">600+</span><span className="stat-label">Reservas gestionadas</span></div>
          <div className="stat-item"><span className="stat-number">50+</span><span className="stat-label">Salones afiliados</span></div>
          <div className="stat-item"><span className="stat-number">+1K</span><span className="stat-label">Usuarios en la plataforma</span></div>
        </div>
      </section>

      {/* NUESTRO EQUIPO */}
      <section className="section">
        <h2 className="section-title">Nuestro Equipo</h2>
        <div className="grid-4" style={{ marginTop: '4rem' }}>
          <div className="team-card">
            <img src="https://via.placeholder.com/150" alt="Foto Alex" className="team-img" />
            <h4>Alex Javier Apaza Nina</h4><p>UI Designer & Co-founder</p>
          </div>
          <div className="team-card">
            <img src="https://via.placeholder.com/150" alt="Foto Brayan" className="team-img" />
            <h4>Brayan Choquehuanca Mamani</h4><p>UX Designer & Co-founder</p>
          </div>
          <div className="team-card">
            <img src="https://via.placeholder.com/150" alt="Foto Alvin" className="team-img" />
            <h4>Alvin Ariel Cayo Quispe</h4><p>Developer</p>
          </div>
          <div className="team-card">
            <img src="https://via.placeholder.com/150" alt="Foto Reyshel" className="team-img" />
            <h4>Reyshel Brisneyda Ortiz Gambarte</h4><p>Diseñador UI/UX</p>
          </div>
        </div>
      </section>
  
      <Footer />
    </div>
  );
};

export default Home;