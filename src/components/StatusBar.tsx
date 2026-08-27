export function StatusBar() {
  return (
    <div className="status-bar" aria-hidden>
      <span>9:41</span>
      <div className="status-bar-icons">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
          <rect x="0" y="3" width="3" height="9" rx="0.5" opacity="0.35" />
          <rect x="4.5" y="2" width="3" height="10" rx="0.5" opacity="0.55" />
          <rect x="9" y="0.5" width="3" height="11.5" rx="0.5" opacity="0.75" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
          <path d="M8 3.2c1.8 0 3.4.7 4.6 1.9l1.2-1.2A8.1 8.1 0 0 0 8 1 8.1 8.1 0 0 0 2.2 3.9l1.2 1.2A6.5 6.5 0 0 1 8 3.2Z" />
          <path d="M8 6.4c1 0 1.9.4 2.6 1.1l1.2-1.2A5.2 5.2 0 0 0 8 4.8 5.2 5.2 0 0 0 4.2 6.3l1.2 1.2A3.6 3.6 0 0 1 8 6.4Z" />
          <circle cx="8" cy="10.2" r="1.3" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="white" strokeOpacity="0.4" />
          <rect x="2" y="2" width="16" height="8" rx="1.5" fill="white" />
          <path d="M23 4v4a2 2 0 0 0 0-4Z" fill="white" fillOpacity="0.45" />
        </svg>
      </div>
    </div>
  );
}
