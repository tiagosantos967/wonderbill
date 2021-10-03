import {
  Hook,
  Service, 
  composePromises,
  service,
  validateDataFieldHook,
  existsValidator,
  oneOfValidator,
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

  describe('validateDataFieldHook', () => {
    it('should throw if field value does not pass validation', async () => {
      return expect(
        validateDataFieldHook(
          'test',
          async () => Promise.reject(false),
          'error message')
        ({ data: { test: 'world'}, serviceName: ''})
      ).rejects.toEqual('error message')
    })

    it('should not throw if field value does pass validation', async () => {
      return expect(
        validateDataFieldHook(
          'test',
          async () => Promise.resolve(true),
          'error message')
        ({ data: { test: 'world'}, serviceName: ''})
      ).resolves.toEqual({data: {test: 'world'}, serviceName: ''})
    })
  })

  describe('existsValidator', () => {
    it('should throw if input is undefined', async () => {
      return expect(existsValidator(undefined)).rejects.toEqual(false)
    })

    it('should not throw if input is truthy', async () => {
      return expect(existsValidator('I exist')).resolves.toEqual(true)
    })
  })

  describe('oneOfValidator', () => {
    it('should throw if value is not oneOf', async () => {
      return expect(oneOfValidator(['a', 'b'])('c')).rejects.toEqual(false)
    })

    it('should not throw if value is oneOf', async () => {
      return expect(oneOfValidator(['a', 'b'])('a')).resolves.toEqual(true)
    })
  })
})