import { addCollection } from '@iconify/vue'
import epsIconsElementPlus from './ep.json'
import epsIconsAntDesign from './ant-design.json'
import epsIconsBootstrap from './bi.json'
import epsIconsAlways from './al.json'

export function epsIconInit() {
    addCollection(epsIconsElementPlus, 'eps')
    addCollection(epsIconsAntDesign, 'eps')
    addCollection(epsIconsBootstrap, 'eps')
}

export {
    epsIconsElementPlus,
    epsIconsAntDesign,
    epsIconsBootstrap,
    epsIconsAlways
}