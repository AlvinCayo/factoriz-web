import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Clock, QrCode, LogOut } from 'lucide-react';
import './AdminDashboard.css';

export default function DashboardCentro() {
  const navigate = useNavigate();

  useEffect(() => {
    // Validar que sea realmente una empresa
    const role = localStorage.getItem('userRole');
    if (role !== 'centro') {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <main className="main-content" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>Panel de Gestión del Negocio</h2>
          <button onClick={handleLogout} className="btn-logout" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>

        <div className="kpi-grid">
          <div className="kpi-card" style={{ cursor: 'pointer' }}>
            <div className="kpi-icon pending"><CalendarCheck size={24} /></div>
            <div className="kpi-info">
              <h3>Citas del Día</h3>
              <p>Gestiona tus reservas</p>
            </div>
          </div>

          <div className="kpi-card" style={{ cursor: 'pointer' }}>
            <div className="kpi-icon gold"><Clock size={24} /></div>
            <div className="kpi-info">
              <h3>Horarios</h3>
              <p>Configura tu disponibilidad</p>
            </div>
          </div>

          <div className="kpi-card" style={{ cursor: 'pointer' }}>
            <div className="kpi-icon"><QrCode size={24} /></div>
            <div className="kpi-info">
              <h3>Escanear QR</h3>
              <p>Valida la llegada del cliente</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}