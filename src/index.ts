import express from 'express';

import { services } from './services';
import { expressController } from './utils/controller';

const app = express();
const port = 5000;

app.use(express.json());

app.use('/webhook-providers', expressController(services.webhookProvidersService))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})