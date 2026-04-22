// frontend/src/components/FloatingDownload.tsx
import { Smartphone } from 'lucide-react'; // Ícono más moderno para app
import './FloatingDownload.css';

const FloatingDownload = () => {
  return (
    <div className="floating-download-container">
      <a 
        href="https://expo.dev/artifacts/eas/5x1fTrkTipGTqhorSTsfmr.apk" // En el futuro pondrás el link real a Play Store / App Store
        className="floating-download-btn" 
        aria-label="Descargar Aplicación Factoriz"
      >
        <Smartphone size={18} /> {/* Ícono más pequeño */}
        Descargar App
      </a>
    </div>
  );
};

export default FloatingDownload;