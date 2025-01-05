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

export const initialData: Record<string, UserData> = {
  "root": {
    "props": {
      "title": "My Page",
      "direction": "vertical"
    }
  },
  "content": [
    {
      "type": "SliderImage",
      "props": {
        "images": [
          {
            "imageLink": "https://dkstatics-public.digikala.com/digikala-adservice-banners/e91a6ca844348cd8ed283a7adbd7ca34329168e9_1736076104.jpg?x-oss-process=image/quality,q_95/format,webp",
            "alt": "1"
          },
          {
            "imageLink": "https://dkstatics-public.digikala.com/digikala-adservice-banners/839b468fcc1496e9bff235e1c54801144ba41ad3_1735979286.gif?x-oss-process=image?x-oss-process=image/format,webp",
            "alt": "2"
          }
        ],
        "id": "SliderImage-195ed364-715b-4d95-8049-6542db4fd395"
      }
    },
    {
      "type": "Space",
      "props": {
        "direction": "",
        "size": "24px",
        "id": "Space-96da554e-fcbe-447e-97ad-6652bc66be83"
      }
    },
    {
      "type": "Grid",
      "props": {
        "numColumns": 4,
        "gap": 24,
        "id": "Grid-50391a85-8d82-418c-9659-30b7b790ee3f"
      }
    }
  ],
  "zones": {
    "Grid-50391a85-8d82-418c-9659-30b7b790ee3f:grid": [
      {
        "type": "Image",
        "props": {
          "id": "Image-7a5ca218-34fb-4073-993a-30bb8de813aa",
          "alt": "1",
          "src": "https://dkstatics-public.digikala.com/digikala-adservice-banners/caf1317aeb16dcc620c9b89438a351b2ccb4df1e_1735998192.gif?x-oss-process=image?x-oss-process=image/format,webp"
        }
      },
      {
        "type": "Image",
        "props": {
          "id": "Image-6b01d2d9-7885-4f73-9f06-308728fd985f",
          "alt": "1",
          "src": "https://dkstatics-public.digikala.com/digikala-adservice-banners/caf1317aeb16dcc620c9b89438a351b2ccb4df1e_1735998192.gif?x-oss-process=image?x-oss-process=image/format,webp"
        }
      },
      {
        "type": "Image",
        "props": {
          "id": "Image-715f579d-285b-4d0e-a435-dfb83a799a73",
          "alt": "1",
          "src": "https://dkstatics-public.digikala.com/digikala-adservice-banners/caf1317aeb16dcc620c9b89438a351b2ccb4df1e_1735998192.gif?x-oss-process=image?x-oss-process=image/format,webp"
        }
      },
      {
        "type": "Image",
        "props": {
          "id": "Image-fb4a21eb-f699-4628-a9cb-a77f96e3a7b9",
          "alt": "1",
          "src": "https://dkstatics-public.digikala.com/digikala-adservice-banners/caf1317aeb16dcc620c9b89438a351b2ccb4df1e_1735998192.gif?x-oss-process=image?x-oss-process=image/format,webp"
        }
      }
    ]
  }
}

export default conf;
