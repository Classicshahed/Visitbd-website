import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleApiRequest } from './server/apiHandler.js';

function visitBdApiPlugin() {
  const middleware = (req, res, next) => {
    if (req.url && req.url.startsWith('/api')) {
      handleApiRequest(req, res);
    } else {
      next();
    }
  };
  return {
    name: 'visitbd-sqlite-api-plugin',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), visitBdApiPlugin()],
});
