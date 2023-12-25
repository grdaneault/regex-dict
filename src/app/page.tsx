"use client";

import words from './data/words'
import {List} from 'immutable';
import React, {useState} from "react";
import {FilterPanel} from "@/app/components/FilterPanel";
import {DEFAULT_FILTER, FilterFunc, FilterState, FilterType} from "@/app/data/model";
import {Divider, Paper, SimpleGrid, StyleProp, Text} from "@mantine/core";


const filterWords = (filter: FilterFunc, wordList: List<string> | undefined): List<string> => {
    const filterList = wordList ? wordList : words;
    return filterList.filter(filter)
}

export default function Home() {

    const [filterList, setFilterList] = useState(List.of({
        id: 0,
        type: FilterType.Choose,
        func: DEFAULT_FILTER,
        remainingWords: words
    } as FilterState));

    const addFilter = (): void => {
        const nextId = filterList.max((a, b) => a.id - b.id)!.id + 1
        const lastEntry = filterList.get(filterList.size - 1)
        const remainingWords = lastEntry ? lastEntry.remainingWords : words;
        setFilterList(filterList.push({
            id: nextId,
            enabled: false,
            type: FilterType.Choose,
            func: DEFAULT_FILTER,
            remainingWords: remainingWords
        }))
        console.log(filterList)
    }

    const regexByIndex = (index: number): FilterState => {
        return filterList.get(index) as FilterState
    }

    const indexById = (id: number): number => {
        return filterList.findIndex(r => r.id === id)
    }

    const recalculateListFromIndex = (list: List<FilterState>, index: number): List<FilterState> => {
        console.log(`Updating filters from ${index} to ${list.size}`)
        let newList = list.slice(0, index);
        let lastWords = index === 0 ? words : list.get(index - 1)!.remainingWords;

        for (let i = index; i < list.size; i++) {
            const curr = list.get(i) as FilterState;
            lastWords = filterWords(curr.func, lastWords)
            const updated = {...curr, remainingWords: lastWords} as FilterState;
            newList = newList.push(updated)
        }

        return newList;
    }

    const removeFilter = (id: number): void => {
        const index = indexById(id);
        console.log(`Removing id=${id}/index=${index}`)
        const newList = recalculateListFromIndex(filterList.splice(index, 1), index);
        setFilterList(newList);
    }

    const reorderFilter = (id: number, afterId: number): void => {
        const targetIndex = indexById(id);
        const afterIndex = indexById(afterId);
        const targetFilter = regexByIndex(targetIndex)
        console.log(`Reordering id=${id} to after id=${afterId} (index=${targetIndex}, afterIndex=${afterIndex}`)
        const reordered = filterList.splice(targetIndex, 1).splice(afterIndex, 0, targetFilter);
        setFilterList(recalculateListFromIndex(reordered, Math.min(targetIndex, afterIndex)));
    }


    const setFilter = (id: number, updatedFilter: {
        type?: FilterType,
        func?: FilterFunc,
        enabled?: boolean
    }): void => {
        const index = indexById(id)
        console.log(`Setting regex id=${id} to ${updatedFilter}`)
        const existingFilter = filterList.get(index) as FilterState;
        setFilterList(recalculateListFromIndex(filterList.set(index, {
            ...existingFilter, ...updatedFilter,
            remainingWords: List.of<string>()
        }), index))
    }

    const buildResultCountStr = (count: number, resultCap: number) => {
        if (count > resultCap) {
            return `${resultCap} of ${count} Results`;
        }
        return `${count} ${lastResult.size === 1 ? "Result" : "Results"}`;
    }

    const lastResult = filterList.get(filterList.size - 1)!.remainingWords;

    const resultCap = 1000;

    const wordsToShow = lastResult.slice(0, resultCap);
    const longestLen = (wordsToShow.maxBy((val) => val.length) || "").length;

    const LEN_1_COLUMNS: StyleProp<number> = {base: 4, xs: 6, sm: 8, lg: 10};
    const LEN_7_COLUMNS: StyleProp<number> = {base: 3, xs: 3, sm: 4, md: 5, lg: 8}
    const LEN_15_COLUMNS: StyleProp<number> = {base: 2, xs: 3, sm: 4, md: 5, lg: 6}

    let columns: StyleProp<number> = longestLen >= 14 ? LEN_15_COLUMNS : longestLen >= 7 ? LEN_7_COLUMNS : LEN_1_COLUMNS;

    return (
        <main className="flex min-h-screen flex-col items-center
            p-1 w-full
             xl:max-w-6xl
             mx-auto
             gap-2
             ">
            <FilterPanel filterList={filterList} setFilter={setFilter} moveFilter={reorderFilter}
                         removeFilter={removeFilter} addFilter={addFilter}/>
            <Paper
                w={"100%"}
                p={"sm"}
                shadow={"xs"}
                withBorder>
                <Text component={"h2"} size={"lg"}
                      fw={600}>
                    {buildResultCountStr(lastResult.size, resultCap)}</Text>
                <Divider/>
                <SimpleGrid cols={columns} mt={"xs"}>
                    {wordsToShow.map((word) => <Text key={word}>{word}</Text>)}
                </SimpleGrid>
            </Paper>
        </main>
    )
}
