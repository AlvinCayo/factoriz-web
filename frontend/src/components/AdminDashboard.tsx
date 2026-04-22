import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, FileSignature, Activity, LogOut, 
  Menu, X, ShieldCheck, CheckCircle, XCircle, FileText, Eye
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import './AdminDashboard.css';

// Constantes de color para los gráficos
const COLORS = ['#1a1a1a', '#d4af37', '#666666', '#007bff'];
const GENDER_COLORS = ['#4A90E2', '#E91E63', '#9E9E9E'];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [systemUsers, setSystemUsers] = useState<any[]>([]);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const mostrarAlerta = (titulo: string, mensaje: string) => {
    window.alert(`${titulo} - ${mensaje}`);
  };

  const confirmarAccion = (mensaje: string, onConfirm: () => void) => {
    if (window.confirm(mensaje)) {
      onConfirm();
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [resUsers, resLogs, resStats] = await Promise.all([
        fetch('https://aura-ukzs.onrender.com/api/admin/users'),
        fetch('https://aura-ukzs.onrender.com/api/admin/logs'),
        fetch('https://aura-ukzs.onrender.com/api/admin/stats')
      ]);

      const dataUsers = await resUsers.json();
      const dataLogs = await resLogs.json();
      const dataStats = await resStats.json();

      if (dataUsers.success) setSystemUsers(dataUsers.users);
      if (dataLogs.success) setSystemLogs(dataLogs.logs);
      if (dataStats.success) setStats(dataStats);
    } catch (error) {
      mostrarAlerta('Error', 'Fallo de red al cargar información');
    } finally {
      setLoading(false);
    }
  };

  // --- ACCIONES DE LA API ---
  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`https://aura-ukzs.onrender.com/api/admin/status/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      const data = await response.json();
      if (data.success) loadData();
    } catch (error) {
      mostrarAlerta('Error', 'No se pudo cambiar el estado');
    }
  };

  const approveBusinessAccount = async (userId: string) => {
    try {
      const response = await fetch(`https://aura-ukzs.onrender.com/api/admin/approve/${userId}`, { method: 'PUT' });
      const data = await response.json();
      if (data.success) {
        mostrarAlerta('Éxito', 'Centro aprobado correctamente');
        loadData();
        setSelectedUser(null);
      }
    } catch (error) {
      mostrarAlerta('Error', 'No se pudo aprobar la cuenta');
    }
  };

  const rejectBusinessAccount = async (userId: string) => {
    try {
      const response = await fetch(`https://aura-ukzs.onrender.com/api/admin/reject/${userId}`, { method: 'PUT' });
      const data = await response.json();
      if (data.success) {
        mostrarAlerta('Éxito', 'Solicitud rechazada');
        loadData();
        setSelectedUser(null);
      }
    } catch (error) {
      mostrarAlerta('Error', 'No se pudo rechazar la cuenta');
    }
  };

  const openLicensePdf = (url: string) => {
    if (!url) return mostrarAlerta('Error', 'Sin documento válido registrado');
    const secureUrl = url.replace('http://', 'https://');
    window.open(secureUrl, '_blank');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // --- FILTROS ---
  const pendingRequests = systemUsers.filter(u => u.role === 'centro' && !u.is_approved);

  // --- RENDERIZADORES DE VISTAS ---
  const renderOverview = () => (
    <div className="dashboard-content animate-fade-in">
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon"><Users size={24} /></div>
          <div className="kpi-info">
            <h3>Usuarios Totales</h3>
            <p>{systemUsers.length}</p>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon pending"><FileSignature size={24} /></div>
          <div className="kpi-info">
            <h3>Solicitudes Pendientes</h3>
            <p>{pendingRequests.length}</p>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon gold"><Activity size={24} /></div>
          <div className="kpi-info">
            <h3>Edad Promedio</h3>
            <p>{stats?.avgAge || 0} años</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Distribución de Roles</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={stats?.roles || []} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {(stats?.roles || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Presencia por Zonas (Negocios)</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats?.zones || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <RechartsTooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="count" fill="#d4af37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="dashboard-content animate-fade-in">
      <h2 className="page-title">Solicitudes de Negocios</h2>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Negocio / Representante</th>
              <th>Email</th>
              <th>Zona</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.length === 0 ? (
              <tr><td colSpan={5} className="empty-table">No hay solicitudes pendientes</td></tr>
            ) : (
              pendingRequests.map(user => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.first_name} {user.last_name}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.zone || 'No definida'}</td>
                  <td><span className="badge pending">Esperando Aprobación</span></td>
                  <td>
                    <button className="btn-icon view" onClick={() => setSelectedUser(user)} title="Revisar Solicitud">
                      <Eye size={18} /> Revisar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="dashboard-content animate-fade-in">
      <h2 className="page-title">Gestión de Usuarios</h2>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {systemUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-cell">
                    <div className="avatar-small">
                      {user.first_name ? user.first_name.charAt(0) : 'U'}
                    </div>
                    <div>
                      <div className="user-name">{user.first_name} {user.last_name}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                <td>{user.phone || '-'}</td>
                <td>
                  <span className={`badge ${user.is_active ? 'active' : 'suspended'}`}>
                    {user.is_active ? 'Activo' : 'Suspendido'}
                  </span>
                </td>
                <td>
                  <button 
                    className={`btn-toggle ${user.is_active ? 'suspend' : 'activate'}`}
                    onClick={() => confirmarAccion(`¿Deseas ${user.is_active ? 'suspender' : 'activar'} este usuario?`, () => toggleUserStatus(user.id, user.is_active))}
                  >
                    {user.is_active ? 'Suspender' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="dashboard-content animate-fade-in">
      <h2 className="page-title">Registro de Eventos (Logs)</h2>
      <div className="table-container">
        <table className="admin-table logs-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Acción Realizada</th>
              <th>Fecha/Hora (Ejemplo)</th>
            </tr>
          </thead>
          <tbody>
            {systemLogs.length === 0 ? (
              <tr><td colSpan={3} className="empty-table">No hay registros recientes</td></tr>
            ) : (
              systemLogs.map((log, idx) => (
                <tr key={idx}>
                  <td><strong>{log.email}</strong></td>
                  <td>{log.action}</td>
                  <td><span className="log-time">Hace un momento</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div><p>Cargando Panel...</p></div>;
  }

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <ShieldCheck size={32} className="logo-icon" />
          <h2>AURA Admin</h2>
          <button className="mobile-close" onClick={() => setSidebarOpen(false)}><X size={24} /></button>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => { setActiveTab('overview'); setSelectedUser(null); setSidebarOpen(false); }}>
            <LayoutDashboard size={20} /> Métricas
          </button>
          <button className={`nav-item ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => { setActiveTab('requests'); setSelectedUser(null); setSidebarOpen(false); }}>
            <FileSignature size={20} /> Solicitudes
            {pendingRequests.length > 0 && <span className="nav-badge">{pendingRequests.length}</span>}
          </button>
          <button className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => { setActiveTab('users'); setSelectedUser(null); setSidebarOpen(false); }}>
            <Users size={20} /> Usuarios
          </button>
          <button className={`nav-item ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => { setActiveTab('logs'); setSelectedUser(null); setSidebarOpen(false); }}>
            <Activity size={20} /> Logs del Sistema
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout" onClick={handleLogout}>
            <LogOut size={20} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* OVERLAY MÓVIL */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="top-header">
          <button className="menu-trigger" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="header-user">
            <span>Administrador Root</span>
            <div className="avatar-small">A</div>
          </div>
        </header>

        {/* MODAL / VISTA DE DETALLES DE SOLICITUD */}
        {selectedUser && activeTab === 'requests' ? (
          <div className="dashboard-content animate-fade-in">
            <div className="detail-header-flex">
              <h2 className="page-title">Validación de Centro: {selectedUser.first_name}</h2>
              <button className="btn-secondary" onClick={() => setSelectedUser(null)}>Volver a la lista</button>
            </div>
            
            <div className="detail-card">
              <div className="detail-grid">
                <div className="detail-info">
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Teléfono:</strong> {selectedUser.phone}</p>
                  <p><strong>Zona:</strong> {selectedUser.zone || 'No definida'}</p>
                  <p><strong>Dirección:</strong> {selectedUser.street || '-'} #{selectedUser.building_number || '-'}</p>
                  <p><strong>Categoría:</strong> <span className="role-badge centro">{selectedUser.business_category || 'No definida'}</span></p>
                </div>
                
                <div className="detail-actions-box">
                  <h3>Documentación</h3>
                  <button className="btn-document" onClick={() => openLicensePdf(selectedUser.license_pdf_url)}>
                    <FileText size={20} /> Ver Licencia PDF
                  </button>
                  
                  <div className="decision-buttons">
                    <button className="btn-approve" onClick={() => confirmarAccion('¿Aprobar este centro?', () => approveBusinessAccount(selectedUser.id))}>
                      <CheckCircle size={20} /> Aprobar Centro
                    </button>
                    <button className="btn-reject" onClick={() => confirmarAccion('¿Rechazar solicitud?', () => rejectBusinessAccount(selectedUser.id))}>
                      <XCircle size={20} /> Rechazar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* RENDERIZADO DINÁMICO DE PESTAÑAS */
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'requests' && renderRequests()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'logs' && renderLogs()}
          </>
        )}
      </main>
    </div>
  );
}