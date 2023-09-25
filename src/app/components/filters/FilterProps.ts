import {FilterFunc} from "@/app/data/model";

export interface FilterProps {
    id: number
    setFilter: (filter: FilterFunc) => void
}