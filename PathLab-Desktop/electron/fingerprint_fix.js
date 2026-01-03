import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { v4 as uuidv4 } from 'uuid';

export function getStableMachineId(originalGetId) {
    try {
        const id = originalGetId();
        if (id && id !== 'UNKNOWN_DEVICE') return id;
    } catch (e) {}

    const idPath = path.join(app.getPath('userData'), '.sid');
    try {
        if (fs.existsSync(idPath)) {
            return fs.readFileSync(idPath, 'utf8').trim();
        }
    } catch (e) {}

    const newId = uuidv4();
    try {
        fs.writeFileSync(idPath, newId);
    } catch (e) {}
    return newId;
}
