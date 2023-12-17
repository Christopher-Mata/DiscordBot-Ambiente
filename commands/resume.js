const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the current song."),
    execute: async({client, interaction}) => {
        
        // Get the queue specific to the server that we are in
        const queue = client.player.getQueue(interaction.guild);

        if(!queue) {
            await interaction.reply("There is no song playing.")
            return;
        }

        queue.setPaused(false);

        await interaction.reply("Resumed playing.")
    }
}