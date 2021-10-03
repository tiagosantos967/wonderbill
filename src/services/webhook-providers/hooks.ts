import axios from "axios";

import { WebhookProviders } from ".";
import { env } from "../../env";
import { Hook } from "../../utils/service";

export const callProviderEndpointHook: Hook<WebhookProviders> = async (context) => {
  try {
    const response = await axios.get(`${env.providersMockServer}/${context.data.provider}`);
    console.log('providers call response is', response.data);
    const result = await axios.post(context.data.callbackUrl, response.data);
    console.log('callback call response is', result.data);

    return context;
  } catch(error) {
    console.log('error calling providers endpoint', error);
    throw 'error calling providers endpoint';
  }
}