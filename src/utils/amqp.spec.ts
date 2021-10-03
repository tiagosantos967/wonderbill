import { publishToQueueHook } from './amqp';

const assertQueueMock = jest.fn();
const sendToQueueMock = jest.fn();

jest.mock('../connectors/amqp', () => ({
  amqpChannelPromise: Promise.resolve({
    assertQueue: (queue) => assertQueueMock(queue),
    sendToQueue: (queue, message) => sendToQueueMock(queue, message),
  })
}))

describe('amqp-utils', () => {
  describe('publishToQueueHook', () => {
    it('should publish the service name and context data', async () => {
      const result = await publishToQueueHook('created')({ data: { hello: 'world'}, serviceName: 'test-name'});
      
      expect(result).toEqual({ data: { hello: 'world' }, serviceName: 'test-name' })
      expect(assertQueueMock).toHaveBeenCalledTimes(1);
      expect(assertQueueMock).toHaveBeenCalledWith('test-name created');
      expect(sendToQueueMock).toHaveBeenCalledTimes(1);
      expect(sendToQueueMock).toHaveBeenCalledWith('test-name created', Buffer.from(JSON.stringify({ hello: 'world' })));
    })
  })
})