import Navbar from '../Navbar/Navbar';
import './Layout.scss';



export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-content">
        {children}
      </main>
    </div>
  );
}
