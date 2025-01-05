import { Grid, GridProps } from "./blocks/Grid";
import { Hero, HeroProps } from "./blocks/Hero";
import { Flex, FlexProps } from "./blocks/Flex";
import { Logos, LogosProps } from "./blocks/Logos";
import { Stats, StatsProps } from "./blocks/Stats";
import { Text, TextProps } from "./blocks/Text";
import { Space, SpaceProps } from "./blocks/Space";
import { Button } from "./blocks/Button";

import Root, { RootProps } from "./root";
import {ButtonProps} from "@nextui-org/button";
import {Data, Config} from "@measured/puck";
import {SliderGalleryProps} from "@/components/core/gallary";
import {SliderImage} from "@/components/builder/config/blocks/SliderImage";
import {WithLayout} from "@/components/builder/config/components/Layout";
import {ImageProps} from "@nextui-org/react";
import {Image} from "@/components/builder/config/blocks/Image";

export type { RootProps } from "./root";

export type Props = {
  Button: WithLayout<ButtonProps>;
  Grid: GridProps;
  Hero: HeroProps;
  Flex: FlexProps;
  Logos: LogosProps;
  Stats: StatsProps;
  Text: TextProps;
  Space: SpaceProps;
  SliderImage: WithLayout<SliderGalleryProps>;
  Image: WithLayout<ImageProps>
};

export type UserConfig = Config<
  Props,
  RootProps,
  "layout" | "typography" | "interactive" | "image"
>;

export type UserData = Data<Props, RootProps>;

// We avoid the name config as next gets confused
export const conf: UserConfig = {
  root: {
    defaultProps: {
      title: "My Page",
    },
    render: Root,
  },
  categories: {
    layout: {
      components: ["Grid", "Flex", "Space"],
    },
    typography: {
      components: ["Text"],
    },
    interactive: {
      title: "Actions",
      components: ["Button"],
    },
    other: {
      title: "Other",
      components: ["Hero", "Logos", "Stats"],
    },
    image: {
      title: "image",
      components: ["SliderImage","Image"],
    },
  },
  components: {
    Button,
    Grid,
    Hero,
    Flex,
    Logos,
    Stats,
    Text,
    Space,
    SliderImage,
    Image
  },
};

export const initialData: Record<string, UserData> = {};

export default conf;
