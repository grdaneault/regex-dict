import type {FC} from 'react'
import React, {memo, useState} from 'react'
import {ActionIcon, CloseButton, Group, MantineSize, Paper, Tooltip} from '@mantine/core';
import {DEFAULT_FILTER, FilterFunc, FilterType} from "@/app/data/model";
import {RegexFilter} from "@/app/components/filters/RegexFilter";
import {LengthFilter} from "@/app/components/filters/LengthFilter";
import {FilterTypeChooser} from "@/app/components/FilterTypeChooser";
import {PalindromeFilter} from "@/app/components/filters/PalindromeFilter";
import {IconEye, IconGripVertical, IconRotate360} from "@tabler/icons-react";
import {Draggable} from "@hello-pangea/dnd";
import classes from './FilterContainer.module.css';


export interface FilterContainerProps {
    id: number
    index: number
    type?: FilterType
    setFilter: (updatedFilter: { type?: FilterType, func?: FilterFunc, enabled?: boolean }) => void
    removeFilter: () => void
    showRemoveButton: boolean
}

export const FilterContainer: FC<FilterContainerProps> = memo(
    function RegexInput({
                            id,
                            index,
                            type,
                            setFilter,
                            removeFilter,
                            showRemoveButton
                        }) {
        const [inverted, setInverted] = useState(false)
        const [enabled, setEnabled] = useState(false)
        const [baseFilter, setBaseFilter] = useState(() => DEFAULT_FILTER)

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

        const invertActionText = inverted ? "Un-invert Filter" : "Invert Filter";
        const enableActionText = enabled ? "Disable Filter" : "Enable Filter";
        const buttonIconSize = "md" as MantineSize;

        return (
            <Draggable draggableId={`${id}`} index={index}>
                {(provided) => (
                    <Paper
                        shadow={"xs"}
                        withBorder
                        p={"x1"}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        classNames={{root: classes.filterContainer}}
                    >
                        <div className={classes.dragHandle} {...provided.dragHandleProps} >
                            <IconGripVertical size={"2em"}/>
                        </div>
                        <div className={classes.filter}>
                            {type === FilterType.Choose && <FilterTypeChooser id={id} setFilterType={setFilterType}/>}
                            {type === FilterType.RegularExpression &&
                                <RegexFilter id={id} setFilter={handleFilterChanged}/>}
                            {type === FilterType.Length && <LengthFilter id={id} setFilter={handleFilterChanged}/>}
                            {type === FilterType.Palindrome &&
                                <PalindromeFilter id={id} setFilter={handleFilterChanged}/>}
                        </div>
                        <Group className={classes.filterToggleContainer}>
                            <ActionIcon.Group>
                                <Tooltip label={invertActionText}>
                                    <ActionIcon
                                        aria-label={invertActionText}
                                        onClick={() => handleInvertedChanged(!inverted)}
                                        variant={inverted ? "filled" : "default"}
                                        disabled={type === FilterType.Choose}
                                        size={buttonIconSize}>
                                        <IconRotate360 className={classes.filterToggle}/>
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label={enableActionText}>
                                    <ActionIcon
                                        aria-label={enableActionText}
                                        onClick={() => handleEnabledChanged(!enabled)}
                                        variant={enabled ? "filled" : "default"}
                                        disabled={type === FilterType.Choose}
                                        size={buttonIconSize}>
                                        <IconEye className={classes.filterToggle}/>
                                    </ActionIcon>
                                </Tooltip>
                            </ActionIcon.Group>
                        </Group>

                        {showRemoveButton &&
                            <div className={classes.closeButton}>
                                <Tooltip label={"Remove Filter"}>
                                    <CloseButton
                                        onClick={removeFilter}
                                        variant={"subtle"}
                                        size={buttonIconSize}>
                                    </CloseButton>
                                </Tooltip>
                            </div>}

                    </Paper>
                )}
            </Draggable>
        );
    })