import {FC} from 'react'
import {List} from "immutable";
import {FilterFunc, FilterState, FilterType} from "@/app/data/model";
import {FilterContainer} from "@/app/components/FilterContainer";
import {DragDropContext, Droppable, OnDragEndResponder} from "@hello-pangea/dnd";
import classes from './FilterPanel.module.css';

export interface FilterPanelProps {
    filterList: List<FilterState>
    moveFilter: (draggedId: number, id: number) => void
    setFilter: (id: number, updatedFilter: { type?: FilterType, func?: FilterFunc, enabled?: boolean }) => void
    removeFilter: (id: number) => void
}

export const FilterPanel: FC<FilterPanelProps> = function RegexContainer({
                                                                             filterList,
                                                                             moveFilter,
                                                                             setFilter,
                                                                             removeFilter
                                                                         }) {

    const isLastFilter = filterList.size === 1;

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
        <div className={classes.filterPanel}>
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
                                    isLastFilter={isLastFilter}
                                />
                            ))
                            }
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}