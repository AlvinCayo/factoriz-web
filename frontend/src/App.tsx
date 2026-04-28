// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import NuestraApp from './pages/NuestraApp';
import Contacto from './pages/Contacto';
import Informacion from './pages/Informacion';
import FloatingNav from './components/FloatingNav';
import FloatingDownload from './components/FloatingDownload';

// IMPORTAMOS LAS PANTALLAS DE AUTENTICACIÓN
import Login from './components/login'; 
import RegistroAura from './components/register';
import RecuperarPassword from './components/forgot-password';

// IMPORTAMOS LOS PANELES PRIVADOS
import AdminDashboard from './components/AdminDashboard'; 
import DashboardCliente from './components/DashboardCliente';
import DashboardCentro from './components/DashboardCentro';

// --- COMPONENTE INTELIGENTE PARA MOSTRAR/OCULTAR BOTONES FLOTANTES ---
const FloatingElementsManager = () => {
  const location = useLocation();
  
  // Lista de rutas donde NO queremos que aparezcan los botones flotantes
  const rutasOcultas = [
    '/login', 
    '/registro', 
    '/recuperar-password', 
    '/dashboard', 
    '/panel-cliente', 
    '/panel-negocio'
  ];

  // Si la URL actual está en la lista de rutas ocultas, no mostramos nada (return null)
  if (rutasOcultas.includes(location.pathname)) {
    return null;
  }

  // Si es una ruta pública (como el Home, Nosotros, etc.), sí los mostramos
  return (
    <>
      <FloatingNav />
      <FloatingDownload />
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas Principales */}
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/servicios" element={<NuestraApp />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/informacion" element={<Informacion />} />
        
        {/* Rutas de Autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<RegistroAura />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
        
        {/* RUTAS DE LOS PANELES PRIVADOS */}
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/panel-cliente" element={<DashboardCliente />} />
        <Route path="/panel-negocio" element={<DashboardCentro />} />
      </Routes>
      
      {/* En lugar de poner los componentes flotantes fijos aquí, 
        llamamos a nuestro "gestor inteligente" para que decida si mostrarlos o no 
      */}
      <FloatingElementsManager />
      
    </Router>
  );
}

export default App;