import os from 'os';
import pidusage from 'pidusage';
import express from 'express';
const router = express.Router();

const API_VERSION = '1.0.0';
const ENVIRONMENT = process.env.NODE_ENV || 'development';

router.get('/', async (_, res) => {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsageInGB = {
      'Memory Total (GB)': (totalMemory / 1024 / 1024 / 1024).toFixed(2),
      'Memory Used (GB)': (usedMemory / 1024 / 1024 / 1024).toFixed(2),
      'Memory Free (GB)': (freeMemory / 1024 / 1024 / 1024).toFixed(2),
    };
  
    let cpuUsage;
    try {
      const stats = await pidusage(process.pid);
      cpuUsage = `${stats.cpu.toFixed(2)}%`;
    } catch (err) {
      console.error(err);
      cpuUsage = 'Unavailable';
    }
  
    const uptimeSeconds = process.uptime();
    const uptimeHours = Math.floor(uptimeSeconds / 3600);
    const uptimeMinutes = Math.floor((uptimeSeconds % 3600) / 60);
    const uptime = `${uptimeHours}h ${uptimeMinutes}m ${Math.floor(uptimeSeconds % 60)}s`;
  
    const serverTime = new Date().toISOString();
    const platform = os.platform();
    const architecture = os.arch();
  
    res.json({
      'API Version': API_VERSION,
      'Environment': ENVIRONMENT,
      'Uptime': uptime,
      'Memory Usage': memoryUsageInGB,
      'CPU Usage': cpuUsage,
      'Server Time': serverTime,
      'Platform': platform,
      'Architecture': architecture,
    });
});

export default router;