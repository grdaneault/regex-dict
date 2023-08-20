import {FC} from 'react'
import {FilterInput} from "@/app/components/FilterInput";
import {List} from "immutable";
import {FilterFunc, FilterState} from "@/app/data/model";

export interface FilterContainerProps {
    filterList: List<FilterState>
    addFilter: () => void
    moveFilter: (draggedId: number, id: number) => void
    setFilter: (id: number, newFilter: FilterFunc) => void
    removeFilter: (id: number) => void
}

export const FilterContainer: FC<FilterContainerProps> = function RegexContainer({filterList, addFilter, moveFilter, setFilter, removeFilter}) {

    const removeEnabled = filterList.size > 1;

    return (
        <>
            <div>
                {filterList.map((filter) => (
                    <FilterInput
                        key={filter.id}
                        id={filter.id}
                        moveFilter={moveFilter}
                        setFilter={(newFilter: FilterFunc) => setFilter(filter.id, newFilter)}
                        removeFilter={() => removeFilter(filter.id)}
                        showRemoveButton={removeEnabled}
                    />
                ))}
                <button onClick={addFilter}>Add</button>
            </div>
        </>
    );
}