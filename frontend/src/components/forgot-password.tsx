import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Cambiado aquí
import { Key, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import './RecuperarPassword.css';

export default function RecuperarPassword() {
  const navigate = useNavigate(); // <-- Usamos useNavigate de React Router
  
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const mostrarAlerta = (titulo: string, mensaje: string) => {
    window.alert(`${titulo} - ${mensaje}`);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !phone || !newPassword) {
      mostrarAlerta('Aviso', 'Completa todos los campos');
      return;
    }

    const payload = { email, phone, newPassword };
    
    try {
      const response = await fetch('https://aura-ukzs.onrender.com/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.success) {
        mostrarAlerta('Éxito', 'Contraseña actualizada de forma segura');
        navigate('/login', { replace: true }); // <-- Cambiado: router.replace a navigate con replace: true
      } else {
        mostrarAlerta('Error', 'Los datos no coinciden con nuestros registros');
      }
    } catch (error) {
      mostrarAlerta('Error', 'Fallo de comunicación con el servidor');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="recovery-container">
      <div className="recovery-card">
        
        <div className="recovery-header">
          <div className="icon-circle">
            <Key size={45} className="icon-primary" />
          </div>
          <h1 className="title">Recuperar Acceso</h1>
          <p className="subtitle">Verifica tu identidad en Aura para crear una nueva clave</p>
        </div>

        <form onSubmit={handleReset} className="recovery-form">
          
          <div className="input-container">
            <Mail size={20} className="input-icon" />
            <input 
              type="email" 
              className="input-field" 
              placeholder="Correo Electrónico" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <Phone size={20} className="input-icon" />
            <input 
              type="tel" 
              className="input-field" 
              placeholder="Teléfono Registrado" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <Lock size={20} className="input-icon" />
            <input 
              type={showPassword ? "text" : "password"} 
              className="input-field" 
              placeholder="Nueva Contraseña" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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

          <button type="submit" className="button-submit">
            ACTUALIZAR CLAVE
          </button>

          <button 
            type="button" 
            className="button-back" 
            onClick={() => navigate(-1)} // <-- Cambiado: router.back() equivale a navigate(-1)
          >
            Cancelar y Volver
          </button>
          
        </form>
      </div>
    </div>
  );
}