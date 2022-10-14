import ip from 'ip';

const env = process.env.NODE_ENV || 'development';
const configuration = () => ({
  server: {
    env,
    port: parseInt(process.env.PORT, 10) || 10000,
    ip: ip?.address() as string,
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sen_api',
    projection: { _id: 0, __v: 0 },
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    ttl: env === 'development' ? 5 : 30,
  },
});

export type EnvironmentVariables = ReturnType<typeof configuration>;

export default configuration;
