import {List} from "immutable";

export interface RegexState {
    id: number
    regex: RegExp | null
    remainingWords: List<string>
}