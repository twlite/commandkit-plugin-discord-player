import {
  CommandKitEnvironment,
  CommandKitPluginRuntime,
  Logger,
  PreparedAppCommandExecution,
  RuntimePlugin,
} from 'commandkit';
import { useMainPlayer, GuildQueueEvent, PlayerEvent } from 'discord-player';
import { Interaction, Message } from 'discord.js';

const DP_QUEUE_EVENTS = 'discord-player';
const DP_PLAYER_EVENTS = 'discord-player-main';

export interface DiscordPlayerPluginOptions {
  /**
   * Namespace for queue events.
   * @default 'discord-player'
   */
  queueEventsNamespace?: string;
  /**
   * Namespace for player events.
   * @default 'discord-player-main'
   */
  playerEventsNamespace?: string;
}

export class DiscordPlayerPlugin extends RuntimePlugin<DiscordPlayerPluginOptions> {
  public readonly name = 'DiscordPlayerPlugin';

  public async activate(ctx: CommandKitPluginRuntime): Promise<void> {
    Logger.info('DiscordPlayerPlugin activated');

    if (ctx.commandkit.client.isReady()) {
      this.initialize(ctx);
    } else {
      ctx.commandkit.client.once('ready', () => {
        this.initialize(ctx);
      });
    }
  }

  public async deactivate(ctx: CommandKitPluginRuntime): Promise<void> {
    Logger.info('DiscordPlayerPlugin deactivated');
  }

  public async executeCommand(
    ctx: CommandKitPluginRuntime,
    env: CommandKitEnvironment,
    source: Interaction | Message,
    command: PreparedAppCommandExecution,
    execute: () => Promise<any>
  ): Promise<boolean> {
    if (!source.inGuild()) return false;

    const player = useMainPlayer();

    await player.context.provide({ guild: source.guild! }, execute);

    return true;
  }

  private initialize(ctx: CommandKitPluginRuntime) {
    const player = useMainPlayer();

    const queueEvents = Array.from(new Set(Object.values(GuildQueueEvent)));
    const playerEvents = Array.from(new Set(Object.values(PlayerEvent)));

    queueEvents.forEach((event) => {
      player.events.on(event, (...args: any[]) => {
        ctx.commandkit.events
          .to(this.options.queueEventsNamespace!)
          .emit(event, ...args);
      });
    });

    playerEvents.forEach((event) => {
      player.on(event, (...args: any[]) => {
        ctx.commandkit.events
          .to(this.options.playerEventsNamespace!)
          .emit(event, ...args);
      });
    });
  }
}

export function discordPlayer(options?: DiscordPlayerPluginOptions) {
  return new DiscordPlayerPlugin({
    playerEventsNamespace: options?.playerEventsNamespace ?? DP_PLAYER_EVENTS,
    queueEventsNamespace: options?.queueEventsNamespace ?? DP_QUEUE_EVENTS,
  });
}
