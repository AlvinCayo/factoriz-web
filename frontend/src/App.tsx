// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import Servicios from './pages/Servicios';
import Contacto from './pages/Contacto';
import Informacion from './pages/Informacion';
import FloatingNav from './components/FloatingNav';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/informacion" element={<Informacion />} /> {/* REGISTRA ESTA RUTA */}
      </Routes>
      <FloatingNav />
    </Router>
  );
}

export default App;