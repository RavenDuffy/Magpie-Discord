import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import fs from 'fs'

const commands = []
const commandFiles = fs
  .readdirSync(`${__dirname}/commands`)
  .filter((file) => file.endsWith('.ts'))
commandFiles.forEach(async (file) => {
  const command = await import(`${__dirname}/commands/${file}`)
  commands.push(command.data.toJSON())
})

export const RegisterCommands = async (): Promise<void> => {
  const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN)

  try {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    })
    console.log('Commands Registered')
  } catch (error) {
    console.error(error)
  }
}
