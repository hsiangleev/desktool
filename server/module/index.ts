import { useHttp } from './http'
import { useFile } from './file'
import { useEvent } from './event'
import { useOs } from './os'
import type { BrowserWindow } from 'electron'
import { processStopAll } from '~/tools/command'
import { useWebsocketClose } from '~/tools/websocket'
import { useHttpServeClose } from '~/tools/http'

export const useModule = (win: BrowserWindow) => {
    useEvent(win)
    useHttp(win)
    useFile(win)
    useOs()
}

export const useProcessStop = async() => {
    await processStopAll()
    await useWebsocketClose()
    await useHttpServeClose()
}