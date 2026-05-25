import { Outlet, Link } from 'react-router-dom';

export function Layout({ isWorker }: { isWorker: boolean }) {
  return (
    <div>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 16, overflowX: 'auto' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--tg-theme-text-color)' }}>🔍 Поиск</Link>
        {isWorker && (
          <Link to="/cabinet" style={{ textDecoration: 'none', color: 'var(--tg-theme-text-color)' }}>👤 Кабинет</Link>
        )}
      </nav>
      <Outlet />
    </div>
  );
}