import { FC } from 'react'
import {RegexInput} from "@/app/components/RegexInput";
import {List} from "immutable";
import {RegexState} from "@/app/data/model";

export interface RegexContainerProps {
    regexList: List<RegexState>
    addRegex: () => void
    moveRegex: (draggedId: number, id: number) => void
    setRegex: (id: number, newRegex: RegExp) => void
    removeRegex: (id: number) => void
}

export const RegexContainer: FC<RegexContainerProps> = function RegexContainer({regexList, addRegex, moveRegex, setRegex, removeRegex}) {

    const removeEnabled = regexList.size > 1;

    return (
        <>
            <div>
                {regexList.map((regex) => (
                    <RegexInput
                        key={regex.id}
                        id={regex.id}
                        moveRegex={moveRegex}
                        setRegex={(newRegex: RegExp) => setRegex(regex.id, newRegex)}
                        removeRegex={() => removeRegex(regex.id)}
                        showRemoveButton={removeEnabled}
                    />
                ))}
                <button onClick={addRegex}>Add</button>
            </div>
        </>
    );
}