import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const mostrarAlerta = (titulo: string, mensaje: string) => {
    window.alert(`${titulo} - ${mensaje}`);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      mostrarAlerta('Aviso', 'Por favor ingresa tus datos completos');
      return;
    }

    const payload = { email, password };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    };

    try {
      const response = await fetch('https://aura-ukzs.onrender.com/api/auth/login', requestOptions);
      const data = await response.json();

      if (data.success) {
        // En web usamos localStorage en lugar de AsyncStorage
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userRole', data.user.role);
        
        // Redirigir al dashboard y reemplazar el historial para que no puedan volver con el botón "Atrás"
        navigate('/dashboard', { replace: true });
      } else {
        mostrarAlerta('Error', 'Los datos ingresados no son correctos');
      }
    } catch (error) {
      mostrarAlerta('Error', 'Revisa tu conexión a internet');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        <div className="login-header">
          <Sparkles size={40} className="icon-primary" />
          <h1 className="title">AURA</h1>
          <p className="subtitle">Gestor de Belleza y Estilo</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-container">
            <Mail size={20} className="input-icon" />
            <input
              type="email"
              className="input-field"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div className="input-container">
            <Lock size={20} className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              className="input-field"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Tu clave de seguridad"
              required
            />
            <button 
              type="button" 
              className="toggle-password-btn" 
              onClick={togglePasswordVisibility}
              aria-label="Alternar visibilidad de contraseña"
            >
              {showPassword ? <EyeOff size={20} className="input-icon" /> : <Eye size={20} className="input-icon" />}
            </button>
          </div>

          <div className="forgot-container">
            <span className="forgot-text" onClick={() => navigate('/recuperar-password')}>
              Recuperar mi acceso
            </span>
          </div>

          <button type="submit" className="button-submit">
            Ingresar al sistema
          </button>
        </form>

        <div className="login-footer">
          <span className="footer-text">¿Aún no tienes una cuenta registrada?</span>
          <span className="register-text" onClick={() => navigate('/registro')}>
            Regístrate aquí
          </span>
        </div>
        
      </div>
    </div>
  );
}