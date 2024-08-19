import Fastify from 'fastify';
import mysql from 'mysql2/promise';
import cors from '@fastify/cors';

const fastify = Fastify({ logger: true });

fastify.register(cors);

// MySQL connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'coords_db',
  password: ''
});

// Convert Decimal Degrees to DMS
function convertDDToDMS(dd) {
  const isNegative = dd < 0;
  dd = Math.abs(dd);
  const degrees = Math.floor(dd);
  const minutes = Math.floor((dd - degrees) * 60);
  const seconds = (dd - degrees - minutes / 60) * 3600;

  return {
    degrees: isNegative ? -degrees : degrees,
    minutes,
    seconds: seconds.toFixed(2)
  };
}

// Routes
fastify.post('/convert', async (request, reply) => {
  const { lat, lng } = request.body;
  const latDMS = convertDDToDMS(lat);
  const lngDMS = convertDDToDMS(lng);

  return {
    lat: latDMS,
    lng: lngDMS
  };
});

fastify.post('/save', async (request, reply) => {
  const { lat, lng, notes } = request.body;
  const connection = await pool.getConnection();

  try {
    await connection.query(
      'INSERT INTO coords_data (notes, lat, lng) VALUES (?, ?, ?)',
      [notes, lat, lng]
    );
    reply.send({ status: 'success' });
  } catch (err) {
    reply.send({ status: 'error', error: err.message });
  } finally {
    connection.release();
  }
});

fastify.listen({ port: 3001 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    // process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
