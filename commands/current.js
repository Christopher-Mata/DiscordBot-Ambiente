const {SlashCommandBuilder, EmbedBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("current")
        .setDescription("displayes the current song"),
    execute: async({client, interaction}) => {
        
        // Get the queue specific to the server that we are in
        if(!queue) {
            await interaction.reply("There is no song playing.")
            return;
        }

        const currentSong = queue.current;

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Song: \n **${currentSong.title}**`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}