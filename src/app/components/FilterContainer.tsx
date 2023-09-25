import type {CSSProperties, FC} from 'react'
import React, {memo, useMemo, useRef, useState} from 'react'
import {useDrag, useDrop} from 'react-dnd'
import {ItemTypes} from "@/app/components/ItemTypes";
import {MdDragIndicator, MdRemoveCircle} from 'react-icons/md'
import {DEFAULT_FILTER, FilterFunc, FilterType} from "@/app/data/model";
import {RegexFilter} from "@/app/components/filters/RegexFilter";
import {filter} from "underscore";
import {LengthFilter} from "@/app/components/filters/LengthFilter";
import {setIn} from "immutable";
import {FilterTypeChooser} from "@/app/components/FilterTypeChooser";
import {PalindromeFilter} from "@/app/components/filters/PalindromeFilter";

const handleStyle: CSSProperties = {
    display: 'inline-block',
    marginRight: '0.5rem',
    cursor: 'move',
}

export interface FilterContainerProps {
    id: number
    type?: FilterType
    moveFilter: (draggedIndex: number, afterIndex: number) => void
    setFilter: (updatedFilter: {type?: FilterType, func?: FilterFunc, enabled?: boolean}) => void
    removeFilter: () => void
    showRemoveButton: boolean
}

export const FilterContainer: FC<FilterContainerProps> = memo(function RegexInput({id, type, moveFilter, setFilter, removeFilter, showRemoveButton}) {
    const [inverted, setInverted] = useState(false)
    const [enabled, setEnabled] = useState(false)
    const [baseFilter, setBaseFilter] = useState(() => DEFAULT_FILTER)
    const dragRef = useRef(null)
    const dropRef = useRef(null)

    const makeFilterFunc = (func: FilterFunc, enabled: boolean, inverted: boolean): FilterFunc => {
        return (val: string) => {
            if (enabled) {
                if (inverted) {
                    return !func(val);
                } else {
                    return func(val)
                }
            } else {
                return true;
            }
        };
    }

    const setFilterType = (type: FilterType, defaultFilterFunc: FilterFunc) => {
        console.log(`New filter type ${type} -- func = ${defaultFilterFunc}`)
        setBaseFilter(() => defaultFilterFunc);
        setEnabled(true);
        setInverted(false);
        const func = makeFilterFunc(defaultFilterFunc, true, false);
        setFilter({type, func})
    }

    const handleFilterChanged = (newFilter: FilterFunc) => {
        setBaseFilter(() => newFilter)
        const func = makeFilterFunc(newFilter, enabled, inverted)
        setFilter({func})
    }

    const handleInvertedChanged = (newInverted: boolean) => {
        setInverted(newInverted)
        const func = makeFilterFunc(baseFilter, enabled, newInverted);
        setFilter({func})
    }

    const handleEnabledChanged = (newEnabled: boolean) => {
        setEnabled(newEnabled)
        const func = makeFilterFunc(baseFilter, newEnabled, inverted);
        console.log(`Handling enabled change: ${newEnabled}. Func = ${baseFilter}`)
        setFilter({func})
    }

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

    connectDrag(dragRef)
    connectDrop(dropRef)

    const opacity = isDragging ? 0.5 : 1
    const containerStyle = useMemo(() => ({opacity}), [opacity])
    return (
        <div ref={dropRef} style={containerStyle} className={"regex-input"} data-handler-id={handlerId}>
            <div style={handleStyle} ref={dragRef}>
                <MdDragIndicator ref={dragRef}/>
            </div>
            <div>
                {type === FilterType.Choose && <FilterTypeChooser id={id} setFilterType={setFilterType} />}
                {type === FilterType.RegularExpression && <RegexFilter id={id} setFilter={handleFilterChanged} />}
                {type === FilterType.Length && <LengthFilter id={id} setFilter={handleFilterChanged} />}
                {type === FilterType.Palindrome && <PalindromeFilter id={id} setFilter={handleFilterChanged} />}
            </div>
            <div>
                <label htmlFor={`invert-${id}`}>Invert: </label>
                <input id={`invert-${id}`}
                       type={"checkbox"}
                       checked={inverted}
                       onChange={(e) => handleInvertedChanged(e.target.checked)}/>
                <label htmlFor={`enable-${id}`}>Enabled: </label>
                <input id={`enable-${id}`}
                       type={"checkbox"}
                       checked={enabled}
                       onChange={(e) => handleEnabledChanged(e.target.checked)}/>
                {showRemoveButton && <button onClick={removeFilter}><MdRemoveCircle/></button>}
            </div>
        </div>
    );
})