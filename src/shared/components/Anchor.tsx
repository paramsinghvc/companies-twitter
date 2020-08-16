import React, { FC, AnchorHTMLAttributes } from "react";
import styled from "styled-components";

const A = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
`;

const Anchor: FC<
  { url: string; title?: string } & AnchorHTMLAttributes<HTMLAnchorElement>
> = ({ url, title, ...attrs }) => {
  return (
    <A href={url} target="_blank" {...attrs}>
      {title || url}
    </A>
  );
};

export default Anchor;
