import type * as Party from "partykit/server";

// Message types
interface JoinMessage {
  type: "join";
  playerName: string;
  playerId: string;
}

interface StartGameMessage {
  type: "start_game";
}

interface GameActionMessage {
  type: "game_action";
  action: unknown;
  playerId: string;
}

interface SyncStateMessage {
  type: "sync_state";
  state: unknown;
}

interface PingMessage {
  type: "ping";
}

interface PlayerInfo {
  id: string;
  name: string;
  connectionId: string;
  isHost: boolean;
  isReady: boolean;
}

interface RoomState {
  players: PlayerInfo[];
  gameStarted: boolean;
  gameState: unknown | null;
  hostId: string | null;
}

type IncomingMessage = JoinMessage | StartGameMessage | GameActionMessage | SyncStateMessage | PingMessage;

export default class GameRoom implements Party.Server {
  // Enable hibernation to prevent connection drops during idle periods
  static options = {
    hibernate: true,
  };

  room: RoomState = {
    players: [],
    gameStarted: false,
    gameState: null,
    hostId: null,
  };

  // Track last ping time for each connection
  lastPingTime: Map<string, number> = new Map();

  constructor(readonly party: Party.Party) { }

  async onStart() {
    try {
      // Load persisted state if exists
      // VERSION BUMP: Changed key to 'room_v2' to force reset all old rooms
      const stored = await this.party.storage.get<RoomState>("room_v2");
      if (stored) {
        this.room = stored;
      }
    } catch (error) {
      console.error("[GameRoom] Error in onStart:", error);
    }
  }

  async saveState() {
    try {
      await this.party.storage.put("room_v2", this.room);
    } catch (error) {
      console.error("[GameRoom] Error saving state:", error);
    }
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    try {
      console.log(`[GameRoom] New connection: ${conn.id}`);

      // Track connection time
      this.lastPingTime.set(conn.id, Date.now());

      // Send current room state to new connection
      conn.send(JSON.stringify({
        type: "room_state",
        room: {
          players: this.room.players,
          gameStarted: this.room.gameStarted,
          hostId: this.room.hostId,
        },
        gameState: this.room.gameState,
      }));
    } catch (error) {
      console.error("[GameRoom] Error in onConnect:", error);
    }
  }

  async onClose(conn: Party.Connection) {
    try {
      console.log(`[GameRoom] Connection closed: ${conn.id}`);

      // Clean up ping tracking
      this.lastPingTime.delete(conn.id);

      // Find the disconnected player
      const playerIndex = this.room.players.findIndex(p => p.connectionId === conn.id);
      if (playerIndex !== -1) {
        const player = this.room.players[playerIndex];
        console.log(`[GameRoom] Player disconnected: ${player.name} (${player.id}), game started: ${this.room.gameStarted}`);

        // If game is in progress, DON'T remove the player - let them rejoin
        // Just clear their connectionId so we know they're disconnected
        if (this.room.gameStarted) {
          console.log(`[GameRoom] Keeping player ${player.name} in roster for potential rejoin`);
          player.connectionId = ''; // Mark as disconnected but keep in list

          // If this was the host, transfer host to first connected player
          if (player.isHost) {
            const connectedPlayer = this.room.players.find(p => p.connectionId !== '');
            if (connectedPlayer) {
              connectedPlayer.isHost = true;
              this.room.hostId = connectedPlayer.id;
              player.isHost = false;
            }
          }

          // Broadcast player disconnect (but not removal)
          this.party.broadcast(JSON.stringify({
            type: "player_left",
            playerId: player.id,
            players: this.room.players,
            hostId: this.room.hostId,
            gameStarted: this.room.gameStarted,
            playerDisconnected: true, // Signal this is a disconnect, not a leave
          }));

          await this.saveState();
          return;
        }

        // Game not started - fully remove player
        this.room.players.splice(playerIndex, 1);

        // If room is empty, RESET state logic via DELETION
        if (this.room.players.length === 0) {
          this.room = {
            players: [],
            gameStarted: false,
            gameState: null,
            hostId: null,
          };
          // Explicitly delete storage to ensure hard reset
          await this.party.storage.delete("room_v2");
          return;
        }

        // If host left, assign new host
        if (player.isHost && this.room.players.length > 0) {
          this.room.players[0].isHost = true;
          this.room.hostId = this.room.players[0].id;
        }

        // Broadcast player left - MUST include gameStarted to prevent clients from resetting
        this.party.broadcast(JSON.stringify({
          type: "player_left",
          playerId: player.id,
          players: this.room.players,
          hostId: this.room.hostId,
          gameStarted: this.room.gameStarted,
        }));

        await this.saveState();
      }
    } catch (error) {
      console.error("[GameRoom] Error in onClose:", error);
    }
  }

  async onMessage(message: string, sender: Party.Connection) {
    try {
      const data = JSON.parse(message) as IncomingMessage;

      switch (data.type) {
        // Handle ping for keep-alive
        case "ping": {
          this.lastPingTime.set(sender.id, Date.now());
          sender.send(JSON.stringify({ type: "pong" }));
          break;
        }

        case "join": {
          // Check if game already started
          if (this.room.gameStarted) {
            // Allow rejoin if player was in game (match by ID first, then by name as fallback)
            let existingPlayer = this.room.players.find(p => p.id === data.playerId);

            // If no ID match, try matching by name (for reconnections where session ID changed)
            if (!existingPlayer) {
              existingPlayer = this.room.players.find(p => p.name === data.playerName);
              if (existingPlayer) {
                console.log(`[GameRoom] Player rejoining by name: ${data.playerName} (old ID: ${existingPlayer.id}, new ID: ${data.playerId})`);
                // Update the player ID to the new one
                existingPlayer.id = data.playerId;
              }
            }

            if (existingPlayer) {
              existingPlayer.connectionId = sender.id;
              sender.send(JSON.stringify({
                type: "rejoined",
                room: {
                  players: this.room.players,
                  gameStarted: this.room.gameStarted,
                  hostId: this.room.hostId,
                },
                gameState: this.room.gameState,
              }));
              // Also save state so the new connectionId is persisted
              await this.saveState();
              return;
            }
            sender.send(JSON.stringify({
              type: "error",
              message: "Game already in progress",
            }));
            return;
          }

          // Check if room is full (max 5 players)
          if (this.room.players.length >= 5) {
            sender.send(JSON.stringify({
              type: "error",
              message: "Room is full",
            }));
            return;
          }

          // Check if player ID already exists
          const existingPlayer = this.room.players.find(p => p.id === data.playerId);
          if (existingPlayer) {
            existingPlayer.connectionId = sender.id;
            existingPlayer.name = data.playerName;
          } else {
            // Add new player
            const isHost = this.room.players.length === 0;
            const player: PlayerInfo = {
              id: data.playerId,
              name: data.playerName,
              connectionId: sender.id,
              isHost,
              isReady: false,
            };
            this.room.players.push(player);
            if (isHost) {
              this.room.hostId = player.id;
            }
          }

          // Broadcast updated player list
          this.party.broadcast(JSON.stringify({
            type: "player_joined",
            players: this.room.players,
            hostId: this.room.hostId,
          }));

          await this.saveState();
          break;
        }

        case "start_game": {
          // Only host can start
          const starter = this.room.players.find(p => p.connectionId === sender.id);
          if (!starter?.isHost) {
            sender.send(JSON.stringify({
              type: "error",
              message: "Only the host can start the game",
            }));
            return;
          }

          // Need at least 2 players
          if (this.room.players.length < 2) {
            sender.send(JSON.stringify({
              type: "error",
              message: "Need at least 2 players to start",
            }));
            return;
          }

          this.room.gameStarted = true;

          // Broadcast game start
          this.party.broadcast(JSON.stringify({
            type: "game_started",
            players: this.room.players,
          }));

          await this.saveState();
          break;
        }

        case "game_action": {
          // Validate it's from active player (done on client, but could add server validation)
          // Broadcast action to all players
          this.party.broadcast(JSON.stringify({
            type: "game_action",
            action: data.action,
            playerId: data.playerId,
          }), [sender.id]); // Don't send back to sender

          break;
        }

        case "sync_state": {
          // Host syncs authoritative state
          const syncer = this.room.players.find(p => p.connectionId === sender.id);
          if (syncer?.isHost) {
            this.room.gameState = data.state;

            // Broadcast to all other players, include players list for ID mapping
            this.party.broadcast(JSON.stringify({
              type: "state_sync",
              state: data.state,
              players: this.room.players,
            }), [sender.id]);

            await this.saveState();
          }
          break;
        }
      }
    } catch (error) {
      console.error("[GameRoom] Error in onMessage:", error);
      // Send error to the sender so they know something went wrong
      try {
        sender.send(JSON.stringify({
          type: "error",
          message: "Server error processing message",
        }));
      } catch {
        // Ignore send errors
      }
    }
  }
}

