import { FetchService, makeRequest, REQUEST_METHOD } from "./fetch.service";
import { TWITTER_BEARER_TOKEN } from "shared/config";

const fetchServiceTwitterInstance = new FetchService();

fetchServiceTwitterInstance.setHeader(
  "Authorization",
  `Bearer ${TWITTER_BEARER_TOKEN}`
);

const FIELDS_LIST = [
  "created_at",
  "description",
  "entities",
  "id",
  "location",
  "name",
  "pinned_tweet_id",
  "profile_image_url",
  "protected",
  "public_metrics",
  "url",
  "username",
  "verified",
];

export type TwitterData = {
  protected: boolean;
  name: string;
  description: string;
  verified: boolean;
  profile_image_url: string;
  created_at: string;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
  location: string;
  username: string;
  url: string;
  id: string;
};

export function getHandleFromUrl(url: string) {
  return url.match(/[^/]+$/g)?.[0] ?? "";
}

export function getProfileUrl(url = "") {
  const [, firstPart = "", secondPart = ""] =
    url.match(/(\S+)_\S+(\.\S+)$/) ?? [];
  return firstPart + secondPart || url;
}

export async function fetchUserOrCompanyDetails(userName: string) {
  return await makeRequest(
    `/api/twitter/details/${userName}`,
    REQUEST_METHOD.GET,
    {
      queryParams: {
        "user.fields": FIELDS_LIST.join(","),
      },
    },
    fetchServiceTwitterInstance
  );
}
