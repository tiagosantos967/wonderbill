import amqp from 'amqplib/callback_api';
import { env } from '../env';

export const amqpChannelPromise: Promise<amqp.Channel> = new Promise((resolve, reject) => {
  amqp.connect(env.rabbitMQServer, (err, connection) => {
    connection.createChannel((err, channel) => {
      resolve(channel)
    })
  })
});

