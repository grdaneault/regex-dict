import type {CSSProperties, FC} from 'react'
import React, {memo, useMemo, useRef} from 'react'
import {useDrag, useDrop} from 'react-dnd'
import {ItemTypes} from "@/app/components/ItemTypes";

const handleStyle: CSSProperties = {
    backgroundColor: 'green',
    width: '1rem',
    height: '1rem',
    display: 'inline-block',
    marginRight: '0.75rem',
    cursor: 'move',
}

export interface RegexInputProps {
    id: number
    regex: string
    error: string | null
    moveRegex: (draggedId: number, id: number) => void
    setRegex: (id: number, newRegex: string) => void
    removeRegex: (id: number) => void
    showRemoveButton: boolean
}

export const RegexInput: FC<RegexInputProps> = memo(function RegexInput({id, regex, error, moveRegex, setRegex, removeRegex, showRemoveButton}) {
    const dragRef = useRef(null)
    const dropRef = useRef(null)
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


    connectDrag(dragRef)
    connectDrop(dropRef)
    const opacity = isDragging ? 0 : 1
    const containerStyle = useMemo(() => ({opacity}), [opacity])
    return (
        <div ref={dropRef} style={containerStyle} data-handler-id={handlerId}>
            <div ref={dragRef} style={handleStyle} />
            <input type="text" value={regex} onChange={(e) => setRegex(id, e.target.value)}/>
            {showRemoveButton && <button onClick={() => removeRegex(id)}>Remove</button>}
            {error && <div>{error}</div>}
        </div>
    )
})