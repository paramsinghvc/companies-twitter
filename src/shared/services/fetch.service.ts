export type QueryParams = {
  [k: string]: string | number | boolean | undefined;
};
export interface IRequestOptions {
  queryParams?: QueryParams;
  headers?: Headers;
  body?: any;
}

const fetchCall = (url: string, requestInfo: any) => {
  return fetch(url, requestInfo).then((response) => {
    /**
     * Reference: https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
     * To handle failure cases correctly with fetch api
     */
    if (!response.ok) {
      throw response;
    }
    return response;
  });
};

export class FetchService {
  /**
   * Default Headers Can be passed as a Object to Constructor
   */

  COMMON_HEADERS = new Headers();

  get getHeaders() {
    return this.COMMON_HEADERS;
  }

  /** Set common headers to be sent with each request */
  setHeader = (key: string, value: string) => {
    this.COMMON_HEADERS.set(key, value);
  };

  request = (
    requestInfo: IRequestOptions & { method: string; url: string },
    payload?: any
  ) => {
    const { headers } = requestInfo;
    // If headers were passed as a Map to the request, iterate and append it to actualHeaders
    const actualHeaders = new Headers();
    if (headers) {
      for (const [key, value] of Object.entries(headers)) {
        actualHeaders.append(key, value);
      }
    }
    // Append common headers to actualHeaders
    for (const [key, value] of this.getHeaders) {
      actualHeaders.append(key, value);
    }
    requestInfo.headers = actualHeaders;
    requestInfo.body = payload;
    return fetchCall(requestInfo.url, requestInfo);
  };

  /** Helper for making the query parameters from a ES6 Map */
  formQueryString = (queryParams?: QueryParams) => {
    if (queryParams) {
      const queryParamsArr: Array<string> = [];
      for (const [key, value] of Object.entries(queryParams)) {
        typeof value !== "undefined" && queryParamsArr.push(`${key}=${value}`);
      }
      return queryParamsArr.join("&");
    }
  };

  /** Facade methods over the general request method */
  get = (url: string, { queryParams, ...options }: IRequestOptions = {}) => {
    const queryString = this.formQueryString(queryParams);
    return this.request({
      method: "GET",
      url: queryString ? `${url}?${queryString}` : url,
      ...options,
    });
  };

  post = (url: string, options: IRequestOptions) => {
    return this.request(
      {
        method: "POST",
        url,
        ...options,
      },
      options.body
    );
  };

  put = (url: string, options: IRequestOptions) => {
    return this.request(
      {
        method: "PUT",
        url,
        ...options,
      },
      options.body
    );
  };

  patch = (url: string, options: IRequestOptions) => {
    return this.request(
      {
        method: "PATCH",
        url,
        ...options,
      },
      options.body
    );
  };

  delete = (url: string, { queryParams, ...options }: IRequestOptions) => {
    const queryString = this.formQueryString(queryParams);
    return this.request(
      {
        method: "DELETE",
        url: queryString ? `${url}?${queryString}` : url,
        ...options,
      },
      options.body
    );
  };
}

const fetchServiceInstance = new FetchService();

export enum REQUEST_METHOD {
  "GET" = "get",
  "POST" = "post",
  "PUT" = "put",
  "PATCH" = "patch",
  "DELETE" = "delete",
}

export const getMethod = (_fetchServiceInstance: FetchService) => (
  method: REQUEST_METHOD
) => {
  switch (method) {
    case REQUEST_METHOD.GET:
      return _fetchServiceInstance.get;
    case REQUEST_METHOD.POST:
      return _fetchServiceInstance.post;
    case REQUEST_METHOD.PUT:
      return _fetchServiceInstance.put;
    case REQUEST_METHOD.PATCH:
      return _fetchServiceInstance.patch;
    case REQUEST_METHOD.DELETE:
      return _fetchServiceInstance.delete;
  }
};

/**
 *
 * @param requestMethod
 * @param args
 * This for commonly parsed response.json() scenario
 */
export const makeRequest = (
  url: string,
  requestMethod: REQUEST_METHOD,
  options: IRequestOptions,
  _fetchServiceInstance?: FetchService
): Promise<{ response?: any; error?: any }> => {
  return getMethod(_fetchServiceInstance || fetchServiceInstance)(
    requestMethod
  )(url, options)
    .then((response: Response) => response.json())
    .then((response: Response) => ({ response }))
    .catch((error: any) => ({ error }));
};

/**
 *
 * @param requestMethod
 * @param args
 * Wrap fetch calls to obtain the response in a crude manner without parsing
 * it into any form using response.json() or response.text()
 * Note: It returns a Response object.
 */
export const wrapRequestRaw = (
  requestMethod: REQUEST_METHOD,
  url: string,
  options: IRequestOptions
): Promise<{ response?: Response; error?: Response }> => {
  return fetchServiceInstance[requestMethod](url, options)
    .then((response: Response) => ({ response }))
    .catch((error: any) => ({ error }));
};

export default fetchServiceInstance;
