import React, { FC, useCallback } from "react";
import { Grid, Cell, Box } from "@mollycule/lattice";
import styled from "styled-components";
import { PerformAnime } from "@mollycule/react-anime";
import animejs from "animejs";

import { useCompanies } from "./hooks";
import Spinner from "shared/components/Spinner";
import CompanyItem from "./components/CompanyItem";
import { Company } from "shared/types";

const Heading = Box.withComponent("h2");
const Holder = styled(Box).attrs(() => ({
  textAlign: "center",
  pt: "20vh",
}))``;

const Input = styled(Box)`
  padding: 15px 20px;
  width: 100%;
  border: 2px solid ${({ theme }) => theme.colors.borderColor};
  outline: none;
`;

const LoadMoreBtn = styled(Cell).attrs(({ theme }) => ({
  border: "2px solid",
  borderRadius: "50%",
  borderColor: "primary",
  justifySelf: "center",
  height: "100px",
  width: "100px",
  lineHeight: "100px",
  textAlign: "center",
  fontSize: "12px",
  fontWeight: "bold",
  color: "primary",
}))`
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const Companies: FC = () => {
  const {
    isLoading,
    error,
    companiesData,
    fetchNextPageData,
    fetchCompaniesForQuery,
    fetchNextCompaniesForQuery,
    searchText,
    setSearchText,
  } = useCompanies();

  const handleSearchTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setSearchText(value);
      fetchCompaniesForQuery(value);
    },
    [setSearchText, fetchCompaniesForQuery]
  );

  return (
    <Grid mx="10vw">
      <Cell pt="5vh">
        <Heading textAlign="center">Companies List</Heading>
      </Cell>
      <Cell pt="5vh">
        <Input
          as="input"
          type="search"
          borderColor="borderColor"
          borderRadius="large"
          placeholder="Type to search"
          autoFocus
          value={searchText}
          onChange={handleSearchTextChange}
        />
      </Cell>
      <Cell pt="5vh" pb="5vh">
        {isLoading ? (
          <Holder>
            <Spinner />
          </Holder>
        ) : error ? (
          <Holder>Error occured</Holder>
        ) : companiesData.length > 0 ? (
          <Grid rowGap="70px">
            <Grid cols={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap="20px">
              <PerformAnime
                perform
                duration={100}
                onPerform={{
                  translateY: [50, 0],
                  opacity: [0, 1],
                  delay: animejs.stagger(60),
                  easing: "linear",
                }}
              >
                {companiesData.map((company: Company, idx: number) => (
                  <CompanyItem key={idx} company={company} />
                ))}
              </PerformAnime>
            </Grid>
            <LoadMoreBtn
              onClick={
                searchText
                  ? () => fetchNextCompaniesForQuery(searchText)
                  : fetchNextPageData
              }
            >
              LOAD MORE
            </LoadMoreBtn>
          </Grid>
        ) : (
          <Holder as="p" fontSize="24px" color="subText">
            No results found
          </Holder>
        )}
      </Cell>
    </Grid>
  );
};

export default Companies;
