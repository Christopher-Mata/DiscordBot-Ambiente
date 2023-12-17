const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("Exits the voice channel"),
    execute: async({client, interaction}) => {
        
        // Get the queue specific to the server that we are in
        const queue = client.player.getQueue(interaction.guild);

        if(!queue) {
            await interaction.reply("There is no song playing.")
            return;
        }

        queue.destroy();

        await interaction.reply("Leaving the voice channel.")
    }
}