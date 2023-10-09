import type {CSSProperties, FC} from 'react'
import React, {memo, useMemo, useRef, useState} from 'react'
import {ActionIcon, CloseButton, Group, MantineSize, Paper, Tooltip} from '@mantine/core';
import {useDrag, useDrop} from 'react-dnd'
import {ItemTypes} from "@/app/components/ItemTypes";
import {DEFAULT_FILTER, FilterFunc, FilterType} from "@/app/data/model";
import {RegexFilter} from "@/app/components/filters/RegexFilter";
import {LengthFilter} from "@/app/components/filters/LengthFilter";
import {FilterTypeChooser} from "@/app/components/FilterTypeChooser";
import {PalindromeFilter} from "@/app/components/filters/PalindromeFilter";
import {IconEye, IconGripVertical, IconRotate360} from "@tabler/icons-react";

const baseContainerStyle: CSSProperties = {
    marginBottom: "1rem",
    marginTop: "1rem",
    display: "flex",
    flexDirection: "row",
    gap: "1rem"
}

const handleStyle: CSSProperties = {
    marginRight: '0.5rem',
    cursor: 'move',
    width: '1rem',
    alignSelf: 'center'
}

const filterStyle: CSSProperties = {
    flexGrow: 1,
    padding: "0.5rem 0"
}

const buttonIconStyle: CSSProperties = {
    width: '70%',
    height: '70%'
}

const buttonContainerStyle: CSSProperties = {
    // display: 'flex',
    alignSelf: 'end'
}

const closeButtonStyle: CSSProperties = {
    width: 'auto'

}

export interface FilterContainerProps {
    id: number
    type?: FilterType
    moveFilter: (draggedIndex: number, afterIndex: number) => void
    setFilter: (updatedFilter: { type?: FilterType, func?: FilterFunc, enabled?: boolean }) => void
    removeFilter: () => void
    showRemoveButton: boolean
}

export const FilterContainer: FC<FilterContainerProps> = memo(
    function RegexInput({
                            id,
                            type,
                            moveFilter,
                            setFilter,
                            removeFilter,
                            showRemoveButton
                        }) {
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
        const containerStyle = useMemo(() => ({opacity, ...baseContainerStyle}), [opacity])

        const invertActionText = inverted ? "Un-invert Filter" : "Invert Filter";
        const enableActionText = enabled ? "Disable Filter" : "Enable Filter";
        const buttonIconSize = "md" as MantineSize;

        return (
            <Paper shadow={"xs"} withBorder p={"x1"} style={containerStyle} ref={dropRef} data-handler-id={handlerId}>
                <div style={handleStyle} ref={dragRef}>
                    <IconGripVertical ref={dragRef} size={"2em"}/>
                </div>
                <div style={filterStyle}>
                    {type === FilterType.Choose && <FilterTypeChooser id={id} setFilterType={setFilterType}/>}
                    {type === FilterType.RegularExpression && <RegexFilter id={id} setFilter={handleFilterChanged}/>}
                    {type === FilterType.Length && <LengthFilter id={id} setFilter={handleFilterChanged}/>}
                    {type === FilterType.Palindrome && <PalindromeFilter id={id} setFilter={handleFilterChanged}/>}
                </div>
                <Group style={buttonContainerStyle}>
                    <ActionIcon.Group>
                        <Tooltip label={invertActionText}>
                            <ActionIcon
                                aria-label={invertActionText}
                                onClick={() => handleInvertedChanged(!inverted)}
                                variant={inverted ? "filled" : "default"}
                                size={buttonIconSize}>
                                <IconRotate360 style={buttonIconStyle}/>
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label={enableActionText}>
                            <ActionIcon
                                aria-label={enableActionText}
                                onClick={() => handleEnabledChanged(!enabled)}
                                variant={enabled ? "filled" : "default"}
                                size={buttonIconSize}>
                                <IconEye style={buttonIconStyle}/>
                            </ActionIcon>
                        </Tooltip>
                    </ActionIcon.Group>
                </Group>

                {showRemoveButton &&
                    <div style={closeButtonStyle}>
                        <Tooltip label={"Remove Filter"}>
                            <CloseButton
                                onClick={removeFilter}
                                variant={"subtle"}
                                size={buttonIconSize}>
                            </CloseButton>
                        </Tooltip>
                    </div>}

            </Paper>
        );
    })