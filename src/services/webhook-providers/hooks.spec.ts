import { callProviderEndpointHook } from './hooks';

const axiosGetMock = jest.fn();

jest.mock('axios', () => ({
  get: async (url) => axiosGetMock(url)
}))

describe('webhook-providers hooks', () => {
  describe('callProviderEndpointHook', () => {

    beforeEach(() => {
      axiosGetMock.mockReset();
    })

    it('should not throw if it manages to call the providers endpoint', async () => {
      axiosGetMock.mockReturnValue({data: { hello: 'world'}})

      const result = callProviderEndpointHook({
        serviceName: 'test-service',
        data: {
          provider: 'gas',
          callbackUrl: 'mock-url'
        }
      });

      await expect(result).resolves.toEqual({data: {callbackUrl: 'mock-url', provider: 'gas'}, serviceName: 'test-service'});
      expect(axiosGetMock).toHaveBeenCalledTimes(1)
      expect(axiosGetMock).toHaveBeenLastCalledWith('http://localhost:3000/providers/gas')
    })
  })

  it('should throw if it does not manage to call the providers endpoint', async () => {
    axiosGetMock.mockReturnValue(Promise.reject())

    const result = callProviderEndpointHook({
      serviceName: 'test-service',
      data: {
        provider: 'internet',
        callbackUrl: 'mock-url'
      }
    });

    await expect(result).rejects.toEqual('error calling providers endpoint');
    expect(axiosGetMock).toHaveBeenLastCalledWith('http://localhost:3000/providers/internet')
  })
})
