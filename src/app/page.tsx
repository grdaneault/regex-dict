"use client";

import words from './data/words'
import {List} from 'immutable';
import React, {useState} from "react";
import {DndProvider} from "react-dnd";
import {FilterPanel} from "@/app/components/FilterPanel";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DEFAULT_FILTER, FilterFunc, FilterState, FilterType} from "@/app/data/model";


const filterWords = (filter: FilterFunc, wordList: List<string> | undefined): List<string> => {
    const filterList = wordList ? wordList : words;
    return filterList.filter(filter)
}

export default function Home() {

    const [filterList, setFilterList] = useState(List.of({id: 0, type: FilterType.Choose, func: DEFAULT_FILTER, remainingWords: words} as FilterState));

    const addFilter = (): void => {
        const nextId = filterList.max((a, b) => a.id - b.id)!.id + 1
        const lastEntry = filterList.get(filterList.size - 1)
        const remainingWords = lastEntry ? lastEntry.remainingWords : words;
        setFilterList(filterList.push({id: nextId, enabled: false, type: FilterType.Choose, func: DEFAULT_FILTER, remainingWords: remainingWords}))
        console.log(filterList)
    }

    const regexByIndex = (index: number): FilterState => {
        return filterList.get(index) as FilterState
    }

    const indexById = (id: number): number => {
        const index = filterList.findIndex(r => r.id === id)
        console.log(`Index of ${id} is ${index}`)
        return index;
    }

    const recalculateListFromIndex = (list: List<FilterState>, index: number): List<FilterState> => {
        console.log("Updating from", index, "old length", list.size)

        let newList = list.slice(0, index);
        console.log(`Unaffected slice: ${newList.map(r => r.id).toJS()}`)
        let lastWords = index === 0 ? words : list.get(index - 1)!.remainingWords;

        for (let i = index; i < filterList.size; i++) {
            const curr = list.get(i) as FilterState;
            lastWords = filterWords(curr.func, lastWords)
            const updated = {...curr, remainingWords: lastWords} as FilterState;
            console.log(`Adding updated FilterState(id=${updated.id}, regex=${updated.func}, num_words=${lastWords.size})`)
            newList = newList.push(updated)
        }

        return newList;
    }

    const removeFilter = (id: number): void => {
        const index = indexById(id);
        console.log(`Removing id=${id}/index=${index}`)
        console.log(filterList.toObject())
        const newList = filterList.splice(index, 1)
        setFilterList(newList);
        console.log(newList.toObject())
    }

    const reorderFilter = (id: number, afterId: number): void => {
        const targetIndex = indexById(id);
        const afterIndex = indexById(afterId);
        const targetFilter = regexByIndex(targetIndex)
        console.log(`Reordering id=${id} to after id=${afterId} (index=${targetIndex}, afterIndex=${afterIndex}`)
        const reordered = filterList.splice(targetIndex, 1).splice(afterIndex, 0, targetFilter);
        setFilterList(recalculateListFromIndex(reordered, Math.min(targetIndex, afterIndex)));
    }


    const setFilter = (id: number, updatedFilter: {type?: FilterType, func?: FilterFunc, enabled?: boolean}): void => {
        const index = indexById(id)
        console.log(`Setting regex id=${id} to ${updatedFilter}`)
        const existingFilter = filterList.get(index) as FilterState;
        setFilterList(recalculateListFromIndex(filterList.set(index, {...existingFilter, ...updatedFilter, remainingWords: List.of<string>()}), index))
    }

    const lastResult = filterList.get(filterList.size - 1)!.remainingWords;

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {/*<div className="background -rotate-12">{lastResult.slice(0, 1000).join(" ")}</div>*/}
            <div className="content">
                <DndProvider backend={HTML5Backend}>
                    <FilterPanel filterList={filterList} setFilter={setFilter} moveFilter={reorderFilter}
                                 removeFilter={removeFilter} addFilter={addFilter}/>
                </DndProvider>
                <div className={"results-container"}>
                    <h2>{lastResult.size > 1000 && "1000 of "}{lastResult.size} {lastResult.size === 1 ? "Result" : "Results"}</h2>
                    <ul className={"results-list"}>
                        {lastResult.slice(0, 1000).map((word) => <li key={word}>{word}</li>)}
                    </ul>
                </div>
            </div>
        </main>
    )
}
