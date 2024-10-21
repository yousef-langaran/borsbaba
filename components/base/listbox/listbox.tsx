import * as React from "react";
import {Listbox,ListboxItem,ListboxSection,ListboxProps,ListboxItemProps,ListboxSectionProps} from "@nextui-org/listbox";

export const UListbox = ({children,...props}: ListboxProps) => (
    <Listbox
        {...props}>
        {children}
    </Listbox>
);
export const UListboxItem = (props: ListboxItemProps) => (
    <ListboxItem
        {...props}>

    </ListboxItem>
);
export const UListboxSection = ({children,...props}: ListboxSectionProps) => (
    <ListboxSection
        {...props}>
        {children}
    </ListboxSection>
);