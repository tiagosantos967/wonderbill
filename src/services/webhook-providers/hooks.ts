import axios from "axios";

import { WebhookProviders } from ".";
import { Hook } from "../../utils/service";

export const callProviderEndpointHook: Hook<WebhookProviders> = async (context) => {
  try {
    const response = await axios.get(`http://localhost:3000/providers/${context.data.provider}`);
    console.log('providers call response is', response.data);
    return context;
  } catch(error) {
    console.log('error calling providers endpoint');
    throw 'error calling providers endpoint';
  }
}