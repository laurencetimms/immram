import type { GameState } from '../engine/types';
import { SEASONS } from '../data/seasons';
import { MOON_PHASES } from '../data/seasons';

interface Props {
  state: GameState;
  onSave: () => void;
  onReset: () => void;
  onToggleTheme: () => void;
}

export default function Header({ state, onSave, onReset, onToggleTheme }: Props) {
  const season = SEASONS[state.season];
  const moon = MOON_PHASES[state.moonPhase];
  const year = Math.floor((state.day - 1) / 200) + 1;
  const dayOfYear = ((state.day - 1) % 200) + 1;

  return (
    <header className="header">
      <div className="header-left">
        <span className="header-title">IMMRAM</span>
        <span className="header-char">Darach</span>
      </div>
      <div className="header-center">
        <span className="header-date">Year {year}, Day {dayOfYear}</span>
        <span className="header-season" style={{ color: season.color }}>
          {season.icon} {season.name}
        </span>
        <span className="header-moon">
          {moon.icon} {moon.name}
        </span>
      </div>
      <div className="header-right">
        <button className="btn-small" onClick={onSave}>Save</button>
        <button className="btn-small" onClick={onToggleTheme}>{state.theme === 'dark' ? 'Light' : 'Dark'}</button>
        <button className="btn-small btn-danger" onClick={onReset}>Reset</button>
      </div>
    </header>
  );
}
