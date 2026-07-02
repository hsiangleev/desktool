import { useMenu } from './menu'
import { useTag } from './tag'

export const useStoreLayout2 = () => {
    const menu = useMenu()
    const tag = useTag()
    
    return {
        ...menu,
        ...tag
    }
}
