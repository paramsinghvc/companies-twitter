import { useEffect, useState } from "react";

import { makeRequest, REQUEST_METHOD } from "shared/services/fetch.service";
import { Company } from "shared/types";

export function useCompanies() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [companiesData, setCompaniesData] = useState<Company[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState("");

  async function fetchCompanies({
    pageNumber,
    reset,
    queryText,
  }: {
    pageNumber: number;
    reset?: boolean;
    queryText?: string;
  }) {
    const { response, error } = await makeRequest(
      "/api/companies",
      REQUEST_METHOD.GET,
      {
        queryParams: {
          page: pageNumber,
          q: queryText,
        },
      }
    );
    setIsLoading(false);
    if (response) {
      setCompaniesData(reset ? response : [...companiesData, ...response]);
    } else {
      setError(error);
    }
  }

  useEffect(() => {
    fetchCompanies({ pageNumber: 0 });
  }, []);

  function fetchNextPageData() {
    fetchCompanies({ pageNumber: currentPage + 1 });
    setCurrentPage(currentPage + 1);
  }

  function fetchCompaniesForQuery(queryText: string) {
    fetchCompanies({ pageNumber: 0, queryText, reset: true });
    setCurrentPage(0);
  }

  function fetchNextCompaniesForQuery(queryText: string) {
    fetchCompanies({ pageNumber: currentPage + 1, queryText });
    setCurrentPage(currentPage + 1);
  }

  return {
    isLoading,
    error,
    companiesData,
    fetchCompanies,
    fetchNextPageData,
    fetchCompaniesForQuery,
    fetchNextCompaniesForQuery,
    searchText,
    setSearchText,
  };
}
