import { useEffect, useRef } from 'react';

interface Props {
  log: string[];
}

export default function LogPanel({ log }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  // Determine if a log entry looks like flavour text
  function isFlavor(entry: string): boolean {
    if (entry.startsWith('Spring') || entry.startsWith('Summer') ||
        entry.startsWith('Autumn') || entry.startsWith('Winter')) return false;
    if (entry.startsWith('You emerge') || entry.startsWith('You remember')) return false;
    if (entry.startsWith('Built:')) return false;
    if (entry.startsWith('The land begins') || entry.startsWith('You are not alone') ||
        entry.startsWith('Roots form') || entry.startsWith('The deep layer') ||
        entry.startsWith('The threshold')) return false;
    return true;
  }

  return (
    <div className="panel log-panel">
      <h2 className="panel-title">Log</h2>
      <div className="log-entries">
        {log.map((entry, i) => {
          const age = log.length - 1 - i;
          const flavor = isFlavor(entry);
          return (
            <div
              key={i}
              className={`log-entry ${age === 0 ? 'log-recent' : age < 5 ? 'log-mid' : 'log-old'} ${flavor ? 'log-flavor' : ''}`}
            >
              {entry}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
