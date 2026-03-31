import type { GameState, ResourceId } from '../engine/types';
import { RESOURCES, TIER_NAMES, TIER_COLORS } from '../data/resources';
import { computeRates } from '../engine/economy';

interface Props {
  state: GameState;
}

export default function ResourcePanel({ state }: Props) {
  const rates = computeRates(state);

  const tiers = [0, 1, 2, 3, 4, 5];

  return (
    <div className="panel resource-panel">
      <h2 className="panel-title">Darach's Knowledge</h2>
      {tiers.map(tier => {
        const tierResources = RESOURCES.filter(r => r.tier === tier && state.resources[r.id]?.visible);
        if (tierResources.length === 0) return null;
        return (
          <div key={tier} className="tier-group">
            <h3 className="tier-heading" style={{ color: TIER_COLORS[tier] }}>{TIER_NAMES[tier]}</h3>
            {tierResources.map(res => {
              const rs = state.resources[res.id];
              const rate = rates[res.id] ?? 0;
              const pct = rs.max > 0 ? (rs.amount / rs.max) * 100 : 0;
              return (
                <div key={res.id} className="resource-row">
                  <div className="resource-info">
                    <span className="resource-name">{res.name}</span>
                    <span className="resource-amount">
                      {Math.floor(rs.amount)}<span className="resource-max">/{rs.max}</span>
                    </span>
                    {rate !== 0 && (
                      <span className={`resource-rate ${rate > 0 ? 'rate-pos' : 'rate-neg'}`}>
                        {rate > 0 ? '+' : ''}{rate.toFixed(2)}/s
                      </span>
                    )}
                  </div>
                  <div className="resource-bar-bg">
                    <div
                      className="resource-bar-fill"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: TIER_COLORS[tier] + '66',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
