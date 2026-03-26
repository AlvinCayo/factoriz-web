// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import NuestraApp from './pages/NuestraApp';
import Contacto from './pages/Contacto';
import Informacion from './pages/Informacion';
import FloatingNav from './components/FloatingNav';
import FloatingDownload from './components/FloatingDownload';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/servicios" element={<NuestraApp />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/informacion" element={<Informacion />} /> {/* REGISTRA ESTA RUTA */}
      </Routes>
      <FloatingNav />
      <FloatingDownload />
    </Router>
  );
}

export default App;