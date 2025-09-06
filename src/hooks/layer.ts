import { ElLoading, ElMessage, ElMessageBox, ElNotification, ElSwitch } from 'element-plus'
import type { Action, MessageBoxData, MessageBoxInputValidator, MessageParams } from 'element-plus'
import { WarningFilled } from '@element-plus/icons-vue'

/**
 * loading框
 * @param text 提示内容，默认Loading
 * @returns 
 */
export function epsLayerLoading(text = 'Loading') {
    return ElLoading.service({
        lock: true,
        text,
        background: 'rgba(0, 0, 0, 0.5)',
        fullscreen: true
    })
}
const getMessage = (text: string | string[]) => !Array.isArray(text) ? text : text.length === 1 ? text[0] : text.map((v,i) => `${i + 1}. ${v}`).join('</br>')
type ILayerType = 'success' | 'warning' | 'info' | 'error'
/**
 * message框
 * @param text 提示信息
 * @param type 类型，'success' | 'warning' | 'info' | 'error'
 * @returns 
 */
export function epsLayerMsg(text: string | string[], type: ILayerType = 'success') {
    const opts:MessageParams = { type }
    opts.message = getMessage(text)
    opts.dangerouslyUseHTMLString = Array.isArray(text)
    ElMessage(opts)
}
/**
 * alert框
 * @param text 提示信息
 * @param type 类型，'success' | 'warning' | 'info' | 'error'
 * @returns 
 */
export async function epsLayerAlert(text: string | string[], type: ILayerType = 'success') {
    return new Promise((resolve, reject) => {
        ElMessageBox.alert(getMessage(text),'提示', {
            type,
            closeOnClickModal: false,
            distinguishCancelAndClose: true,
            draggable: true,
            dangerouslyUseHTMLString: Array.isArray(text)
        }).then((action: Action) => {
            resolve(action)
        })
            .catch((action: Action) => reject(action))
    })
}
/**
 * 确认框
 * @param text text 提示信息
 * @param type 类型，'success' | 'warning' | 'info' | 'error'
 * @returns 
 */
export async function epsLayerConfirm(text: string | string[], type: ILayerType = 'warning', confirmText = '确定', cancelText = '取消') {
    return new Promise((resolve, reject) => {
        ElMessageBox.confirm(getMessage(text),'提示', {
            type,
            closeOnClickModal: false,
            draggable: true,
            distinguishCancelAndClose: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
            dangerouslyUseHTMLString: Array.isArray(text)
        }).then((action: Action) => {
            resolve(action)
        })
            .catch((action: Action) => reject(action))
    })
}

/**
 * 确认框（带有checkbox控件的）
 * @param text text 提示信息
 * @param text checkedText checkbox信息
 * @param text defaultChecked checkbox默认值
 * @returns 
 */
export async function epsLayerConfirmChecked(text: string, checkedText?: string, defaultChecked = false): Promise<boolean> {
    const checked = ref(defaultChecked)
    return new Promise((resolve, reject) => {
        ElMessageBox({
            title: '提示',
            showCancelButton: true,
            closeOnClickModal: false,
            draggable: true,
            distinguishCancelAndClose: true,
            type: 'warning',
            icon: markRaw(WarningFilled),
            message: () =>
                h('div', {}, [
                    h('div', {}, text),
                    (() => checkedText ? (h('div', {
                        class: 'flex items-center'
                    }, [
                        h('p', {}, `${checkedText}：`),
                        h(ElSwitch, {
                            modelValue: checked.value,
                            'onUpdate:modelValue': (val: any) => {
                                checked.value = val
                            }
                        })
                    ])) : null)()
                ])
        }).then(() => {
            resolve(checked.value)
        })
            .catch((action: Action) => reject(action))
    })
}

interface IPrompt {
    title?: string
    type: 'text' | 'textarea' | 'password' | 'number'
    value?: string
    placeholder?: string
    pattern?: RegExp
    validator?: MessageBoxInputValidator
    errorMsg?: string
}
/**
 * 输入框
 * @param param 
 * @returns 
 */
export async function epsLayerPrompt(param:IPrompt): Promise<MessageBoxData> {
    return new Promise((resolve, reject) => {
        ElMessageBox.prompt('', param.title ?? '提示', {
            inputType: param.type,
            inputPlaceholder: param.placeholder,
            inputValue: param.value,
            inputPattern: param.pattern,
            inputValidator: param.validator,
            inputErrorMessage: param.errorMsg,
            closeOnClickModal: false,
            distinguishCancelAndClose: true,
            draggable: true
        }).then((str) => {
            resolve(str)
        })
            .catch((action: Action) => reject(action))
    })
}
/**
 * 右上角消息提示
 * @param title 标题
 * @param message 内容
 * @param type 类型，'success' | 'warning' | 'info' | 'error'
 * @returns 
 */
export async function epsLayerNotice(title: string, message: string | string[], type: ILayerType = 'success', duration = 3000) {
    return ElNotification({
        title,
        message: getMessage(message),
        type,
        duration,
        dangerouslyUseHTMLString: Array.isArray(message),
        offset: 42
    })
}

/**
 * 警告
 * @param msg 警告的内容
 * @returns 
 */
export const epsLogWarn = (msg: string) => console.warn(`[admin]: ${msg}`)