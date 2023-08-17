"use client";

import words from './data/words'
import {List} from 'immutable';
import React, {useState} from "react";
import {DndProvider} from "react-dnd";
import {RegexContainer} from "@/app/components/RegexContainer";
import {HTML5Backend} from "react-dnd-html5-backend";
import {RegexState} from "@/app/data/model";

const regexMatch = (regex: RegExp) => {
    return (word: string) : boolean => regex.exec(word) !== null
}

const filterWords = (regex: RegExp | null, wordList: List<string> | undefined):List<string> => {
    const filterList = wordList ? wordList : words;
    if (regex === null) {
        return filterList;
    }

    return filterList.filter(regexMatch(regex))
}

export default function Home() {

    const [regexList, setRegexList] = useState(List.of({id: 0, regex: null, remainingWords: words} as RegexState));

    const addRegex = () : void => {
        const nextId = regexList.max((a, b) => a.id - b.id)!.id + 1
        const lastEntry = regexList.get(regexList.size - 1)
        const remainingWords = lastEntry ? lastEntry.remainingWords : words;
        setRegexList(regexList.push({id: nextId, regex: null, remainingWords: remainingWords }))
        console.log(regexList)
    }

    const regexByIndex = (index: number) : RegexState => {
        return regexList.get(index) as RegexState
    }

    const indexById = (id: number) : number => {
        const index = regexList.findIndex(r => r.id === id)
        console.log(`Index of ${id} is ${index}`)
        return index;
    }

    const recalculateListFromIndex = (list: List<RegexState>, index: number) : List<RegexState> => {
        console.log("Updating from", index, "old length", list.size)

        let newList = list.slice(0, index);
        console.log(`Unaffected slice: ${newList.map(r => r.id).toJS()}`)
        let lastWords = index === 0 ? words : list.get(index - 1)!.remainingWords;

        for (let i = index; i < regexList.size; i++) {
            const curr = list.get(i) as RegexState;
            lastWords = filterWords(curr.regex, lastWords)
            const updated = {...curr, remainingWords: lastWords} as RegexState;
            console.log(`Adding updated RegexState(id=${updated.id}, regex=${updated.regex}, num_words=${lastWords.size})`)
            newList = newList.push(updated)
        }

        return newList;
    }

    const removeRegex = (id: number): void => {
        const index = indexById(id);
        console.log(`Removing id=${id}/index=${index}`)
        console.log(regexList.toObject())
        const newList = regexList.splice(index, 1)
        setRegexList(newList);
        console.log(newList.toObject())
    }

    const reorderRegex = (id: number, afterId: number):void => {
        const targetIndex = indexById(id);
        const afterIndex = indexById(afterId);
        const targetRegex = regexByIndex(targetIndex)
        console.log(`Reordering id=${id} to after id=${afterId} (index=${targetIndex}, afterIndex=${afterIndex}`)
        const reordered = regexList.splice(targetIndex, 1).splice(afterIndex, 0, targetRegex);
        setRegexList(recalculateListFromIndex(reordered, Math.min(targetIndex, afterIndex)));
    }


    const setRegex = (id: number, regex: RegExp | null): void => {
        const index = indexById(id)
        console.log(`Setting regex id=${id} to ${regex}`)
        setRegexList(recalculateListFromIndex(regexList.set(index, {id, regex, remainingWords: List.of<string>()}), index))
    }

    const lastResult = regexList.get(regexList.size - 1)!.remainingWords;

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="background -rotate-12">{lastResult.slice(0, 1000).join(" ")}</div>
            <div className="content">
                <DndProvider backend={HTML5Backend}>
                    <RegexContainer regexList={regexList} setRegex={setRegex} moveRegex={reorderRegex} removeRegex={removeRegex} addRegex={addRegex}/>
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
