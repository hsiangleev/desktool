import { useConfig } from './config'
import { useMenu } from './menu'
import { useTag } from './tag'

export const useStoreLayout2 = () => {
    const menu = useMenu()
    const config = useConfig()
    const tag = useTag()
    
    return {
        ...menu,
        config,
        ...tag
    }
}
