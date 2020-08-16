import fetchService, {
  wrapRequestRaw,
  makeRequest,
  REQUEST_METHOD,
  getMethod,
} from "../fetch.service";

const mockFetch = jest.fn().mockResolvedValue(new Response(`{"foo":"bar"}`));
window.fetch = mockFetch;

describe("Fetch Service", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("performs GET request", async () => {
    fetchService.setHeader("commonHeader", "val");
    await fetchService.get("http://test.com", {
      queryParams: { q1: "val1" },
      headers: new Headers({ h1: "hval1" }),
    });
    expect(mockFetch.mock.calls[0][0]).toMatchInlineSnapshot(
      `"http://test.com?q1=val1"`
    );
  });

  it.each`
    method      | verb
    ${`post`}   | ${`POST`}
    ${`put`}    | ${`PUT`}
    ${`patch`}  | ${`PATCH`}
    ${`delete`} | ${`DELETE`}
  `("performs $verb request", async ({ method, verb }) => {
    await getMethod(method)("http://test.com", {
      headers: new Headers({ token: "TOKEN" }),
      body: JSON.stringify({ text: "PONY" }),
    });
    expect(mockFetch.mock.calls[0][0]).toMatch("http://test.com");
    expect(mockFetch.mock.calls[0][1]).toMatchObject({
      method: verb,
      url: "http://test.com",
      body: '{"text":"PONY"}',
    });
  });

  it("Wrap Request", async () => {
    const result = await makeRequest(REQUEST_METHOD.GET, "http://test.com", {});
    expect(result.response).toEqual({ foo: "bar" });

    const errorResponse = new Response(new Blob(), {
      status: 500,
      statusText: "SuperSmashingGreat!",
    });
    mockFetch.mockRejectedValueOnce(errorResponse);
    const newResult = await makeRequest(
      REQUEST_METHOD.GET,
      "http://test.com",
      {}
    );

    expect(newResult.error.ok).toBeFalsy();
  });
});
