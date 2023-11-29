import {List} from "immutable";

export interface FilterState {
    id: number
    enabled: boolean
    type: FilterType
    func: FilterFunc
    remainingWords: List<string>
}

export type FilterFunc = (val: string) => boolean

export const DEFAULT_FILTER:FilterFunc = (_: string) => true

export enum FilterType {
    Choose,
    Length,
    RegularExpression,
    RequiredLetters,
    Palindrome,
}