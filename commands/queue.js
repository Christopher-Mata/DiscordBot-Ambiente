const {SlashCommandBuilder, EmbedBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows the first 10 songs in the queue"),
    execute: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guild);

        // Checks if we currently have a queue
        if(!queue || !queue.playing) {
            await interaction.reply("There is no song playing.")
            return;
        }

        // Go threw the songs in the queue and return the first 10 and returns the index,
        // durration, title, and who requested the song
        const queueString = queue.tracks.slice(0, 10).map((songs, i) => {
            return `${i + 1}) ${songs.title} - <@${songs.requestedBy.id}>`;
        }).join("\n"); 

        const currentSong = queue.current;

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**currently Playing:** \n\' ${currentSong.title} - <@${currentSong.requestedBy.id}>\n\n**Queue:**\n${queueString}`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}