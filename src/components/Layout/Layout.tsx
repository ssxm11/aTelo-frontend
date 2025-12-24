import { ReactNode } from 'react';
import Navbar from '../Navbar/Navbar';
import './Layout.scss';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Navbar />
      <main className="layout">
        {children}
      </main>
    </>
  );
}
