import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Star, Download } from 'lucide-react';
import './DashboardCliente.css'; 
import logoFactoriz from '../assets/logo.png'; 
import mackreserva from '../assets/mackreserva.png'; 

export default function DashboardCliente() {
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState<string>('');
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);

  // Link oficial de descarga de tu aplicación
  const apkDownloadUrl = "https://expo.dev/artifacts/eas/5x1fTrkTipGTqhorSTsfmr.apk";

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    if (role !== 'usuario' || !userId) {
      navigate('/login');
      return; 
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`https://aura-ukzs.onrender.com/api/users/profile/${userId}`);
        const data = await response.json();
        
        if (data.success) {
          setFirstName(data.first_name); 
        } else {
          setFirstName('Usuario'); 
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
      
      {/* NAVBAR */}
      <nav className="navbar user-navbar">
        <Link to="/" className="logo-container">
          <img src={logoFactoriz} alt="Logo Factoriz" className="logo-img" />
        </Link>
        <div className="nav-links">
          <span className="active" style={{ cursor: 'default' }}>Mi Perfil Web</span>
        </div>
        <div className="nav-buttons">
          {loadingProfile ? (
            <span style={{ fontWeight: 600, marginRight: '10px' }}>Cargando...</span>
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

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content-client animate-fade-in app-promo-layout">
        
        <div className="promo-text-section">
          <div className="badge-gold">
            <Star size={16} fill="currentColor" /> Tu cuenta está configurada
          </div>
          
          <h1 className="promo-title">
            Lleva a <span className="text-gold">AURA</span> en tu bolsillo
          </h1>
          
          <p className="promo-description">
            ¡Hola {firstName}! Tu perfil web ya está activo. Para disfrutar de la experiencia completa, agendar citas en tus barberías favoritas y utilizar nuestro escáner de recomendación facial, descarga nuestra aplicación oficial.
          </p>

          <div className="download-actions">
            {/* BOTÓN REAL DE DESCARGA */}
            <a 
              href={apkDownloadUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="store-button google"
            >
              <Download size={24} />
              <div className="store-text">
                <span>Descargar para</span>
                <strong>Android (APK)</strong>
              </div>
            </a>
          </div>

          <div className="qr-section">
         <div className="qr-wrapper">
           {/* CÓDIGO QR GENERADO POR API (Infalible) */}
           <img 
             src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(apkDownloadUrl)}&color=1a1a1a&bgcolor=ffffff`}
             alt="Código QR para descargar AURA App"
             style={{ width: '90px', height: '90px', display: 'block' }} 
           />
         </div>
         <p>Escanea este código QR con la cámara de tu celular para descargar la aplicación al instante.</p>
       </div>
        </div>

        <div className="promo-image-section">
          <div className="promo-circle-bg"></div>
          <img src={mackreserva} alt="Aura App en el celular" className="promo-phone-mockup" />
        </div>

      </main>
    </div>
  );
}