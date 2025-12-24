import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.scss';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (e) {
      console.error('Error al cerrar sesión');
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">aTelo</Link>

      <div className="links">
        {!user ? (
          <Link to="/login">Entrar</Link>
        ) : (
          <>
            <span className="user">{user.email}</span>
            <button onClick={handleLogout} className="logout">
              Salir
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
