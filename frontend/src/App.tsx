// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import NuestraApp from './pages/NuestraApp';
import Contacto from './pages/Contacto';
import Informacion from './pages/Informacion';
import FloatingNav from './components/FloatingNav';
import FloatingDownload from './components/FloatingDownload';

// IMPORTAMOS LAS NUEVAS PANTALLAS
import Login from './components/login'; 
import RegistroAura from './components/register';
import AdminDashboard from './components/AdminDashboard'; 

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
        
        {/* Ruta del Panel de Administración/Sistema */}
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
      <FloatingNav />
      <FloatingDownload />
    </Router>
  );
}

export default App;