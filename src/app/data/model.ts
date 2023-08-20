import {List} from "immutable";

export interface FilterState {
    id: number
    filterFunc: FilterFunc
    remainingWords: List<string>
}

export type FilterFunc = (val: string) => boolean

export const DEFAULT_FILTER: FilterFunc = (_: string) => true
