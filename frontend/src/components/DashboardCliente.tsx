import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, CalendarCheck, MapPin, LogOut, Sparkles } from 'lucide-react';
import './DashboardCliente.css'; // Usaremos este nuevo archivo de estilos
import logoFactoriz from '../assets/logo.png'; // Asegúrate de tener la ruta correcta de tu logo

export default function DashboardCliente() {
  const navigate = useNavigate();
  
  // ESTADOS PARA DATOS Y CARGA
  const [firstName, setFirstName] = useState<string>('');
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);

  useEffect(() => {
    // 1. Validar que sea realmente un cliente
    const role = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    if (role !== 'usuario' || !userId) {
      navigate('/login');
      return; // Detenemos la ejecución si no es usuario
    }

    // 2. FETCH PARA OBTENER EL NOMBRE REAL DESDE LA BASE DE DATOS
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`https://aura-ukzs.onrender.com/api/users/profile/${userId}`);
        const data = await response.json();
        
        if (data.success) {
          setFirstName(data.first_name); // Guardamos el nombre real
        } else {
          setFirstName('Usuario'); // Backup por si falla
        }
      } catch (error) {
        setFirstName('Usuario');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="client-dashboard-layout">
      
      {/* --- 1. REUTILIZAMOS EL NAVBA R (DISEÑO UNIFICADO) --- */}
      <nav className="navbar user-navbar">
        <Link to="/" className="logo-container">
          <img src={logoFactoriz} alt="Logo Factoriz" className="logo-img" />
        </Link>
        <div className="nav-links">
          {/* El cliente en su panel no necesita ver Nosotros/App general, cambiamos los links */}
          <Link to="/panel-cliente" className="active">Mi Panel</Link>
          <Link to="#">Agendar Cita</Link>
          <Link to="#">IA Facial</Link>
          <Link to="#">Salones Cerca</Link>
        </div>
        <div className="nav-buttons">
          {loadingProfile ? (
            <span style={{ fontWeight: 600, marginRight: '10px' }}>Hola...</span>
          ) : (
            <div className="user-welcome">
              <span className="user-name-text">Hola, {firstName}</span>
              <div className="avatar-small gold">{firstName.charAt(0)}</div>
            </div>
          )}
          <button onClick={handleLogout} className="btn-logout-client">
            <LogOut size={16} /> Salir
          </button>
        </div>
      </nav>

      {/* --- 2. CONTENIDO PRINCIPAL (DISEÑO MÁS PROFESIONAL) --- */}
      <main className="main-content-client animate-fade-in">
        
        {/* HEADER DE BIENVENIDA */}
        <div className="content-welcome-frame">
          <div className="header-info-client">
            <Sparkles size={28} className=" gold" />
            <h2>Descubre tu mejor estilo</h2>
          </div>
          <p>Bienvenido a tu panel de AURA. Aquí tienes acceso a nuestras herramientas exclusivas para potenciar tu belleza e imagen personal.</p>
        </div>

        {/* GRID DE MÓDULOS (DISEÑO REFINADO) */}
        <div className="client-modules-grid">
          
          {/* Módulo IA */}
          <div className="module-card card-gold">
            <div className="card-top">
              <Camera size={32} className="card-icon gold" />
              <h3>Asistente de Estilo IA</h3>
            </div>
            <div className="card-line gold"></div>
            <p>Usa tu cámara para un análisis biométrico facial y recibe recomendaciones personalizadas de cortes, barba y estilos que se adaptan a tu rostro.</p>
            <button className="btn-main small gold">Iniciar Análisis</button>
          </div>

          {/* Módulo Reservas */}
          <div className="module-card">
            <div className="card-top">
              <CalendarCheck size={32} className="card-icon" />
              <h3>Agendar una Cita</h3>
            </div>
            <div className="card-line"></div>
            <p>Selecciona tu salón o barbería preferida, escoge un profesional y reserva tu turno en segundos. ¡Rápido y sin llamadas!</p>
            <button className="btn-main small">Hacer Reserva</button>
          </div>

          {/* Módulo Geolocalización */}
          <div className="module-card">
            <div className="card-top">
              <MapPin size={32} className="card-icon" />
              <h3>Salones Cercanos</h3>
            </div>
            <div className="card-line"></div>
            <p>Encuentra establecimientos en tu zona que ofrecen los servicios que necesitas. Visualiza precios, fotos y reseñas antes de decidir.</p>
            <button className="btn-main small">Ver Mapa</button>
          </div>

        </div>
      </main>
    </div>
  );
}