import React, { FC, useMemo } from "react";
import { Box, Grid, Cell } from "@mollycule/lattice";
import styled from "styled-components";

import { ReactComponent as BackSVG } from "assets/back.svg";
import { ReactComponent as LinkSVG } from "assets/link.svg";
import { ReactComponent as TwitterSVG } from "assets/twitter.svg";
import { ReactComponent as PinSVG } from "assets/pin.svg";
import Spinner from "shared/components/Spinner";
import Anchor from "shared/components/Anchor";
import TwitterLink from "shared/components/TwitterLink";
import { useCompanyDetails } from "./hooks";
import { getProfileUrl } from "shared/services/twitter.service";

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 60%;
`;

const KeyLabelMap: { [k: string]: string } = {
  followers_count: "FOLLOWERS",
  following_count: "FOLLOWING",
  tweet_count: "TWEETS",
  listed_count: "LISTED",
};

const CompanyDetails: FC = () => {
  const {
    isLoading,
    error,
    companyData,
    handleBackClick,
  } = useCompanyDetails();

  const twitterProfileImage = useMemo(
    () => getProfileUrl(companyData?.twitterData?.profile_image_url),
    [companyData]
  );

  return (
    <Grid cols={12} mx="10vw">
      <Cell pt="50px" justifySelf="start">
        <Box
          backgroundColor="bg"
          p="20px"
          borderRadius="50%"
          role="button"
          style={{ cursor: "pointer" }}
        >
          <BackSVG height="30px" onClick={handleBackClick} />
        </Box>
      </Cell>
      <Cell
        x-span={{ xs: "12", md: "8" }}
        x-offset={{ xs: "0", md: "3" }}
        y-offset="2"
        pt={{ xs: "5vh", md: "15vh" }}
        pb="20vh"
      >
        <Box boxShadow="card" borderRadius="large">
          {isLoading ? (
            <Box
              p="100px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Spinner />
            </Box>
          ) : error ? (
            <Box p="100px" fontSize="22px" color="subText">
              Error loading the details :(
            </Box>
          ) : (
            companyData && (
              <Grid cols={12}>
                <Cell
                  x-span={{ xs: "12", md: "5" }}
                  backgroundColor="#f9f4f4"
                  color="white"
                  p="50px"
                >
                  {companyData.twitterData && (
                    <Grid
                      alignItems="center"
                      justifyItems="center"
                      height="100%"
                    >
                      <ProfileImage src={twitterProfileImage} />
                    </Grid>
                  )}
                </Cell>
                <Cell x-span={{ xs: "12", md: "7" }} p="50px">
                  <Grid>
                    <Cell>{companyData.name.toUpperCase()}</Cell>
                    <Grid pt="30px" cols={2}>
                      <Cell>
                        <Grid
                          alignItems="center"
                          columnGap="10px"
                          flow="column"
                          justifyContent="start"
                        >
                          <LinkSVG height="18px" />
                          <Anchor url={companyData.url} title="Link" />
                        </Grid>
                      </Cell>
                      <Cell>
                        {companyData.twitter && (
                          <Grid
                            alignItems="center"
                            columnGap="10px"
                            flow="column"
                            justifyContent="start"
                          >
                            <TwitterSVG height="20px" />
                            <TwitterLink url={companyData.twitter} />
                          </Grid>
                        )}
                      </Cell>
                    </Grid>
                    {companyData.twitterData && (
                      <Cell>
                        <Grid
                          fontSize="13px"
                          rowGap="30px"
                          pt="40px"
                          cols={4}
                          justifyItems={{ xs: "center", md: "start" }}
                        >
                          <Cell x-span="4">
                            {companyData.twitterData.description}
                          </Cell>
                          <Cell x-span="4" pb={{ xs: "20px", md: "0" }}>
                            <Grid
                              columnGap="5px"
                              alignItems="center"
                              flow="column"
                              justifyContent="start"
                            >
                              <PinSVG width="20px" />
                              {companyData.twitterData.location || "N/A"}
                            </Grid>
                          </Cell>
                          {Object.entries(
                            companyData.twitterData.public_metrics
                          ).map(([key, value]) => (
                            <Cell
                              x-span={{ xs: "4", sm: "2", lg: "1" }}
                              textAlign="center"
                              key={key}
                            >
                              <Box fontWeight="bold">{value}</Box>
                              <Box
                                color="subText"
                                fontSize="10px"
                                pt="8px"
                                fontWeight="bold"
                              >
                                {KeyLabelMap[key]}
                              </Box>
                            </Cell>
                          ))}
                        </Grid>
                      </Cell>
                    )}
                  </Grid>
                </Cell>
              </Grid>
            )
          )}
        </Box>
      </Cell>
    </Grid>
  );
};

export default CompanyDetails;
