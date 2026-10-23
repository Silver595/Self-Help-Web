// The entry point. It loads environment variables, connects to the database, and then starts the server with app.listen(PORT). Separating app.js (configuration) from index.js (startup) makes testing and organization easier.
import { env } from './config/env.js'
import { app } from './app.js';
import dns from 'node:dns';
import connectDB from './db/index.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);

connectDB()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(` Server is running at port : ${env.PORT}`);
    });
  })
  .catch((err) => {
    console.log('MONGODB db connection failed!!!', err);
  });
