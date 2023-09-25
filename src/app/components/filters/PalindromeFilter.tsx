import type {FC} from 'react'
import React, {memo, useState} from 'react'
import {FilterProps} from "@/app/components/filters/FilterProps";


export const IS_PALINDROME = (val: string) => {
    for (let i = 0; i < val.length / 2; i++) {
        if (val.at(i) !== val.at(val.length - 1 - i)) {
            return false;
        }
    }

    return true;
}

export const PalindromeFilter: FC<FilterProps> = memo(function PalindromeFilter({id: number}) {

    return (
        <>
            <span>Palindrome</span>
        </>
    )
})