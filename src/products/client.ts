import { AxiosInstance, AxiosRequestHeaders } from 'axios';

import {
  API_VERSION_PATH,
  BASE_URL,
  createClient,
  urlPathFrom,
} from '../client';
import { APIVersion, Product, TargetEnvironment } from '../types';
import { createOrRefreshAccessToken } from '../tokens/createOrRefreshAccessToken';

type CreateProductClientOptions = {
  subscriptionKey: string;
  targetEnvironment: TargetEnvironment;
  targetProduct: Product;
  apiKey: string;
  userId: string;
  apiVersion?: APIVersion;
};

type Client = `${Product}-${APIVersion}`;

const clientCache: Partial<Record<Client, AxiosInstance>> = {};

const createProductClient = ({
  subscriptionKey,
  targetEnvironment,
  apiVersion = 'v1',
  targetProduct,
  userId,
  apiKey,
}: CreateProductClientOptions): AxiosInstance => {
  const clientKey: Client = `${targetProduct}-${apiVersion}`;
  let client = clientCache[clientKey];

  if (client) return client;

  const baseURL =
    BASE_URL + urlPathFrom([targetProduct, API_VERSION_PATH[apiVersion]]);

  client = createClient({
    subscriptionKey,
    headerOverrides: {
      'X-Target-Environment': targetEnvironment,
    },
    baseURL,
  });

  // we don't want this to run at client creation time but at the time a request is made
  client.interceptors.request.use(async (request) => {
    const { accessToken } = await createOrRefreshAccessToken({
      subscriptionKey,
      targetEnvironment,
      targetProduct,
      apiKey,
      userId,
    });

    return {
      ...request,
      headers: {
        ...request.headers,
        Authorization: `Bearer ${accessToken}`,
      } as AxiosRequestHeaders,
    };
  });

  clientCache[clientKey] = client;
  return client;
};

export { createProductClient };
export type { CreateProductClientOptions };
