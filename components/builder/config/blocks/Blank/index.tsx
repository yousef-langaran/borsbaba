import React from "react";
import styles from "./styles.module.css";
import {ComponentConfig} from "@measured/puck";
import {getClassNameFactory} from "@/utils/helper";

const getClassName = getClassNameFactory("Blank", styles);

export type BlankProps = {};

export const Blank: ComponentConfig<BlankProps> = {
  fields: {},
  defaultProps: {},
  render: () => {
    return <div className={getClassName()}></div>;
  },
};
