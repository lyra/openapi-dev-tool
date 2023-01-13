import request from 'supertest';
import { serve } from '../../src/commands/serve.js';

describe('serve.js file', function () {
  it('Get /assets', async () => {
    const app = await serve({
      config: {
        specs: [
          {
            file: `./tests/assets/specs.yaml`,
            context: { label: 'value' },
            enabled: true,
          },
        ],
      },
      contextPath: '/',
      staticFolders: [{ path: '/another-assets', folder: './tests/assets' }],
      port: 8080,
    });
    // API
    await request(app).get('/assets').expect(301);
    await request(app).get('/raw/bundle/petstore.yaml').expect(200);
    await request(app).get('/raw/original/petstore').expect(200);
    await request(app).get('/swagger-ui?urls.primaryName=petstore').expect(200);
    await request(app).get('/redoc?specName=petstore').expect(200);
    await request(app).get('/').expect(200);
    await request(app).get('/another-assets').expect(301);
  });
});
