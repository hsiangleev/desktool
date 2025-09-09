
export const IMenuStatus = {
    /** 电脑展开 */
    PCE: 'PCE',
    /** 电脑合并 */
    PCN: 'PCN',
    /** 平板展开 */
    PHE: 'PHE',
    /** 平板合并 */
    PHN: 'PHN'
} as const satisfies Record<string, string>

type IMenuStatusType = typeof IMenuStatus[keyof typeof IMenuStatus];
export const useMenu = () => {
    const { width } = useWindowSize()
    const isCollapsed = ref(width.value < 450)
    const menuStatus = computed<IMenuStatusType>(() => (
        width.value > 450 
            ? isCollapsed.value ? IMenuStatus.PCN : IMenuStatus.PCE
            : isCollapsed.value ? IMenuStatus.PHN : IMenuStatus.PHE
    ))
    const updateCollapsed = () => isCollapsed.value = !isCollapsed.value

    return { width, isCollapsed, menuStatus, updateCollapsed }
}