import type {CSSProperties, FC} from 'react'
import React, {memo, useMemo, useRef, useState} from 'react'
import {useDrag, useDrop} from 'react-dnd'
import {ItemTypes} from "@/app/components/ItemTypes";
import {MdDragIndicator, MdRemoveCircle} from 'react-icons/md'

const handleStyle: CSSProperties = {
    display: 'inline-block',
    marginRight: '0.5rem',
    cursor: 'move',
}

export interface RegexInputProps {
    id: number
    moveRegex: (draggedIndex: number, afterIndex: number) => void
    setRegex: (regex: RegExp) => void
    removeRegex: () => void
    showRemoveButton: boolean
}

export const RegexInput: FC<RegexInputProps> = memo(function RegexInput({id, moveRegex, setRegex, removeRegex, showRemoveButton}) {
    const dragRef = useRef(null)
    const dropRef = useRef(null)
    const [regexStr, setRegexStr] = useState("");
    const [error, setError] = useState<string>("");

    const [{isDragging, handlerId}, connectDrag] = useDrag({
        type: ItemTypes.REGEX,
        item: {id},
        collect: (monitor) => {
            return {
                handlerId: monitor.getHandlerId(),
                isDragging: monitor.isDragging(),
            }
        },
    })

    const [, connectDrop] = useDrop({
        accept: ItemTypes.REGEX,
        hover({id: draggedId}: { id: number; type: string }) {
            if (draggedId !== id) {
                moveRegex(draggedId, id)
            }
        },
    })

    const handleRegexChange = (newRegex: string) => {
        setRegexStr(newRegex)
        try {
            setRegex(new RegExp(newRegex))
            setError("");
        } catch (ex) {
            const error = (ex as SyntaxError).message;
            setError(error)
        }
    }


    connectDrag(dragRef)
    connectDrop(dropRef)
    const opacity = isDragging ? 0.5 : 1
    const containerStyle = useMemo(() => ({opacity}), [opacity])
    return (
        <div ref={dropRef} style={containerStyle} className={"regex-input"} data-handler-id={handlerId}>
            <div style={handleStyle} ref={dragRef}>
            <MdDragIndicator ref={dragRef} />
            </div>
            <input type="text" value={regexStr} onChange={(e) => handleRegexChange(e.target.value)}/>
            {showRemoveButton && <button onClick={removeRegex}><MdRemoveCircle /></button>}
            {error && <div>{error}</div>}
        </div>
    )
})