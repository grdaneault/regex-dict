import type {FC} from 'react'
import React, {memo, useState} from 'react'
import {Button, Group, NumberInput} from '@mantine/core';
import {FilterProps} from "@/app/components/filters/FilterProps";
import {IconArrowsMaximize, IconArrowsMinimize} from "@tabler/icons-react";


const MAX_WORD_LENGTH = 23


export const LengthFilter: FC<FilterProps> = memo(function LengthInput({setFilter}) {
    const [isRange, setIsRange] = useState(false);
    const [minLength, setMinLength] = useState(1);
    const [maxLength, setMaxLength] = useState(MAX_WORD_LENGTH);

    const [minLengthInput, setMinLengthInput] = useState("");
    const [maxLengthInput, setMaxLengthInput] = useState("");

    const makeLengthFilter = (minLength: number, maxLength: number) => {
        return (val: string) => {
            return val.length >= minLength && val.length <= maxLength
        }
    }

    const handleValueChanged = (handler: (val: number) => void, defaultValue: number, valueSetter: (val: string) => void) => {
        return (val: string) => {
            valueSetter(val)
            if (val !== "") {
                const numericVal = parseInt(val)
                handler(numericVal)
            } else {
                handler(defaultValue)
            }
        }
    }


    const handleChangedMinLength = (newMinLength: number) => {
        newMinLength = newMinLength < 0 ? 0 : newMinLength;
        setFilter(makeLengthFilter(newMinLength, maxLength));
        setMinLength(newMinLength);
    }

    const handleChangedMaxLength = (newMaxLength: number) => {
        setFilter(makeLengthFilter(minLength, newMaxLength));
        setMaxLength(newMaxLength);
    }

    const handleChangedExactLength = (newLength: number) => {
        setFilter(makeLengthFilter(newLength, newLength));
        setMinLength(newLength);
        setMaxLength(newLength);
    }

    const disableRangeMode = () => {
        setIsRange(false);
        setMaxLength(minLength);
        setFilter(makeLengthFilter(minLength, minLength))
    }

    const enableRangeMode = () => {
        setIsRange(true);
        const maxLength = maxLengthInput !== "" ? parseInt(maxLengthInput) : MAX_WORD_LENGTH
        setMaxLength(maxLength);
        setFilter(makeLengthFilter(minLength, maxLength))
    }

    if (isRange) {
        return (
            <>
                <Group>
                    <NumberInput
                        description={"Mininum Length"}
                        value={minLengthInput}
                        placeholder={minLength.toString()}
                        min={1}
                        max={MAX_WORD_LENGTH}
                        onChange={handleValueChanged(handleChangedMinLength, 1, setMinLengthInput)}/>
                    <NumberInput
                        description={"Maximum Length"}
                        value={maxLengthInput}
                        placeholder={maxLength.toString()}
                        min={1}
                        max={MAX_WORD_LENGTH}
                        onChange={handleValueChanged(handleChangedMaxLength, MAX_WORD_LENGTH, setMaxLengthInput)}/>
                    <Button onClick={disableRangeMode}
                            leftSection={<IconArrowsMinimize/>}
                            className={"self-end"}>Hide Range</Button>
                </Group>
            </>
        )
    } else {
        return (
            <>
                <Group>
                    <NumberInput
                        description={"Length"}
                        value={minLengthInput}
                        placeholder={minLength.toString()}
                        min={1}
                        max={MAX_WORD_LENGTH}
                        onChange={handleValueChanged(handleChangedExactLength, 1, setMinLengthInput)}/>
                    <Button onClick={enableRangeMode}
                            leftSection={<IconArrowsMaximize/>}
                            className={"self-end"}
                    >Show Range</Button>
                </Group>
            </>
        )
    }
})