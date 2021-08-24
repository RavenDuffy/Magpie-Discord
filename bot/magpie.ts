import { Client, Collection, Intents } from 'discord.js'
import dotenv from 'dotenv'
import fs from 'fs'
import { RegisterCommands } from './pack-commands'

dotenv.config()

declare module 'discord.js' {
  interface Client {
    [key: string]: string | unknown
    commands: Collection<unknown, Command>
  }
  interface Command {
    name: string
    description: string
    execute(message: CommandInteraction, args?: string[]): unknown
  }
}

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})

client.commands = new Collection()
const commandFiles = fs
  .readdirSync(`${__dirname}/commands`)
  .filter((file) => file.endsWith('.ts'))

commandFiles.forEach(async (file) => {
  const command = await import(`${__dirname}/commands/${file}`)
  client.commands.set(command.data.name, command)
})

client.once('ready', () => {
  RegisterCommands()
  console.log('Connected to the following servers:')
  client.guilds.cache.forEach((g) => console.log(` - ${g.name}`))
  console.log()
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return

  const command = client.commands.get(interaction.commandName)

  if (!command) return

  try {
    console.log(5)
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    await interaction.reply({
      content: 'whoops, I encountered an error',
      ephemeral: true,
    })
  }
})

client.login(process.env.DISCORD_TOKEN)
