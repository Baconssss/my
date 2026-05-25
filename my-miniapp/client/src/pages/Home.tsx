import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import type { Category, Service } from '../types';

const tg = (window as any).Telegram.WebApp;

export function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catId, setCatId] = useState<number | undefined>();
  const [geo, setGeo] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    api.categories().then(setCategories);
    loadServices();
  }, []);

  const loadServices = async (params?: { lat?: number; lon?: number; categoryId?: number }) => {
    const data = await api.services(params);
    setServices(data);
  };

  const nearMe = () => {
    if (!navigator.geolocation) return alert('Геолокация недоступна');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setGeo({ lat: latitude, lon: longitude });
        loadServices({ lat: latitude, lon: longitude, categoryId: catId });
      },
      () => alert('Не удалось получить геолокацию')
    );
  };

  const filterCategory = (id?: number) => {
    setCatId(id);
    loadServices({ ...geo, categoryId: id });
  };

  const formatPrice = (p: number) => `${(p / 100).toFixed(0)} ₽`;

  return (
    <div>
      <div className="tags">
        <div className="tag" onClick={() => filterCategory(undefined)} style={{ cursor: 'pointer' }}>Все</div>
        {categories.map((c) => (
          <div key={c.id} className="tag" onClick={() => filterCategory(c.id)} style={{ cursor: 'pointer' }}>
            {c.icon} {c.name}
          </div>
        ))}
      </div>

      <button onClick={nearMe}>📍 Рядом со мной</button>

      <div style={{ marginTop: 16 }}>
        {services.length === 0 && <p>Нет услуг</p>}
        {services.map((s) => (
          <Link to={`/service/${s.id}`} key={s.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card">
              <h3>{s.title}</h3>
              <p>{s.worker_name} ⭐️ {s.rating}</p>
              <p className="price">{formatPrice(s.price)} • {s.duration} мин</p>
              {s.distance !== undefined && <small>{Math.round(s.distance * 10) / 10} км</small>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}