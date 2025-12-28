import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

import './AddGoal.scss';

interface AddGoalProps {
  onGoalCreated: () => void;
}

export default function AddGoal({ onGoalCreated }: AddGoalProps) {
  const navigate = useNavigate();

  const handleCreateGoal = async () => {
    const title = prompt('¿Cuál es tu nuevo objetivo?');

    if (!title || title.trim() === '') return;
    const description = prompt('¿Cuál es la descripción del objetivo?');
    

    try {
      await api.post('/goals', { title, description });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creando la goal', error);
      alert('No se pudo crear el objetivo');
    }
  onGoalCreated();

  };

  return (
    
    <button className="add-goal" onClick={handleCreateGoal}>
      + Nuevo objetivo
    </button>
    
  );
}
