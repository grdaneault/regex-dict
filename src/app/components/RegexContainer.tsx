import {Component, JSX} from 'react'
import update from "immutability-helper"
import {find, findIndex, map, max} from "underscore";
import {RegexInput} from "@/app/components/RegexInput";

interface RegexItem {
    id: number
    regex: string
    error: string | null
}

export interface RegexState {
    regexByIndex: RegexItem[]
}


function initialRegexList(): RegexState {
    const regexByIndex: RegexItem[] = []

    for (let i = 0; i < 3; i += 1) {
        regexByIndex[i] = {id: i, regex: "", error: null} as RegexItem
    }

    return {
        regexByIndex,
    }
}

export interface RegexContainerProps {
}

export class RegexContainer extends Component<
    RegexContainerProps,
    Record<string, unknown>
> {
    private requestedFrame: number | undefined
    private regexState: RegexState = initialRegexList()

    public constructor(props: RegexContainerProps) {
        super(props)
        this.state = STATE
    }

    public componentWillUnmount(): void {
        if (this.requestedFrame !== undefined) {
            cancelAnimationFrame(this.requestedFrame)
        }
    }

    private regexIndexById = (id: number) : number => {
        return findIndex(this.regexState.regexByIndex, r => r.id === id)
    }

    public render(): JSX.Element {
        const {regexByIndex} = this.regexState
        const removeEnabled = regexByIndex.length > 1;

        return (
            <>
                <div>
                    {regexByIndex.map((regex) => (
                        <RegexInput
                            key={regex.id}
                            id={regex.id}
                            regex={regex.regex}
                            error={regex.error}
                            moveRegex={this.moveRegex}
                            setRegex={this.setRegexValue}
                            removeRegex={this.removeRegex}
                            showRemoveButton={removeEnabled}
                        />
                    ))}
                    <button onClick={this.addRegex}>Add</button>
                </div>
            </>
        )
    }

    private moveRegex = (id: number, afterId: number): void => {
        const regexIndex = this.regexIndexById(id);
        const regex = this.regexState.regexByIndex[regexIndex];
        const afterIndex = this.regexIndexById(afterId);
        this.regexState = update(this.regexState, {
            regexByIndex: {
                $splice: [
                    [regexIndex, 1],
                    [afterIndex, 0, regex],
                ],
            },
        })
        this.scheduleUpdate()
    }

    private removeRegex = (id: number): void => {
        const regexIndex = this.regexIndexById(id)
        this.regexState = update(this.regexState, {
            regexByIndex: {
                $splice: [
                    [regexIndex, 1],
                ],
            },
        })
        this.scheduleUpdate()
    }

    private addRegex = (): void => {
        const nextId = max(map(this.regexState.regexByIndex, r => r.id)) + 1

        const newRegexItem = {
            id: nextId,
            regex: "",
            error: null
        } as RegexItem

        this.regexState = update(this.regexState, {
            regexByIndex: {
                $push: [newRegexItem],
            },
        })
        this.scheduleUpdate()
    }


    private setRegexValue = (id: number, newRegex: string): void => {
        const regexIndex = this.regexIndexById(id)

        console.log("Updating regex state", this.regexState.regexByIndex[0]);
        try {
            const parsed = new RegExp(newRegex)
            this.regexState = update(this.regexState, {
                regexByIndex: {
                    [regexIndex]: {
                        regex: {
                            $set: newRegex
                        },
                        error: {
                            $set: null
                        }
                    }
                },
            })
        } catch (ex) {
            const error = (ex as SyntaxError).message;
            this.regexState = update(this.regexState, {
                regexByIndex: {
                    [regexIndex]: {
                        regex: {
                            $set: newRegex
                        },
                        error: {
                            $set: error
                        }
                    }
                },
            })
        }

        this.scheduleUpdate()
    }

    private scheduleUpdate() {
        if (!this.requestedFrame) {
            this.requestedFrame = requestAnimationFrame(this.drawFrame)
        }
    }

    private drawFrame = (): void => {
        this.setState(STATE)
        this.requestedFrame = undefined
    }
}

const STATE = {}