interface Props {
  tab: string;
  onTab: (tab: string) => void;
}

export default function TabBar({ tab, onTab }: Props) {
  const tabs = ['Actions', 'Land', 'Resources', 'Log'];
  return (
    <div className="tab-bar">
      {tabs.map(t => (
        <button
          key={t}
          className={`tab-btn ${tab === t ? 'tab-active' : ''}`}
          onClick={() => onTab(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
