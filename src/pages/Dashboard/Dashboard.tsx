import { useAuth } from '../../context/AuthContext';
import GoalsList from '../../components/GoalsList/GoalsList';
import AddGoal from '../../components/AddGoal/AddGoal';


import './Dashboard.scss';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <section className="dashboard">
      <header className="dashboard-header">
        <h1>Hola{user?.email ? `, ${user.name}` : ''}</h1>
        <p>Hoy puedes ir a tu ritmo.</p>
      </header>
        <AddGoal />
        <GoalsList />
    </section>
  );
}
