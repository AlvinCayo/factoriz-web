// frontend/src/pages/Home.tsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // <-- Importamos useNavigate
import { ChevronLeft, ChevronRight, MessageSquare, Star } from "lucide-react";
import "./Home.css";

import logoFactoriz from "../assets/logo.png";
import Footer from "../components/Footer";
import Fonthero from "../assets/Heropro.jpg";
import Peluqueri from "../assets/peluqueria.jpg";
import estilismo from "../assets/estilismo.jpg";
import barberia from "../assets/barberia.jpg";
import mackreserva from "../assets/mackreserva.png";
import mackubica from "../assets/mackubica.png";
import ubicacion from "../assets/Ubicacion.jpg";
import Calendario from "../assets/calendario.jpg";
import Ia from "../assets/IA.jpg";

interface Feedback {
  id: number;
  username: string;
  comment: string;
  rating: number;
  created_at: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate(); // <-- Inicializamos la navegación

  // --- ESTADO DEL USUARIO ---
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // --- ESTADOS PARA VALORACIONES ---
  const [isFeedbacksOpen, setIsFeedbacksOpen] = useState(false);
  const [feedbacksList, setFeedbacksList] = useState<Feedback[]>([]);
  const [newFeedbackText, setNewFeedbackText] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isPostingFeedback, setIsPostingFeedback] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);

  // --- VERIFICAR SESIÓN ACTIVA ---
  useEffect(() => {
    // Revisamos si guardaste el ID del usuario en el login anterior
    const savedUserId = localStorage.getItem("userId");
    const savedRole = localStorage.getItem("userRole");
    
    // Si tienes un backend que te devuelve el nombre, podrías hacer un fetch aquí.
    // Por ahora, si hay un userId, asumimos que está logueado.
    if (savedUserId) {
      setCurrentUser(savedRole === 'centro' ? 'Negocio' : 'Usuario'); 
    }
  }, []);

  const closeModals = () => {
    setIsFeedbacksOpen(false);
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -window.innerWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: window.innerWidth, behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    // Si tuvieras un token, también lo remueves aquí: localStorage.removeItem("token");
    setCurrentUser(null);
  };

  // --- LÓGICA DE VALORACIONES ---
  useEffect(() => {
    if (isFeedbacksOpen) fetchFeedbacks();
  }, [isFeedbacksOpen]);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/api/feedbacks");
      const data = await res.json();
      setFeedbacksList(data);
    } catch (err) {
      console.error("Error cargando valoraciones", err);
    }
  };

  const handlePostFeedback = async () => {
    if (!newFeedbackText.trim() || !currentUser) return;
    setIsPostingFeedback(true);

    // Como currentUser ahora dice "Usuario" o "Negocio", podrías requerir obtener el nombre real desde tu backend o localStorage
    const authorName = localStorage.getItem("username") || "Usuario Anónimo"; 

    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: authorName,
          comment: newFeedbackText,
          rating: newRating,
        }),
      });

      if (res.ok) {
        setNewFeedbackText("");
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
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const renderStaticStars = (rating: number) => {
    return (
      <div className="comment-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={star <= rating ? "currentColor" : "none"}
            className={star <= rating ? "filled" : ""}
          />
        ))}
      </div>
    );
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className="home-container">
      {/* --- BOTÓN FLOTANTE DE VALORACIONES --- */}
      <button
        className="floating-btn-comments"
        onClick={() => setIsFeedbacksOpen(true)}
      >
        <MessageSquare size={20} />
        <span className="texto-valoraciones">Valoraciones</span>
      </button>

      {/* --- MODAL DE VALORACIONES --- */}
      {isFeedbacksOpen && (
        <div className="modal-overlay" onClick={closeModals}>
          <div
            className="comments-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-comments">
              <button className="modal-close" onClick={closeModals}>
                &times;
              </button>
              <h2>Comunidad Factoriz / Aura</h2>
            </div>

            <div className="comments-list">
              {feedbacksList.length === 0 ? (
                <p className="empty-comments">
                  Aún no hay valoraciones. ¡Anímate a compartir tu experiencia!
                </p>
              ) : (
                feedbacksList.map((feedback) => (
                  <div key={feedback.id} className="comment-item">
                    <div className="comment-header">
                      <div className="comment-author-info">
                        <div className="comment-avatar">
                          {getInitial(feedback.username)}
                        </div>
                        <div className="comment-name-date">
                          <span className="comment-author">
                            @{feedback.username}
                          </span>
                          <span className="comment-date">
                            {formatDate(feedback.created_at)}
                          </span>
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
                  placeholder="Escribe tu experiencia..."
                  value={newFeedbackText}
                  onChange={(e) => setNewFeedbackText(e.target.value)}
                ></textarea>
                <button
                  className="btn-main"
                  onClick={handlePostFeedback}
                  disabled={isPostingFeedback || !newFeedbackText.trim()}
                >
                  {isPostingFeedback ? "Publicando..." : "Publicar Valoración"}
                </button>
              </div>
            ) : (
              <div className="login-prompt-area">
                <p>
                  ¿Tienes algo que decirnos? Inicia sesión para dejar tu
                  valoración y contarnos tu experiencia.
                </p>
                {/* Redirigimos al Login en lugar de abrir modal */}
                <button
                  className="btn-login-prompt"
                  onClick={() => navigate('/login')}
                >
                  Iniciar Sesión
                </button>
              </div>
            )}
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
          <Link to="/servicios">Nuestra App</Link>
          <Link to="/contacto">Contacto</Link>
        </div>
        <div className="nav-buttons">
          {currentUser ? (
            <>
              <span style={{ fontWeight: 600, marginRight: "10px" }}>
                Hola, {currentUser}
              </span>
              <button onClick={handleLogout} className="btn-logout">
                Salir
              </button>
            </>
          ) : (
            <>
              {/* Navegación a las nuevas páginas */}
              <button
                onClick={() => navigate('/login')}
                className="btn-login"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => navigate('/registro')}
                className="btn-register"
              >
                Registrarme
              </button>
            </>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <img src={Fonthero} alt="Fondo Factoriz" className="hero-bg" />
        <div className="hero-content">
          <div className="hero-tags">
            <span className="tag">Belleza</span>
            <span className="tag">Innovación</span>
            <span className="tag">Aplicaciones</span>
          </div>
          <h1>AURA / FACTORIZ</h1>

          <p>
            El equipo detrás de aplicaciones profesionales. Desarrollamos
            aplicaciones y plataformas que combinan tecnología, innovación y
            experiencia de usuario para mejorar la forma en que las personas
            acceden a servicios y herramientas digitales.
          </p>
          <button className="btn-main" onClick={() => navigate('/servicios')}>SABER MÁS</button>
        </div>
      </section>

      {/* A QUIÉNES AYUDAMOS */}
      <section className="section" id="nosotros">
        <h2 className="section-title">¿A quiénes ayudamos?</h2>
        <p className="section-subtitle">
          Nuestra empresa desarrolla soluciones tecnológicas enfocadas en
          salones de belleza, peluquerías unisex y barberías, ayudando a
          modernizar la gestión de citas, mejorar la experiencia del cliente y
          optimizar el funcionamiento de los negocios del sector estético.
        </p>
        <div className="grid-3">
          <div
            className="card"
            style={{ backgroundImage: `url(${Peluqueri})` }}
          >
            <div className="card-overlay"></div>
            <div className="card-content">
              <h3>Peluquerías Unisex</h3>
            </div>
          </div>

          <div
            className="card"
            style={{ backgroundImage: `url(${estilismo})` }}
          >
            <div className="card-overlay"></div>
            <div className="card-content">
              <h3>Salones de Belleza</h3>
            </div>
          </div>

          <div className="card" style={{ backgroundImage: `url(${barberia})` }}>
            <div className="card-overlay"></div>
            <div className="card-content">
              <h3>Barberías</h3>
            </div>
          </div>
        </div>
      </section>

      {/* --- QUÉ OFRECE LA EMPRESA --- */}
      <section className="section" id="servicios">
        <div className="servicios-frame">
          <div className="servicios-header">
            <h2 className="section-title">¿Qué ofrece la empresa?</h2>
            <p className="section-subtitle">
              Soluciones digitales para el sector estético. Desarrollamos
              herramientas tecnológicas que modernizan la gestión, atraen
              clientes y optimizan tu negocio.
            </p>
          </div>

          <div className="horizontal-slider-wrapper">
            <button className="slider-nav-btn left" onClick={scrollLeft}>
              <ChevronLeft size={30} />
            </button>

            <div className="horizontal-slider" ref={sliderRef}>
              <div className="horizontal-slide">
                <div className="feature-card">
                  <div className="feature-text">
                    <h2>Aumenta la visibilidad y atrae nuevos clientes</h2>
                    <p>
                      Moderniza tu presencia digital. Con nuestra plataforma, tu negocio estará visible para
                      cientos de usuarios que buscan servicios de belleza y estética profesional como el tuyo.
                    </p>
                    <button className="btn-main small">SABER MÁS</button>
                  </div>
                  <div className="feature-image-wrapper">
                    <img
                      src={mackubica}
                      alt="Mockup App Visibilidad"
                      className="feature-mockup"
                    />
                  </div>
                </div>
              </div>

              <div className="horizontal-slide">
                <div className="feature-card">
                  <div className="feature-text">
                    <h2>Simplifica tus reservas y optimiza la gestión</h2>
                    <p>
                      Olvídate de las llamadas perdidas y los mensajes sin responder.
                      Tus clientes pueden reservar citas las 24/7 desde cualquier
                      dispositivo de forma instantánea.
                    </p>
                    <button className="btn-main small">SABER MÁS</button>
                  </div>
                  <div className="feature-image-wrapper">
                    <img
                      src={mackreserva}
                      alt="Mockup App Reservas"
                      className="feature-mockup"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button className="slider-nav-btn right" onClick={scrollRight}>
              <ChevronRight size={30} />
            </button>
          </div>

          <div className="pagination-dots">
            <span className="dot active"></span>
            <span className="dot"></span>
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS Y ESTADÍSTICAS */}
      <section
        className="section"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <h2 className="section-title">¿Por qué elegirnos?</h2>
        <div className="grid-benefits" style={{ marginTop: "4rem" }}>
          <div className="benefit-card">
            <div className="benefit-icon-wrapper">
              <img src={Ia} alt="Innovación" className="iconobeni" />
              <span className="icon-dot"></span>
            </div>
            <h3>Innovación tecnológica</h3>
            <div className="benefit-line"></div>
            <p>
              Aplicamos herramientas modernas para mejorar la experiencia en
              salones de belleza y barberías.
            </p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon-wrapper">
              <img src={Calendario} alt="Optimización" className="iconobeni" />
              <span className="icon-dot"></span>
            </div>
            <h3>Optimización del servicio</h3>
            <div className="benefit-line"></div>
            <p>
              Ayudamos a los negocios a organizar mejor sus citas, personal y
              flujo de trabajo.
            </p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon-wrapper">
              <img src={ubicacion} alt="Conexión" className="iconobeni" />
              <span className="icon-dot"></span>
            </div>
            <h3>Conexión con clientes</h3>
            <div className="benefit-line"></div>
            <p>
              Facilitamos que los usuarios encuentren y reserven el servicio que
              necesitan en segundos.
            </p>
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">8</span>
            <span className="stat-label">Años de exp.</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">250+</span>
            <span className="stat-label">Clientes atendidos</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">600+</span>
            <span className="stat-label">Reservas gestionadas</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Salones afiliados</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">+1K</span>
            <span className="stat-label">Usuarios en la plataforma</span>
          </div>
        </div>
      </section>

      {/* NUESTRO EQUIPO */}
      <section className="section">
        <h2 className="section-title">Nuestro Equipo</h2>
        <div className="grid-4" style={{ marginTop: "4rem" }}>
          <div className="team-card">
            <h4>Alex Javier Apaza Nina</h4>
            <p>UI Designer & Co-founder</p>
          </div>
          <div className="team-card">
            <h4>Brayan Choquehuanca Mamani</h4>
            <p>UX Designer & Co-founder</p>
          </div>
          <div className="team-card">
            <h4>Alvin Ariel Cayo Quispe</h4>
            <p>Developer</p>
          </div>
          <div className="team-card">
            <h4>Reyshel Brisneyda Ortiz Gambarte</h4>
            <p>Diseñador UI/UX</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;