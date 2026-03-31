import { useCallback } from 'react';
import type { GameState, ResourceId } from '../engine/types';
import { ACTIONS } from '../data/actions';
import { RESOURCES } from '../data/resources';

interface Props {
  state: GameState;
  onAction: (actionId: string, flavor: string | null) => void;
}

function canAffordAction(state: GameState, costs: Partial<Record<ResourceId, number>>, reqs: Partial<Record<ResourceId, number>>): boolean {
  for (const [id, amt] of Object.entries(reqs) as [ResourceId, number][]) {
    if ((state.resources[id]?.amount ?? 0) < amt) return false;
  }
  for (const [id, amt] of Object.entries(costs) as [ResourceId, number][]) {
    if ((state.resources[id]?.amount ?? 0) < amt) return false;
  }
  return true;
}

function meetsReqs(state: GameState, reqs: Partial<Record<ResourceId, number>>): boolean {
  for (const [id, amt] of Object.entries(reqs) as [ResourceId, number][]) {
    if ((state.resources[id]?.amount ?? 0) < amt) return false;
  }
  return true;
}

function getResourceName(id: ResourceId): string {
  return RESOURCES.find(r => r.id === id)?.name ?? id;
}

export default function ActionPanel({ state, onAction }: Props) {
  const available = ACTIONS.filter(a => meetsReqs(state, a.reqs));
  const locked = ACTIONS.filter(a => !meetsReqs(state, a.reqs));

  // Only show locked actions where at least one req resource is visible to the player
  const nearlyUnlocked = locked.filter(a => {
    return Object.keys(a.reqs).some(id => state.resources[id as ResourceId]?.visible);
  });

  const handleClick = useCallback((action: typeof ACTIONS[0]) => {
    if (!canAffordAction(state, action.costs, action.reqs)) return;
    const flavor = Math.random() < 0.35 && action.flavors.length > 0
      ? action.flavors[Math.floor(Math.random() * action.flavors.length)]
      : null;
    onAction(action.id, flavor);
  }, [state, onAction]);

  return (
    <div className="panel action-panel">
      <div className="actions-available">
        {available.map(action => {
          const affordable = canAffordAction(state, action.costs, action.reqs);
          return (
            <button
              key={action.id}
              className={`action-btn ${affordable ? 'action-btn-available' : 'action-btn-disabled'}`}
              onClick={() => handleClick(action)}
              disabled={!affordable}
            >
              <span className="action-name">{action.name}</span>
              <span className="action-details">
                {Object.entries(action.gives).map(([id, amt]) => (
                  <span key={id} className="action-give">+{amt} {getResourceName(id as ResourceId)}</span>
                ))}
                {Object.entries(action.costs).map(([id, amt]) => {
                  const canAfford = (state.resources[id as ResourceId]?.amount ?? 0) >= (amt as number);
                  return (
                    <span key={id} className={`action-cost ${canAfford ? 'cost-ok' : 'cost-bad'}`}>
                      &minus;{amt as number} {getResourceName(id as ResourceId)}
                    </span>
                  );
                })}
              </span>
            </button>
          );
        })}
      </div>

      {nearlyUnlocked.length > 0 && (
        <div className="not-yet">
          <h3 className="not-yet-heading">Not yet&hellip;</h3>
          {nearlyUnlocked.map(action => (
            <div key={action.id} className="not-yet-item">
              <span className="not-yet-name">{action.name}</span>
              <div className="not-yet-reqs">
                {Object.entries(action.reqs).map(([id, needed]) => {
                  const have = state.resources[id as ResourceId]?.amount ?? 0;
                  const met = have >= (needed as number);
                  return (
                    <span key={id} className={`not-yet-req ${met ? 'req-met' : ''}`}>
                      {getResourceName(id as ResourceId)}: {Math.floor(have)}/{needed as number} {met ? '✓' : ''}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
