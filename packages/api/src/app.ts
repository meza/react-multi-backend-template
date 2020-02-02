import express, { Express } from 'express';
import cors from 'cors';

export const getApp = () => {
  const app: Express = express();
  app.use(cors());
  app.get('/', (_, res) => {
    res.send('Hello World');
  });

  return app;

};
