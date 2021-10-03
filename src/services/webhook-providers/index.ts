import { publishToQueueHook } from "../../utils/amqp";
import { existsValidator, oneOfValidator, service, validateDataFieldHook } from "../../utils/service";
import { callProviderEndpointHook } from "./hooks";

export interface WebhookProviders {
  provider: 'gas' | 'internet';
  callbackUrl: string;
}

export const webhookProvidersService = service<WebhookProviders>({
  name: 'webhook-providers',
  create: [
    validateDataFieldHook('provider', existsValidator, 'provider is a required field'),
    validateDataFieldHook('provider', oneOfValidator(['gas', 'internet']), 'provider can only be either \'gas\' or \'internet\''),
    validateDataFieldHook('callbackUrl', existsValidator, 'callbackUrl is a required field'),
    publishToQueueHook('created')
  ],
  created: [
    callProviderEndpointHook,
  ]
});
