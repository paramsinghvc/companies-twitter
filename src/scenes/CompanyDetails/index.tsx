import React, { FC, useEffect } from "react";
import { Box, Grid, Cell } from "@mollycule/lattice";

import { ReactComponent as BackSVG } from "assets/back.svg";
import { ReactComponent as LinkSVG } from "assets/link.svg";
import { ReactComponent as TwitterSVG } from "assets/twitter.svg";
import Spinner from "shared/components/Spinner";
import Anchor from "shared/components/Anchor";
import TwitterLink from "shared/components/TwitterLink";
import { useCompanyDetails } from "./hooks";

const CompanyDetails: FC = () => {
  const {
    isLoading,
    error,
    companyData,
    handleBackClick,
  } = useCompanyDetails();

  return (
    <Grid cols={12} mx="10vw">
      <Cell pt="50px" justifySelf="start">
        <Box
          backgroundColor="#fafafa"
          p="20px"
          borderRadius="50%"
          role="button"
        >
          <BackSVG height="30px" onClick={handleBackClick} />
        </Box>
      </Cell>
      <Cell x-span="8" x-offset="3" y-offset="2" pt="20vh">
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
            <p>Error loading the details</p>
          ) : (
            companyData && (
              <Grid cols={12}>
                <Cell
                  x-span="5"
                  backgroundColor="primary"
                  color="white"
                  p="50px"
                ></Cell>
                <Cell x-span="7" p="50px">
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
                        )}{" "}
                      </Cell>
                    </Grid>
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
