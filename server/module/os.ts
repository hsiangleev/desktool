import { ipcMain } from 'electron'
import { 
    system, cpu, currentLoad, mem, graphics, osInfo, diskLayout, cpuTemperature,
    usb, printer, audio, networkInterfaces, wifiNetworks, bluetoothDevices, memLayout
} from 'systeminformation'

export const useOs = () => {
    ipcMain.handle('getSystem', async() => {
        return await system()
    })
    ipcMain.handle('getCpu', async() => {
        return await cpu()
    })
    ipcMain.handle('getCurrentLoad', async() => {
        return await currentLoad()
    })
    ipcMain.handle('getMem', async() => {
        return await mem()
    })
    ipcMain.handle('getMemLayout', async() => {
        return await memLayout()
    })
    ipcMain.handle('getOsInfo', async() => {
        return await osInfo()
    })
    ipcMain.handle('getGraphics', async() => {
        return await graphics()
    })
    ipcMain.handle('getDiskLayout', async() => {
        return await diskLayout()
    })
    ipcMain.handle('getCpuTemperature', async() => {
        return await cpuTemperature()
    })
    ipcMain.handle('getUsb', async() => {
        return await usb()
    })
    ipcMain.handle('getPrinter', async() => {
        return await printer()
    })
    ipcMain.handle('getAudio', async() => {
        return await audio()
    })
    ipcMain.handle('getNetworkInterfaces', async() => {
        return await networkInterfaces()
    })
    ipcMain.handle('getWifiNetworks', async() => {
        return await wifiNetworks()
    })
    ipcMain.handle('getBluetoothDevices', async() => {
        return await bluetoothDevices()
    })
}