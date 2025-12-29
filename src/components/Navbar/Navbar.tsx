import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.scss';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      logout();
      navigate('/login');
    } catch (e) {
      console.error('Error al cerrar sesión');
    }
  };

  return (
    <nav className="navbar">
      <span
        className="logo"
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
      >
        aTelo
      </span>

      {!user ? (
        <>
          <Link to="/login" className="link">Entrar</Link>
          <Link to="/register" className="link">Registrarse</Link>
        </>
      ) : (
        <>
          <span className="user">{user.name}</span>
          <button onClick={handleLogout} className="logout">Salir</button>
        </>
      )}
    </nav>
  );
}
