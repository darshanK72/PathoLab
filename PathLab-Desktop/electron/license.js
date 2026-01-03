import { ipcMain } from 'electron';

// No database or crypto imports needed anymore

export function getMachineId() {
    return 'NO_LICENSE_REQUIRED';
}

export function verifyLicense(key) {
    // Always returns true
    return true;
}

export function setupLicenseHandlers() {
    console.log(' [LICENSE] Setup handlers called - BYPASSING CHECKS');
    // Handler: Check License Status
    // Always return activated: true to bypass the activation screen
    ipcMain.handle('license:check-status', async () => {
        console.log(' [LICENSE] check-status called -> returning ACTIVATED');
        return { activated: true };
    });

    // Handler: Verify and Activate
    // Just in case it's called, return success
    ipcMain.handle('license:verify-and-activate', async (event, key) => {
        console.log(' [LICENSE] verify-and-activate called -> returning SUCCESS');
        return { success: true };
    });
    
    // Handler: Get Machine ID
    ipcMain.handle('license:get-machine-id', () => {
        console.log(' [LICENSE] get-machine-id called');
        return getMachineId();
    });
}
