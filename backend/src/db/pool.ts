import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'performance_tracker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const query = async (text: string, params?: any[]) => {
  const connection = await pool.getConnection();
  try {
    return await connection.execute(text, params);
  } finally {
    connection.release();
  }
};

export default pool;
