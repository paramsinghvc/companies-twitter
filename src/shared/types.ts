import { TwitterData } from "./services/twitter.service";

export type Company = {
  name: string;
  url: string;
  twitter?: string;
  twitterData?: TwitterData;
};
