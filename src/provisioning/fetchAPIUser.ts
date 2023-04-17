import { AxiosInstance, HttpStatusCode } from 'axios';
import type { TargetEnvironment } from '../types';

type FetchAPIUserOptions = {
  /** A uuid corresponding to the id of the user whose details we have to fetch */
  userId: string;

  /** The instance to fetch the user details */
  client: AxiosInstance;
};

type FetchAPIUserResult = {
  /** The environment which we are accessing. Its always sandbox when in the sandbox environment */
  targetEnvironment: TargetEnvironment;

  /** The host to redirect to after some actions that require redirection */
  providerCallbackHost: string;
};

/**
 * Fetches the details of the api user
 * @param {FetchAPIUserOptions} options properties to use when fetching an API user
 * @returns {Promise<FetchAPIUserResult>} an object containing the targetEnvironment and providerCallbackHost of the api user
 */
const fetchAPIUser = async ({
  userId,
  client,
}: FetchAPIUserOptions): Promise<FetchAPIUserResult> => {
  const res = await client.get<FetchAPIUserResult>(`/${userId}`);

  if (res.status === HttpStatusCode.Ok) {
    return res.data;
  }

  /** TODO: search and see whether there is a reasonable way to do error handling from the docus */
  throw new Error('Unknown error when fetching user');
};

export { fetchAPIUser };
