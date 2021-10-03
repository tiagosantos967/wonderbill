import { Service } from './service';
import { expressController } from './controller';

import express from 'express';
import supertest from 'supertest';

const createSpy = jest.fn();
const mockService: Service<{}> = {
  name: 'mock-service',
  create: async (data) => {
    await createSpy(data)
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
})