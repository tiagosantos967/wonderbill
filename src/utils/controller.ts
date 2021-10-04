import express, { Router } from 'express';
import { Service } from './service';
import { amqpChannelPromise } from '../connectors/amqp';
import { toExpressError } from './errors';

export const expressController = <T>(service: Service<T>): Router => {
  const router = express.Router();

  router.post('/', async (req, res) => {
    try {
      const result = await service.create(req.body);
      res.send(result)
    } catch( error ) {
      const expressError = toExpressError(error);
      res.statusCode = expressError.status;
      res.send(expressError);
    }
  });

  return router;
}

export const amqpConsumerController = async <T>(service: Service<T>) => {
  const channel = await amqpChannelPromise;
  const queue = `${service.name} created`;

  channel.assertQueue(queue, {
    durable: true
  });

  channel.consume(
    queue,
    async (msg) => {
      try {
        await service.created(JSON.parse(msg.content.toString()));
        channel.ack(msg);
      } catch(error) {
        channel.nack(msg);
      }
    },
    { noAck: false }
  );
}