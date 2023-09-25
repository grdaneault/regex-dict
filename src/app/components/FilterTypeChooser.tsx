import {DEFAULT_FILTER, FilterFunc, FilterType} from "@/app/data/model";
import React, {FC} from "react";
import {IS_PALINDROME} from "@/app/components/filters/PalindromeFilter";

export interface FilterTypeChooserProps {
    id: number
    setFilterType: (type: FilterType, defaultFilterFunc: FilterFunc) => void
}

export const FilterTypeChooser: FC<FilterTypeChooserProps> = function FilterTypeChooser({id, setFilterType}) {
    return (
        <>
            <button onClick={() => setFilterType(FilterType.RegularExpression, DEFAULT_FILTER)}>RegEx</button>
            <button onClick={() => setFilterType(FilterType.Length, DEFAULT_FILTER)}>Length</button>
            <button onClick={() => setFilterType(FilterType.Palindrome, IS_PALINDROME)}>Palindrome</button>
        </>
    )
}