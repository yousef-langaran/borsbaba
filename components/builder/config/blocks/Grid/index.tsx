import React from "react";
import styles from "./styles.module.css";
import {Section} from "../../components/Section";
import {getClassNameFactory} from "@/utils/helper";
import {ComponentConfig, DropZone} from "@measured/puck";

const getClassName = getClassNameFactory("Grid", styles);

export type GridProps = {
    numColumns: number;
    gap: number;
};

export const Grid: ComponentConfig<GridProps> = {
    fields: {
        numColumns: {
            type: "number",
            label: "Number of columns",
            min: 1,
            max: 12,
        },
        gap: {
            label: "Gap",
            type: "number",
            min: 0,
        },
    },
    defaultProps: {
        numColumns: 4,
        gap: 24,
    },
    render: ({gap, numColumns}) => {
        return (
            <Section>
                <DropZone
                    className={getClassName()}
                    zone="grid"
                    disallow={["Hero", "Stats"]}
                    style={{
                        display: "grid",
                        gap,
                        gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
                    }}
                ></DropZone>
            </Section>
        );
    },
};
