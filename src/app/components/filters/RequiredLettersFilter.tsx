import type {FC} from 'react'
import React, {memo, useState} from 'react'
import {Group, NumberInput, TextInput} from '@mantine/core';
import {FilterProps} from "@/app/components/filters/FilterProps";

export const RequiredLettersFilter: FC<FilterProps> = memo(function RequiredLettersFilter({setFilter}) {
    const [filteredLetters, setFilteredLetters] = useState("");
    const [minimumMatches, setMinimumMatches] = useState(1);

    const makeFilterFunction = (letters: string, minimumMatches: number) => {
        const lettersSet = new Set<string>(letters.split(''));

        return (word: string) => {
            const seen = new Set<string>();
            for (let i = 0; i < word.length; i++) {
                const letter = word[i];
                if (lettersSet.has(letter)) {
                    seen.add(letter);
                }

                if (seen.size >= minimumMatches) {
                    return true;
                }
            }

            return false;
        }
    }

    const handleFilteredLettersChange = (newLetters: string) => {
        setFilteredLetters(newLetters.toLowerCase());
        if (newLetters === "") {
            setMinimumMatches(0);
            setFilter(makeFilterFunction(newLetters, 0));
        } else if (minimumMatches === 0) {
            setMinimumMatches(1);
            setFilter(makeFilterFunction(newLetters, 1));
        } else {
            setFilter(makeFilterFunction(newLetters, minimumMatches));
        }
    }

    const handleMinimumMatchesChange = (newMinimum: number) => {
        setMinimumMatches(newMinimum)
        setFilter(makeFilterFunction(filteredLetters, newMinimum));
    }

    const minMinimumMatches = filteredLetters === "" ? 0 : 1
    const maxMinimumMatches = filteredLetters === "" ? 0 : filteredLetters.length;

    return (
        <>
            <Group>
                <TextInput
                    description="Require specific letters in the word"
                    placeholder="Filtered Letters"
                    type="text"
                    value={filteredLetters}
                    onChange={(e) => handleFilteredLettersChange(e.target.value)}/>
                <NumberInput
                    description={"Minimum number of matches"}
                    value={minimumMatches}
                    min={minMinimumMatches}
                    max={maxMinimumMatches}
                    onChange={(val) => handleMinimumMatchesChange(+val)}/>
            </Group>
        </>
    )
})