import type {CSSProperties, FC} from 'react'
import React, {memo, useMemo, useRef, useState} from 'react'
import {useDrag, useDrop} from 'react-dnd'
import {ItemTypes} from "@/app/components/ItemTypes";
import {MdDragIndicator, MdRemoveCircle} from 'react-icons/md'
import {FilterFunc} from "@/app/data/model";

const handleStyle: CSSProperties = {
    display: 'inline-block',
    marginRight: '0.5rem',
    cursor: 'move',
}

export interface FilterInputProps {
    id: number
    moveFilter: (draggedIndex: number, afterIndex: number) => void
    setFilter: (filter: FilterFunc) => void
    removeFilter: () => void
    showRemoveButton: boolean
}

export const FilterInput: FC<FilterInputProps> = memo(function RegexInput({id, moveFilter, setFilter, removeFilter, showRemoveButton}) {
    const dragRef = useRef(null)
    const dropRef = useRef(null)
    const [invert, setInvert] = useState(false);
    const [regexStr, setRegexStr] = useState("");
    const [error, setError] = useState<string>("");

    const [{isDragging, handlerId}, connectDrag] = useDrag({
        type: ItemTypes.FILTER,
        item: {id},
        collect: (monitor) => {
            return {
                handlerId: monitor.getHandlerId(),
                isDragging: monitor.isDragging(),
            }
        },
    })

    const [, connectDrop] = useDrop({
        accept: ItemTypes.FILTER,
        hover({id: draggedId}: { id: number; type: string }) {
            if (draggedId !== id) {
                moveFilter(draggedId, id)
            }
        },
    })

    const makeFilter = (newRegex: string, newInvert: boolean): FilterFunc => {
        const regex = new RegExp(newRegex)
        if (newInvert) {
            return (val: string) => !regex.test(val)
        } else {
            return (val: string) => regex.test(val)
        }
    }
    const handleRegexChange = (newRegex: string) => {
        setRegexStr(newRegex)
        try {
            setFilter(makeFilter(newRegex, invert))
            setError("");
        } catch (ex) {
            const error = (ex as SyntaxError).message;
            setError(error)
        }
    }

    const handleInvertChange = (newInvert: boolean) => {
        setInvert(newInvert);
        setFilter(makeFilter(regexStr, newInvert))
    }


    connectDrag(dragRef)
    connectDrop(dropRef)
    const opacity = isDragging ? 0.5 : 1
    const containerStyle = useMemo(() => ({opacity}), [opacity])
    return (
        <div ref={dropRef} style={containerStyle} className={"regex-input"} data-handler-id={handlerId}>
            <div style={handleStyle} ref={dragRef}>
                <MdDragIndicator ref={dragRef}/>
            </div>
            <input type="text" value={regexStr} onChange={(e) => handleRegexChange(e.target.value)}/>
            <label htmlFor={`invert-${id}`}>Invert: </label>
            <input id={`invert-${id}`}
                   type={"checkbox"}
                   checked={invert}
                   disabled={!!error}
                   onChange={(e) => handleInvertChange(e.target.checked)}/>
            {showRemoveButton && <button onClick={removeFilter}><MdRemoveCircle/></button>}
            {error && <div>{error}</div>}
        </div>
    )
})