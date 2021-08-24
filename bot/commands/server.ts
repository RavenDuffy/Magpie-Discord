import { SlashCommandBuilder } from '@discordjs/builders'

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Returns the general server info'),
  async execute(interaction) {
    await interaction.reply(
      `Server: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    )
  },
}
