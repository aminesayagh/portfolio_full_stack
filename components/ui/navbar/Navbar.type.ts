import { VariantProps } from "class-variance-authority";
import React from "react";

import { containerStyle } from "@/components/ui/container";
import { LinkPropsExtended } from "@/components/ui/typography/Link";

export type NavbarProps = {
  children: React.ReactNode;
  className?: string;
  inTopOfScroll?: boolean;
} & VariantProps<typeof containerStyle>;

export type BrandProps = {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
};

export type ContentProps = {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
};

export type ItemProps = {
  children: (p: {
    isActive?: boolean;
    handlerActiveItem?: (item: string) => void;
  }) => React.ReactNode | React.ReactNode[];
  href: string;
};

export type LinkProps = {
  children:
    | ((
        active: boolean,
        handleItemClick: (item: string) => void
      ) => React.ReactNode | React.ReactNode[] | string)
    | React.ReactNode
    | React.ReactNode[]
    | string;
} & LinkPropsExtended;

export type NavbarType = React.FC<NavbarProps> & {
  Brand: React.FC<BrandProps>;
  Content: React.FC<ContentProps>;
  Item: React.FC<ItemProps>;
  Link: React.FC<LinkProps>;
};
