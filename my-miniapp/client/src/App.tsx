import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ServiceDetail } from './pages/ServiceDetail';
import { WorkerCabinet } from './pages/WorkerCabinet';

const tg = (window as any).Telegram.WebApp;

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const initData = tg.initData;
      if (!initData) {
        alert('Откройте через Telegram');
        return;
      }
      try {
        const res = await fetch('http://localhost:4000/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData }),
        });
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          localStorage.setItem('role', data.user.role);
          setReady(true);
        }
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, []);

  if (!ready) return <div style={{ padding: 20 }}>Загрузка...</div>;

  const isWorker = localStorage.getItem('role') === 'WORKER';

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout isWorker={isWorker} />}>
          <Route path="/" element={<Home />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          {isWorker && <Route path="/cabinet" element={<WorkerCabinet />} />}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;