import type {FC} from 'react'
import React, {memo, useState} from 'react'
import {Group, NumberInput, Switch} from '@mantine/core';
import {FilterProps} from "@/app/components/filters/FilterProps";


const MIN_WORD_LENGTH = 0; // for consistency :)
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
        const newMaxLength = isRange ? maxLength : newMinLength;
        setMaxLength(newMaxLength);
        setFilter(makeLengthFilter(newMinLength, newMaxLength));
        setMinLength(newMinLength);
    }

    const handleChangedMaxLength = (newMaxLength: number) => {
        setFilter(makeLengthFilter(minLength, newMaxLength));
        setMaxLength(newMaxLength);
    }

    const handleRangeModeChanged = (newRangeMode: boolean) => {
        if (newRangeMode) {
            setIsRange(true);
            const maxLength = maxLengthInput !== "" ? parseInt(maxLengthInput) : MAX_WORD_LENGTH
            setMaxLength(maxLength);
            setFilter(makeLengthFilter(minLength, maxLength))
        } else {
            setIsRange(false);
            if (minLengthInput === "") {
                setMaxLength(MAX_WORD_LENGTH)
                setMinLength(MIN_WORD_LENGTH)
                setMaxLengthInput("");
            } else {
                setMaxLength(minLength)
                setMaxLengthInput(minLength.toString())
                setFilter(makeLengthFilter(minLength, minLength))
            }

        }
    }

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
                    disabled={!isRange}
                    description={"Maximum Length"}
                    value={maxLengthInput}
                    placeholder={maxLength.toString()}
                    min={1}
                    max={MAX_WORD_LENGTH}
                    onChange={handleValueChanged(handleChangedMaxLength, MAX_WORD_LENGTH, setMaxLengthInput)}/>
                <Switch checked={isRange}
                        label={"Use range"}
                        onChange={(event) => handleRangeModeChanged(event.currentTarget.checked)}
                        className={"filter-toggle-switch"}
                />
            </Group>
        </>
    )
})