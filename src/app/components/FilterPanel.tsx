import {FC} from 'react'
import {List} from "immutable";
import {FilterFunc, FilterState, FilterType} from "@/app/data/model";
import {FilterContainer} from "@/app/components/FilterContainer";
import {Button} from "@mantine/core";
import {IconPlus} from "@tabler/icons-react";
import {DragDropContext, Droppable, OnDragEndResponder} from "@hello-pangea/dnd";

export interface FilterPanelProps {
    filterList: List<FilterState>
    addFilter: () => void
    moveFilter: (draggedId: number, id: number) => void
    setFilter: (id: number, updatedFilter: { type?: FilterType, func?: FilterFunc, enabled?: boolean }) => void
    removeFilter: (id: number) => void
}

export const FilterPanel: FC<FilterPanelProps> = function RegexContainer({
                                                                             filterList,
                                                                             addFilter,
                                                                             moveFilter,
                                                                             setFilter,
                                                                             removeFilter
                                                                         }) {

    const removeEnabled = filterList.size > 1;

    const onDragEnd: OnDragEndResponder = (result) => {
        if (!result.destination) {
            // invalid drop destination
            return;
        }

        const sourceId = filterList.get(result.source.index)!.id;
        const destId = filterList.get(result.destination.index)!.id
        moveFilter(sourceId, destId);
    };

    return (
        <div className={"w-full"}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={"filters"}>
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}>

                            {filterList.map((filter, index) => (
                                <FilterContainer
                                    key={filter.id}
                                    id={filter.id}
                                    index={index}
                                    type={filter.type}
                                    setFilter={(newFilter: {
                                        type?: FilterType,
                                        func?: FilterFunc,
                                        enabled?: boolean
                                    }) => setFilter(filter.id, newFilter)}
                                    removeFilter={() => removeFilter(filter.id)}
                                    showRemoveButton={removeEnabled}
                                />
                            ))
                            }
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                <Button
                    onClick={addFilter}
                    size={"compact-sm"}
                    rightSection={<IconPlus size={14}/>}>Add</Button>
            </DragDropContext>
        </div>
    );
}