import { useCallback } from 'react';
import type { GameState, ResourceId, BuildingId } from '../engine/types';
import { BUILDINGS } from '../data/buildings';
import { RESOURCES } from '../data/resources';
import { getBuildingCost, canAffordBuilding } from '../engine/economy';

interface Props {
  state: GameState;
  onBuild: (buildingId: string) => void;
}

function getResourceName(id: ResourceId): string {
  return RESOURCES.find(r => r.id === id)?.name ?? id;
}

export default function BuildingPanel({ state, onBuild }: Props) {
  // Show buildings whose base cost resources are mostly visible
  const visibleBuildings = BUILDINGS.filter(b => {
    return Object.keys(b.baseCost).some(id => state.resources[id as ResourceId]?.visible);
  });

  const handleBuild = useCallback((buildingId: BuildingId) => {
    onBuild(buildingId);
  }, [onBuild]);

  return (
    <div className="panel building-panel">
      {visibleBuildings.map(building => {
        const count = state.buildings[building.id];
        const cost = getBuildingCost(state, building.id);
        const affordable = canAffordBuilding(state, building.id);

        return (
          <div key={building.id} className="building-card">
            <div className="building-info">
              <div className="building-name-row">
                <span className="building-name">{building.name}</span>
                {count > 0 && <span className="building-count">({count})</span>}
              </div>
              <p className="building-desc">{building.desc}</p>
              <div className="building-production">
                {Object.entries(building.production).map(([id, rate]) => (
                  <span key={id} className="building-rate">+{(rate as number).toFixed(2)}/s {getResourceName(id as ResourceId)}</span>
                ))}
              </div>
              <div className="building-cost">
                Cost:{' '}
                {Object.entries(cost).map(([id, amt]) => {
                  const have = state.resources[id as ResourceId]?.amount ?? 0;
                  const ok = have >= (amt as number);
                  return (
                    <span key={id} className={`cost-item ${ok ? 'cost-ok' : 'cost-bad'}`}>
                      {Math.ceil(amt as number)} {getResourceName(id as ResourceId)}
                    </span>
                  );
                })}
              </div>
            </div>
            <button
              className={`build-btn ${affordable ? 'build-btn-ok' : 'build-btn-disabled'}`}
              onClick={() => affordable && handleBuild(building.id)}
              disabled={!affordable}
            >
              Build
            </button>
          </div>
        );
      })}
    </div>
  );
}
