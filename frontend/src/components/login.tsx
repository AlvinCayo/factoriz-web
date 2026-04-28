import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

    // --- ACCESO MAESTRO PARA EL ADMINISTRADOR ---
    if (email === 'admin@aura.com.bo' && password === 'admin123') {
      localStorage.setItem('userId', 'admin-root');
      localStorage.setItem('userRole', 'admin');
      navigate('/dashboard', { replace: true });
      return; // Detenemos la ejecución aquí para que no haga el fetch al backend
    }
    // --------------------------------------------

    setIsLoading(true);

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
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userRole', data.user.role);
        
        // REDIRECCIÓN DINÁMICA SEGÚN EL ROL (Base de datos)
        if (data.user.role === 'centro') {
          navigate('/panel-negocio', { replace: true });
        } else if (data.user.role === 'usuario') {
          navigate('/panel-cliente', { replace: true });
        } else if (data.user.role === 'admin' || data.user.role === 'administrador') {
          navigate('/dashboard', { replace: true }); 
        } else {
          navigate('/', { replace: true }); 
        }
      } else {
        mostrarAlerta('Error', data.message || 'Los datos ingresados no son correctos');
      }
    } catch (error) {
      mostrarAlerta('Error', 'Revisa tu conexión a internet');
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
            <button 
              type="button" 
              className="toggle-password-btn" 
              onClick={togglePasswordVisibility}
              aria-label="Alternar visibilidad de contraseña"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} className="input-icon" /> : <Eye size={20} className="input-icon" />}
            </button>
          </div>

          <div className="forgot-container">
            <span className="forgot-text" onClick={() => navigate('/recuperar-password')}>
              Recuperar mi acceso
            </span>
          </div>

          <button type="submit" className="button-submit" disabled={isLoading}>
            {isLoading ? 'Conectando...' : 'Ingresar al sistema'}
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