import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import { Service } from '../types';

const tg = (window as any).Telegram.WebApp;

export function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    // в MVP не делаем отдельный endpoint на один сервис, фильтруем из списка или добавляйте /services/:id на беке
    api.services().then((list: Service[]) => {
      setService(list.find((x) => x.id === Number(id)) || null);
    });
  }, [id]);

  const book = async () => {
    if (!service) return;
    // В MVP бронируем на завтра 12:00 для демонстрации
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0);

    await api.bookings({ serviceId: service.id, datetime: tomorrow.toISOString() });
    tg.showPopup({ title: 'Готово', message: 'Вы записаны! Ожидайте подтверждения мастера.' });
  };

  if (!service) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>{service.title}</h2>
      <p>Мастер: {service.worker_name} ⭐️ {service.rating}</p>
      <p>{service.description || 'Описание отсутствует'}</p>
      <p className="price">{(service.price / 100).toFixed(0)} ₽</p>

      <button onClick={() => tg.showScanQrPopup?.({ text: 'QR' })} style={{ background: 'var(--tg-theme-secondary-bg-color)', color: 'var(--tg-theme-text-color)' }}>
        📸 Примеры работ ({service.photos.length} фото)
      </button>

      <button onClick={book}>Записаться</button>
    </div>
  );
}