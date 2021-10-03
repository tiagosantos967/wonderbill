import amqp from 'amqplib/callback_api';

export const amqpChannelPromise: Promise<amqp.Channel> = new Promise((resolve, reject) => {
  amqp.connect('amqp://localhost', (err, connection) => {
    connection.createChannel((err, channel) => {
      resolve(channel)
    })
  })
});

