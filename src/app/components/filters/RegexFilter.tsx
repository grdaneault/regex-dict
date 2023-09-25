import type {FC} from 'react'
import React, {memo, useState} from 'react'
import { TextInput } from '@mantine/core';
import {FilterProps} from "@/app/components/filters/FilterProps";

export const RegexFilter: FC<FilterProps> = memo(function RegexInput({id, setFilter}) {
    const [regexStr, setRegexStr] = useState("");
    const [error, setError] = useState("");

    const handleRegexChange = (newRegex: string) => {
        setRegexStr(newRegex)
        try {
            const regex = new RegExp(newRegex);
            setFilter((val: string) => regex.test(val));
            setError("");
        } catch (ex) {
            const error = (ex as SyntaxError).message;
            setError(error)
        }
    }

    return (
        <>
            <TextInput
                description="Add a pattern to filter the word list"
                placeholder="RegEx"
                type="text"
                value={regexStr}
                onChange={(e) => handleRegexChange(e.target.value)}/>
            {error && <div>{error}</div>}
        </>
    )
})