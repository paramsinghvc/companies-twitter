import React, { FC, AnchorHTMLAttributes, useMemo } from "react";
import Anchor from "./Anchor";

function getHandleFromUrl(url: string) {
  return url.match(/[^\/]+$/g)?.[0] ?? "";
}

const TwitterLink: FC<
  { url: string } & AnchorHTMLAttributes<HTMLAnchorElement>
> = ({ url, ...attrs }) => {
  const handle = useMemo(() => `@${getHandleFromUrl(url)}`, [url]);

  return <Anchor url={url} title={handle} {...attrs} />;
};

export default TwitterLink;
