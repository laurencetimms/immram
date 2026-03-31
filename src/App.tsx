import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, ResourceId, BuildingId } from './engine/types';
import { createInitialState, loadGame, saveGame, resetGame } from './engine/save';
import { gameTick, TICK_MS, BUILDING_COST_MULT } from './engine/tick';
import { ACTIONS } from './data/actions';
import { BUILDING_MAP } from './data/buildings';
import Header from './components/Header';
import ResourcePanel from './components/ResourcePanel';
import ActionPanel from './components/ActionPanel';
import BuildingPanel from './components/BuildingPanel';
import LogPanel from './components/LogPanel';
import TabBar from './components/TabBar';

function App() {
  const [state, setState] = useState<GameState>(() => loadGame() ?? createInitialState());
  const [tab, setTab] = useState('Actions');
  const stateRef = useRef(state);
  stateRef.current = state;

  // Game loop
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => gameTick(prev));
    }, TICK_MS);
    return () => clearInterval(interval);
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.body.className = state.theme === 'light' ? 'theme-light' : 'theme-dark';
  }, [state.theme]);

  const handleAction = useCallback((actionId: string, flavor: string | null) => {
    setState(prev => {
      const action = ACTIONS.find(a => a.id === actionId);
      if (!action) return prev;

      const newResources = { ...prev.resources };
      const newLog = [...prev.log];

      // Apply costs
      for (const [id, amt] of Object.entries(action.costs) as [ResourceId, number][]) {
        const r = newResources[id];
        if (!r) continue;
        newResources[id] = { ...r, amount: Math.max(0, r.amount - amt) };
      }

      // Apply gives
      for (const [id, amt] of Object.entries(action.gives) as [ResourceId, number][]) {
        const r = newResources[id];
        if (!r) continue;
        const newAmt = Math.min(r.max, r.amount + amt);
        newResources[id] = { ...r, amount: newAmt, unlocked: true };
      }

      // Add flavor log if any
      if (flavor) {
        newLog.push(flavor);
      }

      return { ...prev, resources: newResources, log: newLog.slice(-100) };
    });
  }, []);

  const handleBuild = useCallback((buildingId: string) => {
    setState(prev => {
      const building = BUILDING_MAP[buildingId as BuildingId];
      if (!building) return prev;

      const count = prev.buildings[buildingId as BuildingId];
      const mult = Math.pow(BUILDING_COST_MULT, count);
      const newResources = { ...prev.resources };
      const newBuildings = { ...prev.buildings };
      const newLog = [...prev.log];

      // Deduct cost
      for (const [id, base] of Object.entries(building.baseCost) as [ResourceId, number][]) {
        const cost = Math.ceil(base * mult);
        const r = newResources[id];
        if (!r || r.amount < cost) return prev; // can't afford
        newResources[id] = { ...r, amount: r.amount - cost };
      }

      newBuildings[buildingId as BuildingId] = count + 1;
      newLog.push(`Built: ${building.name}`);

      return { ...prev, resources: newResources, buildings: newBuildings, log: newLog.slice(-100) };
    });
  }, []);

  const handleSave = useCallback(() => {
    saveGame(stateRef.current);
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      setState(resetGame());
    }
  }, []);

  const handleToggleTheme = useCallback(() => {
    setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  }, []);

  return (
    <div className={`app ${state.theme}`}>
      <Header state={state} onSave={handleSave} onReset={handleReset} onToggleTheme={handleToggleTheme} />

      {/* Desktop layout */}
      <div className="desktop-layout">
        <ResourcePanel state={state} />
        <div className="center-column">
          <div className="tab-bar-desktop">
            <button className={`tab-btn ${tab === 'Actions' ? 'tab-active' : ''}`} onClick={() => setTab('Actions')}>Actions</button>
            <button className={`tab-btn ${tab === 'Land' ? 'tab-active' : ''}`} onClick={() => setTab('Land')}>Land</button>
          </div>
          {tab === 'Actions' ? (
            <ActionPanel state={state} onAction={handleAction} />
          ) : (
            <BuildingPanel state={state} onBuild={handleBuild} />
          )}
        </div>
        <LogPanel log={state.log} />
      </div>

      {/* Mobile layout */}
      <div className="mobile-layout">
        <TabBar tab={tab} onTab={setTab} />
        {tab === 'Actions' && <ActionPanel state={state} onAction={handleAction} />}
        {tab === 'Land' && <BuildingPanel state={state} onBuild={handleBuild} />}
        {tab === 'Resources' && <ResourcePanel state={state} />}
        {tab === 'Log' && <LogPanel log={state.log} />}
      </div>
    </div>
  );
}

export default App;
