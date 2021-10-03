
export const env = {
  expressPort: 5000,
  rabbitMQServer: 'amqp://localhost',
  providersMockServer: 'http://localhost:3000/providers', 
}

export type ENV = typeof env;