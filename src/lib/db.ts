import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Link } from '@/entities/Link';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Link],
  synchronize: true, // Auto-create tables in dev
  logging: false,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
});

let initialized = false;

export async function getDataSource() {
  if (!initialized) {
    await AppDataSource.initialize();
    initialized = true;
    console.log('✅ Database connected');
  }
  return AppDataSource;
}