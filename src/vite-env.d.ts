// / <reference types="vite/client" />

type IComponent<T = any> = ReturnType<typeof defineComponent> | (() => Promise<T>)

interface IObject<T = any> {
    [index: string]: T
}
interface ISelect {
    value: string | number
    label: string
}