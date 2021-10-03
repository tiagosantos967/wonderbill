import {
  Hook,
  Service, 
  composePromises,
  service
} from './service';


type MockContract = {
  number: number;
}

const mockAdd: Hook<MockContract> = async (context) => ({
  ...context,
  data: { number: context.data.number + 1 }
})

describe('service-utils', () => {
  describe('composePromises', () => {
    it('should compose an array of promises', async () => {
      return expect(
        composePromises<MockContract>([ mockAdd, mockAdd ], { data: { number: 0}, serviceName: 'test-name' })
      ).resolves.toEqual({data: { number: 2 }, serviceName: 'test-name'})
    })

    it('should return context if no array is provided', async () => {
      return expect(
        composePromises<MockContract>([ ], { data: { number: 0 }, serviceName: 'test-name' })
      ).resolves.toEqual({data: { number: 0 }, serviceName: 'test-name'})
    })
  })

  describe('service', () => {
    const mockService: Service<MockContract> = service({
      name: 'mock-service',
      create: [mockAdd, mockAdd, mockAdd]
    })();

    it('should run a create method', async () => {
      return expect(mockService.create({ number: 0 })).resolves.toEqual({number: 3})
    })
  })
})