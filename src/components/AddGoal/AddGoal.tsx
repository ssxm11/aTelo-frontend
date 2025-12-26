import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './AddGoal.scss';

export default function AddGoal() {
  const navigate = useNavigate();

  const handleCreateGoal = async () => {
    const title = prompt('¿Cuál es tu nuevo objetivo?');

    if (!title || title.trim() === '') return;

    try {
      await api.post('/goals', { title });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creando la goal', error);
      alert('No se pudo crear el objetivo');
    }
  };

  return (
    <button className="add-goal" onClick={handleCreateGoal}>
      + Nuevo objetivo
    </button>
  );
}
