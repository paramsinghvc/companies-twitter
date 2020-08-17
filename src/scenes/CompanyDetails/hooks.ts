import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import { makeRequest, REQUEST_METHOD } from "shared/services/fetch.service";
import {
  fetchUserOrCompanyDetails,
  getHandleFromUrl,
} from "shared/services/twitter.service";
import { Company } from "shared/types";

export function useCompanyDetails() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [companyData, setCompanyData] = useState<Company>();

  const history = useHistory();
  const { companyName } = useParams<{ companyName: string }>();

  const handleBackClick = () => {
    history.goBack();
  };

  async function fetchCompanyData(companyName: string) {
    const { response, error } = await makeRequest(
      `/api/company/${companyName}`,
      REQUEST_METHOD.GET,
      {}
    );
    setIsLoading(false);
    if (response) {
      setCompanyData(response as Company);
      await augmentDataFromTwitter(response);
    } else {
      setError(error);
    }
  }

  async function augmentDataFromTwitter(response: Company) {
    const handle = getHandleFromUrl(response.twitter ?? "");
    if (handle) {
      const {
        response: twitterResponse,
        error: twitterError,
      } = await fetchUserOrCompanyDetails(handle);
      if (twitterResponse) {
        setCompanyData({ ...response, twitterData: twitterResponse.data });
      } else {
        console.error(twitterError);
      }
    }
  }

  useEffect(() => {
    fetchCompanyData(companyName);
  }, [companyName]);

  return {
    isLoading,
    error,
    companyData,
    handleBackClick,
  };
}
