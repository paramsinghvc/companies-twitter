import Loki, { Collection } from "lokijs";
import { loadCSV } from "./csvLoader";
import { logger } from "../logger";

export const db = new Loki("companies-twitter");

export type Company = {
  name: string;
  url: string;
  twitter?: string;
};

export const companies = db.addCollection<Company>("companies");

export function loadDataIntoCollection<T extends object>(
  collection: Collection<T>,
  data: T[]
) {
  collection.insert(data);
}

export async function initDB() {
  const { data, error } = await loadCSV("public/companies.csv", {
    withHeaders: true,
  });
  if (data) {
    loadDataIntoCollection<Company>(companies, data.data as Company[]);
  } else {
    logger.error("Error loading the DB", error);
  }
}
