import React, { FC, AnchorHTMLAttributes, useMemo } from "react";
import Anchor from "./Anchor";
import { getHandleFromUrl } from "shared/services/twitter.service";

const TwitterLink: FC<
  { url: string } & AnchorHTMLAttributes<HTMLAnchorElement>
> = ({ url, ...attrs }) => {
  const handle = useMemo(() => `@${getHandleFromUrl(url)}`, [url]);

  return <Anchor url={url} title={handle} {...attrs} />;
};

export default TwitterLink;
