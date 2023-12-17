const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the current song."),
    execute: async({client, interaction}) => {
        
        // Get the queue specific to the server that we are in
        const queue = client.player.getQueue(interaction.guild);

        if(!queue) {
            await interaction.reply("There is no song playing.")
            return;
        }

        queue.setPaused(true);

        await interaction.reply("The current song has been paused.")
    }
}