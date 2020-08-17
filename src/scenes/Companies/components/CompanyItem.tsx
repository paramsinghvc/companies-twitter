import React, { useCallback, useRef } from "react";
import { Grid, Cell, Box } from "@mollycule/lattice";
import { useHistory } from "react-router-dom";

import { ReactComponent as LinkSVG } from "assets/link.svg";
import { ReactComponent as TwitterSVG } from "assets/twitter.svg";
import Anchor from "shared/components/Anchor";
import TwitterLink from "shared/components/TwitterLink";
import { Company } from "shared/types";

const CompanyItem = React.forwardRef<any, { company: Company }>(
  ({ company: { name, url, twitter: twitterUrl } }, ref) => {
    const buttonsPanelRef1 = useRef<HTMLDivElement | null>(null);
    const buttonsPanelRef2 = useRef<HTMLDivElement | null>(null);

    let history = useHistory();

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        const isFirstButtonClicked =
          buttonsPanelRef1.current &&
          buttonsPanelRef1.current.contains(e.target as Element);
        const isSecondButtonClicked =
          buttonsPanelRef2.current &&
          buttonsPanelRef2.current.contains(e.target as Element);

        if (isFirstButtonClicked || isSecondButtonClicked) return;

        history.push(`/company/${name}`);
      },
      [history, name]
    );

    return (
      <Box
        p="40px"
        boxShadow="card"
        style={{ cursor: "pointer" }}
        onClick={handleClick}
        borderRadius="small"
        ref={ref}
      >
        <Grid cols={2} rowGap="20px">
          <Cell fontSize="12px" fontWeight="bold" color="text" x-span="2">
            {name.toUpperCase()}
          </Cell>
          <Cell
            fontSize="12px"
            x-span={{ xs: "2", lg: "1" }}
            ref={buttonsPanelRef1}
          >
            <Grid
              alignItems="center"
              columnGap="10px"
              flow="column"
              justifyContent="start"
            >
              <LinkSVG height="18px" />
              <Anchor url={url} title="Link" />
            </Grid>
          </Cell>
          <Cell
            fontSize="12px"
            x-span={{ xs: "2", lg: "1" }}
            x-offset={{ xs: "1", lg: "2" }}
            ref={buttonsPanelRef2}
          >
            {twitterUrl && (
              <Grid
                alignItems="center"
                columnGap="10px"
                flow="column"
                justifyContent="start"
              >
                <TwitterSVG height="20px" />
                <TwitterLink url={twitterUrl} />
              </Grid>
            )}
          </Cell>
        </Grid>
      </Box>
    );
  }
);

export default CompanyItem;
