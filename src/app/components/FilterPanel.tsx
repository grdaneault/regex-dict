import {FC} from 'react'
import {RegexFilter} from "@/app/components/filters/RegexFilter";
import {List} from "immutable";
import {FilterFunc, FilterState, FilterType} from "@/app/data/model";
import {FilterContainer} from "@/app/components/FilterContainer";

export interface FilterPanelProps {
    filterList: List<FilterState>
    addFilter: () => void
    moveFilter: (draggedId: number, id: number) => void
    setFilter: (id: number, updatedFilter: {type?: FilterType, func?: FilterFunc, enabled?: boolean}) => void
    removeFilter: (id: number) => void
}

export const FilterPanel: FC<FilterPanelProps> = function RegexContainer({filterList, addFilter, moveFilter, setFilter, removeFilter}) {

    const removeEnabled = filterList.size > 1;

    return (
        <>
            <div>
                {filterList.map((filter) => (
                    <FilterContainer
                        key={filter.id}
                        id={filter.id}
                        type={filter.type}
                        moveFilter={moveFilter}
                        setFilter={(newFilter: {type?: FilterType, func?: FilterFunc, enabled?: boolean}) => setFilter(filter.id, newFilter)}
                        removeFilter={() => removeFilter(filter.id)}
                        showRemoveButton={removeEnabled}
                    />
                ))}
                <button onClick={addFilter}>Add</button>
            </div>
        </>
    );
}