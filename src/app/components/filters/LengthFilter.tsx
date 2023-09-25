import type {FC} from 'react'
import React, {memo, useState} from 'react'
import {FilterProps} from "@/app/components/filters/FilterProps";


const MAX_WORD_LENGTH = 23


export const LengthFilter: FC<FilterProps> = memo(function LengthInput({id, setFilter}) {
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
            <label htmlFor={`min-length-${id}`}>Min: </label>
            <input id={`min-length-${id}`} type="number" value={minLength} min={0} max={MAX_WORD_LENGTH}
                   onChange={(e) => handleChangedMinLength(+e.target.value)}/>
            <label htmlFor={`max-length-${id}`}>Max: </label>
            <input id={`max-length-${id}`} type="number" value={maxLength} min={0} max={MAX_WORD_LENGTH}
                   onChange={(e) => handleChangedMaxLength(+e.target.value)}/>
        </>
    )
})