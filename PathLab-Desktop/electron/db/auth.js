import { ipcMain } from 'electron';
import bcrypt from 'bcryptjs';
import { db } from './index.js';
import { users } from './schema.js';
import { eq } from 'drizzle-orm';

let currentUser = null;

export function setupAuthHandlers() {
  console.log('Setting up auth handlers...');

  // Login Handler
  ipcMain.handle('auth:login', async (event, { username, password }) => {
    try {
      console.log(`Attempting login for user: ${username}`);
      const result = await db.select().from(users).where(eq(users.username, username)).get();
      
      if (!result) {
        console.log('User not found');
        return { success: false, message: 'Invalid username or password' };
      }

      const isValid = await bcrypt.compare(password, result.passwordHash);
      if (!isValid) {
        console.log('Invalid password');
        return { success: false, message: 'Invalid username or password' };
      }

      // Remove sensitive data
      const { passwordHash, ...userWithoutPassword } = result;
      currentUser = userWithoutPassword;
      
      console.log('Login successful');
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    }
  });

  // Get Current User
  ipcMain.handle('auth:get-current-user', () => {
    return currentUser;
  });

  // Logout
  ipcMain.handle('auth:logout', () => {
    currentUser = null;
    return { success: true };
  });

  // Get All Users
  ipcMain.handle('auth:get-users', async () => {
    try {
      const allUsers = await db.select({
        id: users.id,
        username: users.username,
        role: users.role,
        createdAt: users.createdAt
      }).from(users).all();
      return allUsers;
    } catch (error) {
      console.error('Failed to get users:', error);
      return [];
    }
  });

  // Create User
  ipcMain.handle('auth:create-user', async (event, { username, password, role }) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      
      await db.insert(users).values({
        id: 'USER-' + Date.now(),
        username,
        passwordHash: hash,
        role
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to create user:', error);
      return { success: false, message: error.message };
    }
  });

  // Delete User
  ipcMain.handle('auth:delete-user', async (event, userId) => {
    try {
      await db.delete(users).where(eq(users.id, userId));
      return { success: true };
    } catch (error) {
      console.error('Failed to delete user:', error);
      return { success: false, message: error.message };
    }
  });
  
  console.log('Auth handlers set up completely.');
}

export { currentUser };