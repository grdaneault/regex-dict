"use client";

import words from './data/words'
import {filter, sample} from 'underscore';
import {List} from 'immutable';
import React, {useEffect, useState} from "react";
import {DndProvider} from "react-dnd";
import {RegexContainer} from "@/app/components/RegexContainer";
import {HTML5Backend} from "react-dnd-html5-backend";


export default function Home() {

    const [backgroundWords, setBackgroundWords] = useState([""]);

    const [regexList, setRegexList] = useState<List<string>>(List.of("0"))

    const updateWords = (newRegex: RegExp) => {
        const newWordList = filter(words, (word: string) => newRegex.test(word))
        setBackgroundWords(newWordList);
    }


    const removeRegex = (index: number) => {
        const newList = regexList.remove(index);
        console.log("Removing index", index, newList.toArray())
        setRegexList(newList)
    }
    const addRegex = (index: number) => {
        const newList = regexList.insert(index, (index + 1).toString());
        console.log("Updated Regex list", newList.size, newList.toArray())
        setRegexList(newList);
    }
    useEffect(() => {
        setBackgroundWords(sample(words, 300))

    }, [setBackgroundWords, setRegexList])


    console.log("rendered", regexList.size)
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="background -rotate-12">{backgroundWords.join(" ")}</div>
            <div className="content">
                <DndProvider backend={HTML5Backend}>
                    <RegexContainer/>
                </DndProvider>
                <div>

                </div>
            </div>
        </main>
    )
}
