export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface Category {
  id: number;
  name: string;
  icon?: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: number;
  photos: string[];
  worker_name: string;
  rating: number;
  distance?: number;
}

export interface Booking {
  id: number;
  service: Service;
  worker: { firstName: string };
  datetime: string;
  status: string;
}