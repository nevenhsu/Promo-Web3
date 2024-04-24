export type BreakPoint = 'base' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type BreakPointData<T> = { [k in BreakPoint]: T }
