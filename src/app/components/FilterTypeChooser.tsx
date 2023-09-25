import {DEFAULT_FILTER, FilterFunc, FilterType} from "@/app/data/model";
import React, {FC} from "react";
import {IS_PALINDROME} from "@/app/components/filters/PalindromeFilter";
import {Button} from "@mantine/core";
import {IconArrowsLeftRight, IconRegex, IconRuler3} from "@tabler/icons-react";

export interface FilterTypeChooserProps {
    id: number
    setFilterType: (type: FilterType, defaultFilterFunc: FilterFunc) => void
}

export const FilterTypeChooser: FC<FilterTypeChooserProps> = function FilterTypeChooser({setFilterType}) {
    return (
        <Button.Group>
            <Button
                leftSection={<IconRegex/>}
                onClick={() => setFilterType(FilterType.RegularExpression, DEFAULT_FILTER)}>RegEx</Button>
            <Button
                leftSection={<IconRuler3/>}
                onClick={() => setFilterType(FilterType.Length, DEFAULT_FILTER)}>Length</Button>
            <Button
                leftSection={<IconArrowsLeftRight/>}
                onClick={() => setFilterType(FilterType.Palindrome, IS_PALINDROME)}>Palindrome</Button>
        </Button.Group>
    )
}