import express from 'express';
import { env } from './env';

import { services } from './services';
import { 
  amqpConsumerController,
  expressController
} from './utils/controller';

const app = express();
const port = 5000;

app.use(express.json());

app.use('/webhook-providers', expressController(services.webhookProvidersService))

app.listen(env.expressPort, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

amqpConsumerController(services.webhookProvidersService);