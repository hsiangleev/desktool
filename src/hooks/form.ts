import type { FormInstance } from 'element-plus'
/**
 * 对整个表单的内容进行验证
 * @param formEl 表单 ref
 * @param filed 字段名
 * @returns 
 */
export async function epsFormSubmit(formEl: FormInstance | undefined) {
    if (!formEl) return
    try {
        return await formEl.validate((d, d2) => {
            if(!d && d2) {
                const errList = Object.keys(d2)
                if(errList.length === 0) return
                const msg = d2[errList[0]]?.[0]?.message
                msg && epsLayerMsg(msg, 'warning')
            }
        })
    } catch {
        return false
    }
}

/**
 * 重置该表单项，将其值重置为初始值，并移除校验结果
 * @param formEl 表单 ref
 * @param filed 字段名
 * @returns 
 */
export function epsFormReset(formEl: FormInstance | undefined) {
    if (!formEl) return
    formEl.resetFields()
}

/**
 * 验证具体的某个字段
 * @param formEl 表单 ref
 * @param filed 字段名
 * @returns 
 */
export function epsFormValidateField(formEl: FormInstance | undefined, filed: string) {
    if (!formEl) return
    formEl.validateField(filed)
}

/**
 * 清理某个字段的表单验证信息
 * @param formEl 表单 ref
 * @param filed 字段名
 * @returns 
 */
export function epsFormClearValidate(formEl: FormInstance | undefined, filed: string) {
    if (!formEl) return
    formEl.clearValidate(filed)
}

export const loadProject = async(rootPath: string) => {
    if(!rootPath) return epsLayerMsg('项目根目录不能为空', 'warning')
    const { close } = await epsLayerLoading()
    const { errMsg, fileList } = await window.electronAPI.invoke('readdir', rootPath)
    close()
    if(errMsg) {
        return epsLayerMsg(errMsg, 'error')
    }
    return fileList.map((v:any) => ({ value: `${v.parentPath.replace(/\\/g,'/')}/${v.name}`, label: v.name }))
}