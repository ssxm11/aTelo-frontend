import { useEffect, useState } from 'react';
//import './FocusSpace.scss';

type ModeId = 'gentle' | 'short' | 'flow';

const FOCUS_MODES = [
  {
    id: 'gentle' as ModeId,
    label: 'Suave',
    duration: 10,
    description: 'Solo estar aquí. Avanza si quieres.'
  },
  {
    id: 'short' as ModeId,
    label: 'Corto',
    duration: 25,
    description: 'Un bloque pequeño y manejable.'
  },
  {
    id: 'flow' as ModeId,
    label: 'Fluir',
    duration: 45,
    description: 'Si hoy te sientes con espacio.'
  }
];

export default function FocusSpace() {
  const [mode, setMode] = useState<ModeId | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [active, setActive] = useState(false);

  // iniciar foco
  const start = (modeId: ModeId) => {
    const selected = FOCUS_MODES.find(m => m.id === modeId)!;
    setMode(modeId);
    setSecondsLeft(selected.duration * 60);
    setActive(true);
  };

  // timer
  useEffect(() => {
    if (!active || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [active, secondsLeft]);

  const finish = () => {
    setActive(false);
    setMode(null);
    setSecondsLeft(0);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  // --------------------

  if (!active && !mode) {
    return (
      <section className="focus-space">
        <h2>Espacio de foco</h2>
        <p>Elige cómo te gustaría avanzar ahora.</p>

        <div className="modes">
          {FOCUS_MODES.map(m => (
            <button key={m.id} onClick={() => start(m.id)}>
              <strong>{m.label}</strong>
              <span>{m.description}</span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (active) {
    return (
      <section className="focus-space active">
        <p>Solo estar aquí.</p>

        <div className="timer">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>

        <button onClick={finish}>Terminar</button>
      </section>
    );
  }

  return null;
}
