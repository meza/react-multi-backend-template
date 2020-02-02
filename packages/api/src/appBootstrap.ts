/* eslint-disable no-console */
import { getApp } from './app';

export const start = () => {
  const port = Number(process.env.PORT || 3000);
  const app = getApp();

  try {
    app.on('connection', (socket) => {
      socket.setTimeout(0);
    });

    app.listen({
      port: port
    }, () => {
      console.log(`🚀 Server ready at http://localhost:${port}`);
    });
  } catch (e) {
    console.trace(e);
  }
};
