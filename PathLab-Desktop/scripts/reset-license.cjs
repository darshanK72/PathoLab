const Database = require('better-sqlite3');
const path = require('path');
const os = require('os');

// Standard Electron userData path for this app on Linux
const dbPath = path.join(os.homedir(), '.config', 'patholab-desktop-app', 'database.db');

console.log(`Connecting to database at: ${dbPath}`);

try {
    const db = new Database(dbPath, { fileMustExist: true });

    const info = db.prepare("DELETE FROM settings WHERE key = 'license_key'").run();

    if (info.changes > 0) {
        console.log('Successfully removed the license key configuration.');
        console.log('The application will prompt for activation on the next launch.');
    } else {
        console.log('No license key was found in the database. It might already be reset.');
    }

    db.close();
} catch (error) {
    if (error.code === 'SQLITE_CANTOPEN') {
        console.error('Error: Could not find the database file. Make sure the app has been run at least once.');
    } else {
        console.error('An error occurred:', error.message);
    }
    process.exit(1);
}
