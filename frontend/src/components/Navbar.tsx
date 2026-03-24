// frontend/src/components/Navbar.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Iconos para el menú móvil

const Navbar = () => {
  // Estado para controlar el menú móvil
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header style={styles.header}>
      <div className="container" style={styles.navContainer}>
        {/* LOGO (Texto Factoriz Negro) */}
        <Link to="/" style={styles.logo}>
          Factoriz
        </Link>

        {/* MENÚ CENTRAL (Escritorio) */}
        <nav style={styles.menuEscritorio}>
          {['Inicio', 'Funcionalidades', 'Precios', 'Blog'].map(item => (
            <Link key={item} to="/" style={styles.menuLink}>
              {item}
            </Link>
          ))}
        </nav>

        {/* BOTONES DERECHA (Escritorio) */}
        <div style={styles.botonesEscritorio}>
          {/* Botón Outline Oscuro idéntico al diseño */}
          <button className="btn btn-outline-dark">Regístrate</button>
          {/* Botón Lleno Dorado idéntico al diseño */}
          <button className="btn btn-filled-primary">Ingresar</button>
        </div>

        {/* BOTÓN HAMBURGUESA (Móvil) */}
        <button style={styles.mobileMenuBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MENÚ DESPLEGABLE (Móvil) */}
      {isMenuOpen && (
        <div style={styles.mobileMenuDropdown}>
          {['Inicio', 'Funcionalidades', 'Precios', 'Blog'].map(item => (
            <Link key={item} to="/" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
              {item}
            </Link>
          ))}
          <div style={styles.mobileButtonsContainer}>
            <button className="btn btn-outline-dark" style={{ width: '100%' }}>Regístrate</button>
            <button className="btn btn-filled-primary" style={{ width: '100%' }}>Ingresar</button>
          </div>
        </div>
      )}
    </header>
  );
};

// Estilos específicos para este componente
const styles = {
  header: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: '15px 0',
    position: 'sticky' as const,
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 5px rgba(0,0,0,0.03)', // Sombra muy sutil para separar
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontFamily: 'var(--fuente-principal)',
    fontWeight: 700,
    fontSize: '28px',
    color: '#000000', // Negro del logo en la imagen
    textDecoration: 'none',
  },
  menuEscritorio: {
    display: 'flex',
    gap: '30px',
    // Ocultar en móviles
    '@media (max-width: 991px)': {
      display: 'none',
    },
  },
  menuLink: {
    fontFamily: 'var(--fuente-principal)',
    fontWeight: 500,
    fontSize: '0.95rem',
    color: 'var(--color-texto-oscuro)',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  },
  botonesEscritorio: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    // Ocultar en móviles
    '@media (max-width: 991px)': {
      display: 'none',
    },
  },
  mobileMenuBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-texto-oscuro)',
    cursor: 'pointer',
    display: 'none', // Oculto por defecto
    // Mostrar en móviles
    '@media (max-width: 991px)': {
      display: 'block',
    },
  },
  mobileMenuDropdown: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: '20px',
    boxShadow: '0 5px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
    // Ocultar en escritorio
    '@media (min-width: 992px)': {
      display: 'none',
    },
  },
  mobileLink: {
    fontFamily: 'var(--fuente-principal)',
    fontWeight: 500,
    fontSize: '1.1rem',
    color: 'var(--color-texto-oscuro)',
    textDecoration: 'none',
    padding: '10px 0',
    borderBottom: '1px solid #EEEEEE',
  },
  mobileButtonsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    marginTop: '10px',
  },
};

export default Navbar;