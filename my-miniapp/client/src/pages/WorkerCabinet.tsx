import { useEffect, useState } from 'react';
import { api } from '../api';

export function WorkerCabinet() {
  const [profile, setProfile] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    api.workerMe().then(setProfile).catch(() => {
      // If no worker profile exists yet, we simply show creation form or prompt to create (simplified here)
    });
  }, []);

  const addService = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createService({
      title,
      price: Math.round(parseFloat(price) * 100),
      duration: parseInt(duration),
      photos: [],
    });
    const p = await api.workerMe();
    setProfile(p);
    setTitle(''); setPrice(''); setDuration('');
  };

  if (!profile) return <div style={{ padding: 20 }}>⏳ Загрузка кабинета...</div>;

  return (
    <div>
      <h2>👤 Кабинет мастера</h2>
      <p>Рейтинг: ⭐️ {profile.rating} | Заказов: {profile.totalOrders}</p>
      <p>{profile.description || 'Добавьте описание'}</p>

      <h3 style={{ marginTop: 24 }}>Мои услуги</h3>
      {profile.services.map((s: any) => (
        <div className="card" key={s.id}>
          <b>{s.title}</b> — {(s.price / 100).toFixed(0)} ₽
        </div>
      ))}

      <h3 style={{ marginTop: 24 }}>Добавить услугу</h3>
      <form onSubmit={addService}>
        <input placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input placeholder="Цена (руб)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input placeholder="Длительность (мин)" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />
        <button type="submit">Сохранить</button>
      </form>

      <h3 style={{ marginTop: 24 }}>Мои записи</h3>
      <button onClick={async () => {
        const bookings = await api.myBookings();
        alert('Заявок: ' + bookings.length);
      }}>Показать записи</button>
    </div>
  );
}