import { ServerConfig } from '../types';

export interface ServerPingStatus {
  online: boolean;
  serverIp: string;
  port: number;
  bedrockPort: number;
  version: string;
  players: {
    online: number;
    max: number;
  };
  ping: number; // latency in ms
  motd: string;
  uptime: string;
  lastChecked: number;
  subServers: {
    id: string;
    name: string;
    players: number;
    max: number;
    status: 'ONLINE' | 'OFFLINE';
  }[];
}

// Internal simulated state so counts evolve naturally over time
let lastPingOnline = 1428;
let forceOffline = false;

export const setMockServerOffline = (offline: boolean) => {
  forceOffline = offline;
};

/**
 * Mock API Fetch function for real-time Minecraft server status.
 * Simulates a real Minecraft query/ping API (like mcstatus.io / minetools)
 * with network latency, live player fluctuations, and ping latency.
 */
export async function fetchServerStatus(config?: Partial<ServerConfig>): Promise<ServerPingStatus> {
  // Simulate realistic network latency (250ms - 450ms)
  const delay = Math.floor(Math.random() * 200) + 250;
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (forceOffline) {
    return {
      online: false,
      serverIp: config?.serverIp || 'play.cryonmc.net',
      port: config?.serverPort || 25565,
      bedrockPort: config?.bedrockPort || 19132,
      version: '1.20.4 - 1.21.x',
      players: {
        online: 0,
        max: config?.maxPlayers || 2000,
      },
      ping: 999,
      motd: 'CryonMC Network - Offline for Maintenance',
      uptime: '0%',
      lastChecked: Date.now(),
      subServers: [
        { id: 'lifesteal', name: 'Lifesteal SMP', players: 0, max: 800, status: 'OFFLINE' },
        { id: 'survival', name: 'Crystal Survival', players: 0, max: 600, status: 'OFFLINE' },
        { id: 'bedwars', name: 'BedWars & Duels', players: 0, max: 600, status: 'OFFLINE' },
      ],
    };
  }

  // Calculate natural player count variation (+/- 1-4 players)
  const baseCount = config?.currentOnline || 1428;
  const variation = Math.floor(Math.random() * 7) - 3;
  lastPingOnline = Math.max(10, Math.min(config?.maxPlayers || 2000, (lastPingOnline || baseCount) + variation));

  // Latency with realistic jitter (18ms - 32ms)
  const ping = Math.floor(Math.random() * 14) + 18;

  const lifestealPlayers = Math.floor(lastPingOnline * 0.48);
  const survivalPlayers = Math.floor(lastPingOnline * 0.32);
  const bedwarsPlayers = Math.max(0, lastPingOnline - lifestealPlayers - survivalPlayers);

  return {
    online: true,
    serverIp: config?.serverIp || 'play.cryonmc.net',
    port: config?.serverPort || 25565,
    bedrockPort: config?.bedrockPort || 19132,
    version: '1.20.4 - 1.21.x',
    players: {
      online: lastPingOnline,
      max: config?.maxPlayers || 2000,
    },
    ping,
    motd: config?.serverName
      ? `✦ ${config.serverName.toUpperCase()} NETWORK ✦ [1.20 - 1.21] LIFESTEAL & SURVIVAL`
      : '✦ CRYONMC NETWORK ✦ [1.20 - 1.21] LIFESTEAL & SURVIVAL',
    uptime: '99.98%',
    lastChecked: Date.now(),
    subServers: [
      { id: 'lifesteal', name: 'Lifesteal SMP', players: lifestealPlayers, max: 800, status: 'ONLINE' },
      { id: 'survival', name: 'Crystal Survival', players: survivalPlayers, max: 600, status: 'ONLINE' },
      { id: 'bedwars', name: 'BedWars & Duels', players: bedwarsPlayers, max: 600, status: 'ONLINE' },
    ],
  };
}
