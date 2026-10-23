// The entry point. It loads environment variables, connects to the database, and then starts the server with app.listen(PORT). Separating app.js (configuration) from index.js (startup) makes testing and organization easier.

import { app } from './app.js';
import dns from 'node:dns';
import dotenv from 'dotenv';
import connectDB from './db/index.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config({ path: './.env' });

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log('Data Base is Connected Successfully')
      console.log(` Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log('MONGODB db connection failed!!!', err);
  });
