import { Hook } from "./service";
import { amqpChannelPromise } from "../connectors/amqp";

export const publishToQueueHook = <T>(type: 'created'): Hook<T> => async (context) => {
  const channel = await amqpChannelPromise;
  const queue = `${context.serviceName} ${type}`;

  channel.assertQueue(queue, {
    durable: true
  });

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(context.data)))
  
  return context;
}