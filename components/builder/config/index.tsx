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
import {Slider} from "@/components/builder/config/blocks/Slider";

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
      components: ["SliderImage","Image","Slider"],
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
    Image,
    Slider
  },
};

export const initialData: Record<string, UserData> = {
  "root": {
    "props": {
      "title": "My Page",
      "direction": "vertical",
      "wrap": "wrap"
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
          },
          {
            "imageLink": "",
            "alt": ""
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
    },
    {
      "type": "Space",
      "props": {
        "direction": "",
        "size": "24px",
        "id": "Space-37143aa4-b8af-430c-961e-310869bf72df"
      }
    },
    {
      "type": "Grid",
      "props": {
        "numColumns": 5,
        "gap": 24,
        "id": "Grid-caecaa11-f17b-42b6-a4cb-595c43c01d71",
        "wrap": "wrap"
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
    ],
    "Grid-caecaa11-f17b-42b6-a4cb-595c43c01d71:grid": [
      {
        "type": "Flex",
        "props": {
          "justifyContent": "start",
          "direction": "row",
          "gap": 24,
          "wrap": "wrap",
          "layout": {
            "spanCol": 1,
            "spanRow": 1,
            "padding": "0px",
            "grow": true
          },
          "id": "Flex-67d8d5f7-e5b8-4686-b397-5c454f5881c0"
        }
      },
      {
        "type": "Flex",
        "props": {
          "justifyContent": "start",
          "direction": "row",
          "gap": 24,
          "wrap": "wrap",
          "layout": {
            "spanCol": 1,
            "spanRow": 1,
            "padding": "0px",
            "grow": true
          },
          "id": "Flex-cb4ec9a5-6ddb-4493-a1a0-4fbff4bb4008"
        }
      },
      {
        "type": "Flex",
        "props": {
          "justifyContent": "start",
          "direction": "row",
          "gap": 24,
          "wrap": "wrap",
          "layout": {
            "spanCol": 1,
            "spanRow": 1,
            "padding": "0px",
            "grow": true
          },
          "id": "Flex-35e0f70b-5c47-42da-b390-7a7db3fc07bb"
        }
      },
      {
        "type": "Flex",
        "props": {
          "justifyContent": "start",
          "direction": "row",
          "gap": 24,
          "wrap": "wrap",
          "layout": {
            "spanCol": 1,
            "spanRow": 1,
            "padding": "0px",
            "grow": true
          },
          "id": "Flex-203a0b25-cc5c-4336-94ce-385cb757ec5f"
        }
      },
      {
        "type": "Flex",
        "props": {
          "justifyContent": "start",
          "direction": "row",
          "gap": 24,
          "wrap": "wrap",
          "layout": {
            "spanCol": 1,
            "spanRow": 1,
            "padding": "0px",
            "grow": true
          },
          "id": "Flex-582acf04-81de-4d8d-9ac5-742cbec2d0a9"
        }
      },
      {
        "type": "Flex",
        "props": {
          "justifyContent": "start",
          "direction": "row",
          "gap": 24,
          "wrap": "wrap",
          "layout": {
            "spanCol": 1,
            "spanRow": 1,
            "padding": "0px",
            "grow": true
          },
          "id": "Flex-ff8c30c6-4c75-494e-8416-4d1f5835d281"
        }
      },
      {
        "type": "Flex",
        "props": {
          "justifyContent": "start",
          "direction": "row",
          "gap": 24,
          "wrap": "wrap",
          "layout": {
            "spanCol": 1,
            "spanRow": 1,
            "padding": "0px",
            "grow": true
          },
          "id": "Flex-948b9584-0dae-4612-86bd-01a3ba7785d1"
        }
      },
      {
        "type": "Flex",
        "props": {
          "justifyContent": "start",
          "direction": "row",
          "gap": 24,
          "wrap": "wrap",
          "layout": {
            "spanCol": 1,
            "spanRow": 1,
            "padding": "0px",
            "grow": true
          },
          "id": "Flex-66b37220-4e03-4bf5-a04d-c3c473f626af"
        }
      },
      {
        "type": "Flex",
        "props": {
          "justifyContent": "start",
          "direction": "row",
          "gap": 24,
          "wrap": "wrap",
          "layout": {
            "spanCol": 1,
            "spanRow": 1,
            "padding": "0px",
            "grow": true
          },
          "id": "Flex-d2b570ff-e914-4a68-a684-5bd15fcfd474"
        }
      },
      {
        "type": "Flex",
        "props": {
          "justifyContent": "start",
          "direction": "row",
          "gap": 24,
          "wrap": "wrap",
          "layout": {
            "spanCol": 1,
            "spanRow": 1,
            "padding": "0px",
            "grow": true
          },
          "id": "Flex-16485ff8-cebe-4d15-aa7e-ee4f3793ac38"
        }
      }
    ],
    "Flex-67d8d5f7-e5b8-4686-b397-5c454f5881c0:flex": [
      {
        "type": "Image",
        "props": {
          "id": "Image-eb646803-c264-4ad9-b2b6-7cb5ff561490",
          "src": "https://dkstatics-public.digikala.com/digikala-mega-menu/25804b8cb794b9ff36002f37117c4d84764d0475_1733131384.png?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80",
          "layout": {
            "grow": "true"
          }
        }
      },
      {
        "type": "Text",
        "props": {
          "align": "center",
          "text": "موبایل",
          "size": "m",
          "color": "default",
          "layout": {
            "spanCol": 1,
            "spanRow": 1,
            "padding": "0px",
            "grow": "true"
          },
          "id": "Text-a8e1542c-2ff6-4e73-828f-e2eb09e7bbd3"
        }
      }
    ],
    "Flex-cb4ec9a5-6ddb-4493-a1a0-4fbff4bb4008:flex": [
      {
        "type": "Image",
        "props": {
          "id": "Image-7b031e95-3302-428a-8f43-78daa8d3f401",
          "src": "https://dkstatics-public.digikala.com/digikala-mega-menu/25804b8cb794b9ff36002f37117c4d84764d0475_1733131384.png?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80",
          "layout": {
            "grow": "true"
          }
        }
      },
      {
        "type": "Text",
        "props": {
          "align": "center",
          "text": "موبایل",
          "size": "m",
          "color": "default",
          "layout": {
            "spanCol": 1,
            "spanRow": 1,
            "padding": "0px",
            "grow": "true"
          },
          "id": "Text-6aaa9bde-69c1-4a50-98ce-cefd4dc4a19b"
        }
      }
    ],
    "Flex-35e0f70b-5c47-42da-b390-7a7db3fc07bb:flex": [
      {
        "type": "Image",
        "props": {
          "id": "Image-a24069f7-c90f-49db-b408-530c4d85cc04",
          "src": "https://dkstatics-public.digikala.com/digikala-mega-menu/25804b8cb794b9ff36002f37117c4d84764d0475_1733131384.png?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80",
          "layout": {
            "grow": "true"
          }
        }
      },
      {
        "type": "Text",
        "props": {
          "align": "center",
          "text": "موبایل",
          "size": "m",
          "color": "default",
          "layout": {
            "spanCol": 1,
            "spanRow": 1,
            "padding": "0px",
            "grow": "true"
          },
          "id": "Text-6fffe861-e857-4eb6-85f1-ca0085b788cd"
        }
      }
    ],
    "Flex-203a0b25-cc5c-4336-94ce-385cb757ec5f:flex": [
      {
        "type": "Image",
        "props": {
          "id": "Image-acd41bdb-b997-4a83-9248-829057004fff",
          "src": "https://dkstatics-public.digikala.com/digikala-mega-menu/25804b8cb794b9ff36002f37117c4d84764d0475_1733131384.png?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80",
          "layout": {
            "grow": "true"
          }
        }
      },
      {
        "type": "Text",
        "props": {
          "align": "center",
          "text": "موبایل",
          "size": "m",
          "color": "default",
          "layout": {
            "spanCol": 1,
            "spanRow": 1,
            "padding": "0px",
            "grow": "true"
          },
          "id": "Text-ffbd0562-fca8-4c39-89d4-cc25ab6c0d04"
        }
      }
    ],
    "Flex-582acf04-81de-4d8d-9ac5-742cbec2d0a9:flex": [
      {
        "type": "Image",
        "props": {
          "id": "Image-b392942a-16aa-4f17-af8e-65427f2236a0",
          "src": "https://dkstatics-public.digikala.com/digikala-mega-menu/25804b8cb794b9ff36002f37117c4d84764d0475_1733131384.png?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80",
          "layout": {
            "grow": "true"
          }
        }
      },
      {
        "type": "Text",
        "props": {
          "align": "center",
          "text": "موبایل",
          "size": "m",
          "color": "default",
          "layout": {
            "spanCol": 1,
            "spanRow": 1,
            "padding": "0px",
            "grow": "true"
          },
          "id": "Text-396b9915-200c-49d8-ba7a-ffd5cf428448"
        }
      }
    ],
    "Flex-ff8c30c6-4c75-494e-8416-4d1f5835d281:flex": [
      {
        "type": "Image",
        "props": {
          "id": "Image-89a79ec3-311a-4cd6-880a-527385e599f8",
          "src": "https://dkstatics-public.digikala.com/digikala-mega-menu/25804b8cb794b9ff36002f37117c4d84764d0475_1733131384.png?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80",
          "layout": {
            "grow": "true"
          }
        }
      },
      {
        "type": "Text",
        "props": {
          "align": "center",
          "text": "موبایل",
          "size": "m",
          "color": "default",
          "layout": {
            "spanCol": 1,
            "spanRow": 1,
            "padding": "0px",
            "grow": "true"
          },
          "id": "Text-786b5477-a18a-4138-9e1a-6667c32b90d5"
        }
      }
    ],
    "Flex-948b9584-0dae-4612-86bd-01a3ba7785d1:flex": [
      {
        "type": "Image",
        "props": {
          "id": "Image-18e19df3-94a4-44b8-bab7-1dc996af0286",
          "src": "https://dkstatics-public.digikala.com/digikala-mega-menu/25804b8cb794b9ff36002f37117c4d84764d0475_1733131384.png?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80",
          "layout": {
            "grow": "true"
          }
        }
      },
      {
        "type": "Text",
        "props": {
          "align": "center",
          "text": "موبایل",
          "size": "m",
          "color": "default",
          "layout": {
            "spanCol": 1,
            "spanRow": 1,
            "padding": "0px",
            "grow": "true"
          },
          "id": "Text-b3eade4d-b386-4627-a076-9f9155296e45"
        }
      }
    ],
    "Flex-66b37220-4e03-4bf5-a04d-c3c473f626af:flex": [
      {
        "type": "Image",
        "props": {
          "id": "Image-7991b753-5008-4175-b0c9-17f786c64aaf",
          "src": "https://dkstatics-public.digikala.com/digikala-mega-menu/25804b8cb794b9ff36002f37117c4d84764d0475_1733131384.png?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80",
          "layout": {
            "grow": "true"
          }
        }
      },
      {
        "type": "Text",
        "props": {
          "align": "center",
          "text": "موبایل",
          "size": "m",
          "color": "default",
          "layout": {
            "spanCol": 1,
            "spanRow": 1,
            "padding": "0px",
            "grow": "true"
          },
          "id": "Text-5d12c2c9-f938-4707-bb73-6f14e6b3029e"
        }
      }
    ],
    "Flex-d2b570ff-e914-4a68-a684-5bd15fcfd474:flex": [
      {
        "type": "Image",
        "props": {
          "id": "Image-8e1fb5a7-d768-4d97-ad85-4c41811851f7",
          "src": "https://dkstatics-public.digikala.com/digikala-mega-menu/25804b8cb794b9ff36002f37117c4d84764d0475_1733131384.png?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80",
          "layout": {
            "grow": "true"
          }
        }
      },
      {
        "type": "Text",
        "props": {
          "align": "center",
          "text": "موبایل",
          "size": "m",
          "color": "default",
          "layout": {
            "spanCol": 1,
            "spanRow": 1,
            "padding": "0px",
            "grow": "true"
          },
          "id": "Text-a06311a3-e90f-4b8f-bfbe-ebe5cde576e3"
        }
      }
    ],
    "Flex-16485ff8-cebe-4d15-aa7e-ee4f3793ac38:flex": [
      {
        "type": "Image",
        "props": {
          "id": "Image-5fd286b2-476f-4f88-a70d-f13fb30448f9",
          "src": "https://dkstatics-public.digikala.com/digikala-mega-menu/25804b8cb794b9ff36002f37117c4d84764d0475_1733131384.png?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80",
          "layout": {
            "grow": "true"
          }
        }
      },
      {
        "type": "Text",
        "props": {
          "align": "center",
          "text": "موبایل",
          "size": "m",
          "color": "default",
          "layout": {
            "spanCol": 1,
            "spanRow": 1,
            "padding": "0px",
            "grow": "true"
          },
          "id": "Text-7caf7d3e-db10-4dda-a15d-143a4a66524c"
        }
      }
    ]
  }
}

export default conf;
