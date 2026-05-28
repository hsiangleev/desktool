import { ipcMain } from 'electron'
import { 
    system, cpu, currentLoad, mem, graphics, osInfo, diskLayout, cpuTemperature,
    usb, printer, audio, networkInterfaces, wifiNetworks, bluetoothDevices, memLayout,
    fsSize
} from 'systeminformation'
import { systemCache } from './cache'

export const useOs = () => {
    // 静态数据 - 使用缓存（5分钟）
    ipcMain.handle('getSystem', async() => {
        return systemCache.get('system', system)
    })
    ipcMain.handle('getCpu', async() => {
        return systemCache.get('cpu', cpu)
    })
    ipcMain.handle('getMemLayout', async() => {
        return systemCache.get('memLayout', memLayout)
    })
    ipcMain.handle('getOsInfo', async() => {
        return systemCache.get('osInfo', osInfo)
    })
    ipcMain.handle('getGraphics', async() => {
        return systemCache.get('graphics', graphics)
    })
    ipcMain.handle('getDiskLayout', async() => {
        return systemCache.get('diskLayout', diskLayout)
    })
    ipcMain.handle('getNetworkInterfaces', async() => {
        return systemCache.get('networkInterfaces', networkInterfaces)
    })

    // 动态数据 - 使用缓存（2秒）
    ipcMain.handle('getCurrentLoad', async() => {
        return systemCache.get('currentLoad', currentLoad)
    })
    ipcMain.handle('getMem', async() => {
        return systemCache.get('mem', mem)
    })
    ipcMain.handle('getFsSize', async() => {
        return systemCache.get('fsSize', fsSize)
    })
    ipcMain.handle('getCpuTemperature', async() => {
        return systemCache.get('cpuTemperature', cpuTemperature)
    })

    // 不常用数据 - 无缓存
    ipcMain.handle('getUsb', async() => {
        return await usb()
    })
    ipcMain.handle('getPrinter', async() => {
        return await printer()
    })
    ipcMain.handle('getAudio', async() => {
        return await audio()
    })
    ipcMain.handle('getWifiNetworks', async() => {
        return await wifiNetworks()
    })
    ipcMain.handle('getBluetoothDevices', async() => {
        return await bluetoothDevices()
    })

    // 清除缓存的方法
    ipcMain.handle('clearSystemCache', async(_event, key?: string) => {
        systemCache.clear(key)
        return true
    })
}