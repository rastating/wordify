module.exports = {
  env: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  port: process.env.PORT || 5500,
  host: process.env.HOST || '127.0.0.1'
};
