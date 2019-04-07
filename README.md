# discord.js-giveaway

## This package allows your bot to have a giveaways function easily.

### Usage

```js
const Discord = require("discord.js")
const client = new Discord.Client()
const Giveaway = require("discord.js-giveaway")

const giveaway = Giveaway(client, {})
//Giveaway has 2 variables: client and options

client.login(token)
```

### Giveaway's options object
| name         | optional | description                                         | default value   | type   |
|--------------|----------|-----------------------------------------------------|-----------------|--------|
| botPrefix    | yes      | This is the prefix your bot will react to.          | "!"             | string |
| startCmd     | yes      | This command starts a giveaway.                     | "giveawaystart" | string |
| giveawayRole | yes      | ID of a role, that is permitted to start giveaways. | null            | string |
| embedColor   | yes      | Color of the giveaway's embed                       | "#7aefe0"       | string |
| reactEmote   | yes      | The emote that you have to react with.              | "✅"             | string |
