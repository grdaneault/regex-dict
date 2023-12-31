import type {FC} from 'react'
import React, {memo, useState} from 'react'
import {Group, NumberInput, Switch, TextInput} from '@mantine/core';
import {FilterProps} from "@/app/components/filters/FilterProps";
import {DEFAULT_FILTER} from "@/app/data/model";

export const RequiredLettersFilter: FC<FilterProps> = memo(function RequiredLettersFilter({setFilter}) {
    const [filteredLetters, setFilteredLetters] = useState("");
    const [minimumMatches, setMinimumMatches] = useState(1);
    const [charsetMode, setCharsetMode] = useState(false)

    const makeRequiredLettersFilterFunction = (letters: string, minimumMatches: number) => {
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

    const makeAllowedLettersFilterFunction = (letters: string) => {
        const regex = new RegExp(`^[${letters}]+$`);
        return (word: string) => {
            return regex.test(word);
        }
    }

    const makeFilterFunction = (charsetMode: boolean, letters: string, minimumMatches: number) => {
        // When there are no letters to filter, don't filter anything
        if (letters === "") {
            return DEFAULT_FILTER;
        }

        if (charsetMode) {
            return makeAllowedLettersFilterFunction(letters);
        } else {
            return makeRequiredLettersFilterFunction(letters, minimumMatches);
        }
    }

    const handleFilteredLettersChange = (newLetters: string) => {
        setFilteredLetters(sanitizeLetters(newLetters));
        if (newLetters === "") {
            setMinimumMatches(1);
            setFilter(DEFAULT_FILTER)
        } else {
            setFilter(makeFilterFunction(charsetMode, newLetters, minimumMatches));
        }
    }

    const sanitizeLetters = (newLetters: string) => {
        // TODO could check for dupes here too
        return newLetters.toLowerCase().replace(/[^a-z]/g, '');
    }

    const handleMinimumMatchesChange = (newMinimum: number) => {
        setMinimumMatches(newMinimum)
        setFilter(makeFilterFunction(charsetMode, filteredLetters, newMinimum))
    }

    const handleCharsetModeChange = (newCharsetMode: boolean) => {
        setCharsetMode(newCharsetMode)
        setFilter(makeFilterFunction(newCharsetMode, filteredLetters, minimumMatches))
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
                    disabled={charsetMode}
                    value={minimumMatches}
                    min={minMinimumMatches}
                    max={maxMinimumMatches}
                    onChange={(val) => handleMinimumMatchesChange(+val)}/>
                <Switch checked={charsetMode}
                        label={"Allow only these letters"}
                        onChange={(event) => handleCharsetModeChange(event.currentTarget.checked)}
                        className={"filter-toggle-switch"}
                />
            </Group>
        </>
    )
})