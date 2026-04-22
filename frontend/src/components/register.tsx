import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Building, Mail, Lock, UserCircle, 
  Phone, Calendar, FileText, MapPin, Navigation, Home 
} from 'lucide-react';
import './RegistroAura.css';

type UserRole = 'usuario' | 'centro';

export default function RegistroAura() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [role, setRole] = useState<UserRole>('usuario');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  
  const [birthDate, setBirthDate] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  
  const [licenseUrl, setLicenseUrl] = useState<string>('');
  const [licenseName, setLicenseName] = useState<string>('');
  const [zone, setZone] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [buildingNumber, setBuildingNumber] = useState<string>('');
  const [businessCategory, setBusinessCategory] = useState<string>('');

  const mostrarAlerta = (titulo: string, mensaje: string) => {
    window.alert(`${titulo} - ${mensaje}`);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLicenseName(file.name);
      setLicenseUrl(URL.createObjectURL(file)); 
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !firstName || !lastName || !birthDate || !gender || !phone) {
      mostrarAlerta('Aviso', 'Completa los campos obligatorios');
      return;
    }

    setIsLoading(true);

    const isBusiness = role === 'centro';
    const endpoint = isBusiness 
      ? 'https://aura-ukzs.onrender.com/api/auth/register/business' 
      : 'https://aura-ukzs.onrender.com/api/auth/register/client';

    const basePayload = { email, password, birthDate, gender, phone };

    const clientPayload = {
      ...basePayload,
      firstName,
      lastName
    };

    const businessPayload = {
      ...basePayload,
      repName: firstName,
      repLastName: lastName,
      licenseUrl: licenseUrl || "sin_pdf_temporal", // Evita envíos nulos conflictivos
      zone,
      street,
      buildingNumber,
      businessCategory
    };

    const finalPayload = isBusiness ? businessPayload : clientPayload;

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalPayload)
    };

    try {
      const response = await fetch(endpoint, requestOptions);
      const data = await response.json();

      if (data.success) {
        mostrarAlerta('Éxito', 'Cuenta creada correctamente');
        navigate('/login', { replace: true });
      } else {
        mostrarAlerta('Error', data.error || 'No se pudo crear la cuenta');
      }
    } catch (error) {
      mostrarAlerta('Error', 'Fallo de comunicación con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        
        <div className="register-header">
          <h1 className="title">Crea tu Perfil</h1>
          <p className="subtitle">Únete a la comunidad de AURA</p>
        </div>

        <div className="role-container">
          <button 
            type="button"
            className={`role-button ${role === 'usuario' ? 'active' : ''}`} 
            onClick={() => setRole('usuario')}
            disabled={isLoading}
          >
            <User size={20} className="role-icon" />
            <span>Cliente</span>
          </button>
          
          <button 
            type="button"
            className={`role-button ${role === 'centro' ? 'active' : ''}`} 
            onClick={() => setRole('centro')}
            disabled={isLoading}
          >
            <Building size={20} className="role-icon" />
            <span>Negocio</span>
          </button>
        </div>

        <form onSubmit={handleRegister} className="register-form">
          <h3 className="section-label">Datos de Acceso</h3>
          
          <div className="input-container">
            <Mail size={20} className="input-icon" />
            <input 
              type="email" 
              className="input-field" 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              placeholder="Correo Electrónico"
              required
              disabled={isLoading}
            />
          </div>

          <div className="input-container">
            <Lock size={20} className="input-icon" />
            <input 
              type="password" 
              className="input-field" 
              onChange={(e) => setPassword(e.target.value)} 
              value={password} 
              placeholder="Contraseña segura"
              required
              disabled={isLoading}
            />
          </div>

          <h3 className="section-label">Información Personal</h3>

          <div className="input-row">
            <div className="input-container flex-1">
              <UserCircle size={20} className="input-icon" />
              <input 
                type="text" 
                className="input-field" 
                onChange={(e) => setFirstName(e.target.value)} 
                value={firstName} 
                placeholder="Tus Nombres"
                required
                disabled={isLoading}
              />
            </div>

            <div className="input-container flex-1">
              <UserCircle size={20} className="input-icon" />
              <input 
                type="text" 
                className="input-field" 
                onChange={(e) => setLastName(e.target.value)} 
                value={lastName} 
                placeholder="Tus Apellidos"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="input-container">
            <Phone size={20} className="input-icon" />
            <input 
              type="tel" 
              className="input-field" 
              onChange={(e) => setPhone(e.target.value)} 
              value={phone} 
              placeholder="Celular"
              required
              disabled={isLoading}
            />
          </div>

          <h4 className="sub-label">Fecha de Nacimiento</h4>
          <div className="input-container">
            <Calendar size={20} className="input-icon" />
            <input 
              type="date" 
              className="input-field" 
              onChange={(e) => setBirthDate(e.target.value)} 
              value={birthDate} 
              required
              disabled={isLoading}
            />
          </div>

          <h4 className="sub-label">Género</h4>
          <div className="selection-row">
            <button type="button" className={`selection-btn ${gender === 'masculino' ? 'active' : ''}`} onClick={() => setGender('masculino')} disabled={isLoading}>
              Masculino
            </button>
            <button type="button" className={`selection-btn ${gender === 'femenino' ? 'active' : ''}`} onClick={() => setGender('femenino')} disabled={isLoading}>
              Femenino
            </button>
            <button type="button" className={`selection-btn ${gender === 'otro' ? 'active' : ''}`} onClick={() => setGender('otro')} disabled={isLoading}>
              Otro
            </button>
          </div>

          {role === 'centro' && (
            <div className="business-section">
              <h3 className="section-label">Datos del Negocio</h3>
              
              <input 
                type="file" 
                accept="application/pdf"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                disabled={isLoading}
              />
              <button type="button" className="upload-button" onClick={handleFileClick} disabled={isLoading}>
                <FileText size={24} className="input-icon" />
                <span>{licenseName ? licenseName : 'Cargar PDF de Licencia'}</span>
              </button>

              <div className="input-container">
                <MapPin size={20} className="input-icon" />
                <input type="text" className="input-field" onChange={(e) => setZone(e.target.value)} value={zone} placeholder="Zona" required={role === 'centro'} disabled={isLoading} />
              </div>

              <div className="input-container">
                <Navigation size={20} className="input-icon" />
                <input type="text" className="input-field" onChange={(e) => setStreet(e.target.value)} value={street} placeholder="Calle o Avenida" required={role === 'centro'} disabled={isLoading} />
              </div>

              <div className="input-container">
                <Home size={20} className="input-icon" />
                <input type="text" className="input-field" onChange={(e) => setBuildingNumber(e.target.value)} value={buildingNumber} placeholder="Número de Local" required={role === 'centro'} disabled={isLoading} />
              </div>

              <h4 className="sub-label">Categoría</h4>
              <div className="selection-row">
                <button type="button" className={`selection-btn ${businessCategory === 'salon' ? 'active' : ''}`} onClick={() => setBusinessCategory('salon')} disabled={isLoading}>
                  Salón
                </button>
                <button type="button" className={`selection-btn ${businessCategory === 'barberia' ? 'active' : ''}`} onClick={() => setBusinessCategory('barberia')} disabled={isLoading}>
                  Barbería
                </button>
                <button type="button" className={`selection-btn ${businessCategory === 'unisex' ? 'active' : ''}`} onClick={() => setBusinessCategory('unisex')} disabled={isLoading}>
                  Unisex
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="button-submit" disabled={isLoading}>
            {isLoading ? 'PROCESANDO...' : 'CREAR CUENTA'}
          </button>

          <button type="button" className="button-secondary" onClick={() => navigate('/login')} disabled={isLoading}>
            Volver al inicio de sesión
          </button>
        </form>
      </div>
    </div>
  );
}