import { Service } from './service';
import {
  amqpConsumerController,
  expressController
} from './controller';

import express from 'express';
import supertest from 'supertest';

const assertQueueMock = jest.fn();
const consumeMock = jest.fn();
const ackMock = jest.fn();
const nAckMock = jest.fn();

jest.mock('../connectors/amqp', () => ({
  amqpChannelPromise: Promise.resolve({
    assertQueue: (queue) => assertQueueMock(queue),
    consume: (queue, messageCb) => {
      consumeMock(queue, messageCb)
      messageCb({ content: { toString: () => (JSON.stringify({hello: 'world'}))}})
    },
    ack: (data) => ackMock(data),
    nack: (data) => nAckMock(data) 
  })
}))

const createSpy = jest.fn();
const createdSpy = jest.fn();

const mockService: Service<{}> = {
  name: 'mock-service',
  create: async (data) => {
    await createSpy(data)
    return data
  },
  created: async (data) => {
    createdSpy(data)
    return data
  }
}

const mockApp = express();
mockApp.use(express.json())
mockApp.use('/', expressController(mockService))

describe('controller-utils', () => {
  describe('expressController', () => {

    beforeEach(() => {
      createSpy.mockReset();
    })

    it('should map express requests to the service layer', async () => {
      const result = await supertest(mockApp)
        .post('/')
        .send({ hello: 'world' })
      await expect(result.body).toEqual({ hello: 'world' })
      await expect(createSpy).toHaveBeenCalledTimes(1)
      await expect(createSpy).toHaveBeenCalledWith({ hello: 'world' })
    })
  })

  describe('amqpConsumerController', () => {
    
    beforeEach(() => {
      createdSpy.mockReset();
      assertQueueMock.mockReset();
      consumeMock.mockReset();
      ackMock.mockReset();
      nAckMock.mockReset();
    })

    it('should map amqp requests to the service layer', async () => {
      await amqpConsumerController(mockService)

      expect(assertQueueMock).toHaveBeenCalledTimes(1);
      expect(assertQueueMock).toHaveBeenCalledWith('mock-service created');
      expect(consumeMock).toHaveBeenCalledTimes(1);
      expect(ackMock).toHaveBeenCalledTimes(1);
      expect(nAckMock).toHaveBeenCalledTimes(0);
      await expect(createdSpy).toHaveBeenCalledTimes(1)
      await expect(createdSpy).toHaveBeenCalledWith({ hello: 'world' })
    })
  })
})