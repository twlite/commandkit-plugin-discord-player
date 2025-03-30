# CommandKit Plugin Discord Player

This is a CommandKit plugin that allows you to use commandkit's event system to listen to discord-player events and also registers discord-player context.

## Installation

```bash
npm install commandkit-plugin-discord-player
```

## Usage

In your `commandkit.config.ts` file, the plugin like this:

```ts
import { defineConfig } from 'commandkit';
import { discordPlayer } from 'commandkit-plugin-discord-player';

export default defineConfig({
  plugins: [discordPlayer()],
});
```

Your bot will now be able to use discord-player events and hooks.

## Options

The plugin accepts the following options:

- `queueEventsNamespace`: The namespace for the queue events. Defaults to `discord-player` (aka uses `(discord-player)` folder).
- `playerEventsNamespace`: The namespace for the player events. Defaults to `discord-player-main` (aka uses `(discord-player-main)` folder).
