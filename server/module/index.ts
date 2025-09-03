import { useHttp } from './http'
import { useFile } from './file'
import { useEvent } from './event'
import type { BrowserWindow } from 'electron'
import { processStop } from '~/tools/git'
import { useHttpServeClose, useWebsocketClose } from '~/tools/websocket'

export const useModule = (win: BrowserWindow) => {
    useEvent(win)
    useHttp(win)
    useFile(win)
}

export const close = () => {
    processStop()
    useWebsocketClose()
    useHttpServeClose()
}