import {DEFAULT_FILTER, FilterFunc, FilterType} from "@/app/data/model";
import React, {FC} from "react";
import {IS_PALINDROME} from "@/app/components/filters/PalindromeFilter";
import {Button, Flex, MantineSize} from "@mantine/core";
import {IconArrowsLeftRight, IconRegex, IconRuler3, IconSortAZ} from "@tabler/icons-react";

export interface FilterTypeChooserProps {
    id: number
    setFilterType: (type: FilterType, defaultFilterFunc: FilterFunc) => void
}

export const FilterTypeChooser: FC<FilterTypeChooserProps> = function FilterTypeChooser({setFilterType}) {

    const options = (size: MantineSize) => {
        return (
            <Flex gap={"xs"} wrap={"wrap"}>
                <Button
                    leftSection={<IconRegex/>}
                    size={size}
                    onClick={() => setFilterType(FilterType.RegularExpression, DEFAULT_FILTER)}>RegEx</Button>
                <Button
                    leftSection={<IconSortAZ/>}
                    size={size}
                    onClick={() => setFilterType(FilterType.RequiredLetters, DEFAULT_FILTER)}>Required Letters</Button>
                <Button
                    leftSection={<IconRuler3/>}
                    size={size}
                    onClick={() => setFilterType(FilterType.Length, DEFAULT_FILTER)}>Length</Button>
                <Button
                    leftSection={<IconArrowsLeftRight/>}
                    size={size}
                    onClick={() => setFilterType(FilterType.Palindrome, IS_PALINDROME)}>Palindrome</Button>
            </Flex>

        )
    }
    return (
        <>
            <div className={"less-than-sm"}>
                {options("xs")}
            </div>
            <div className={"sm-or-greater"}>
                {options("sm")}
            </div>
        </>
    )
}