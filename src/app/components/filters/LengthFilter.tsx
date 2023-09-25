import type {FC} from 'react'
import React, {memo, useState} from 'react'
import {Group, NumberInput} from '@mantine/core';
import {FilterProps} from "@/app/components/filters/FilterProps";


const MAX_WORD_LENGTH = 23


export const LengthFilter: FC<FilterProps> = memo(function LengthInput({setFilter}) {
    const [minLength, setMinLength] = useState(0);
    const [maxLength, setMaxLength] = useState(MAX_WORD_LENGTH);

    const makeLengthFilter = (minLength: number, maxLength: number) => {
        return (val: string) => {
            return val.length >= minLength && val.length <= maxLength
        }
    }

    const handleChangedMinLength = (newMinLength: number) => {
        newMinLength = newMinLength < 0 ? 0 : newMinLength;
        const newMaxLength = newMinLength > maxLength ? newMinLength : maxLength;
        setFilter(makeLengthFilter(newMinLength, newMaxLength));
        setMaxLength(newMaxLength);
        setMinLength(newMinLength);
    }

    const handleChangedMaxLength = (newMaxLength: number) => {
        const newMinLength = newMaxLength < minLength ? newMaxLength : minLength;
        setFilter(makeLengthFilter(newMinLength, newMaxLength));
        setMaxLength(newMaxLength);
        setMinLength(newMinLength);
    }

    return (
        <>
            <Group>
                <NumberInput
                    description={"Mininum Length"}
                    value={minLength}
                    min={0}
                    max={MAX_WORD_LENGTH}
                    onChange={(val) => handleChangedMinLength(+val)}/>
                <NumberInput
                    description={"Maximum Length"}
                    value={maxLength}
                    min={0}
                    max={MAX_WORD_LENGTH}
                    onChange={(val) => handleChangedMaxLength(+val)}/>
            </Group>
        </>
    )
})