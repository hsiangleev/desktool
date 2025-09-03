
/** 首页地址 */
export const epsPathRoot = '/'
/** 重定向页地址 */
export const epsPathRedirect = '/redirect'

export const epsBranchOptions = computed(() => useStoreLayout.config.listBranch.map((v: string) => ({ label: v, value: v })))
export const epsPackageOptions = computed(() => useStoreLayout.config.publicPackage.map((v: string) => ({ label: v, value: v })))