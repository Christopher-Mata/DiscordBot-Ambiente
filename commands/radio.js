const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { QueryType } = require("discord-player");

//TODO: make it play on a pregenerated Youtube or Spotify music playlist
module.exports = {
	data: new SlashCommandBuilder()
		.setName("radio")
		.setDescription("Playes a 24/7 music genre.")
		.addSubcommand(subcommand =>
			subcommand
				.setName("lofi")
				.setDescription("Playes the current 24/7 lofi station.")
		)``
        .addSubcommand(subcommand =>
			subcommand
				.setName("edm")
				.setDescription("Plays the current 24/7 EDM station")
        ),
        execute: async ({ client, interaction }) => {
            // Make sure the user is inside a voice channel
            if (!interaction.member.voice.channel) 
            return interaction.reply("You need to be in a Voice Channel to play a song.");
    
            // Create a play queue for the server
            let queue = await client.player.createQueue(interaction.guild);

            if (!queue.connection)
            {
                await queue.connect(interaction.member.voice.channel)
            } else {
                queue.clear();
            }
            
            client.player.on('channelEmpty', (queue) => {
                if (queue.connection) {
                    queue.connection.disconnect();
                }
            });


            let embed = new EmbedBuilder()

		if (interaction.options.getSubcommand() === "lofi")
        {
            let url = "https://www.youtube.com/playlist?list=PLGD7s2sdIhjgTOsPeAweo-SFcYxUHmMUC"
            
            // Search for the song using the discord-player
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            // finish if no tracks were found
            if (result.tracks.length === 0) 
            {
                return interaction.reply("Lofi station currently offline, working on a fix soon!")
            }

            await queue.addTracks(result.tracks);
            queue.shuffle();
            

             // Play the song
            if (!queue.playing)
            {
                await queue.play()
                
            } else {
                queue.skip();
                
            }

        
            embed
                .setDescription(`Now playing the lofi station. To get the current song thats playing, just type /current`)

		}
        else if (interaction.options.getSubcommand() === "edm")
        {
            let url = "https://www.youtube.com/playlist?list=PLGD7s2sdIhjhCW3LQPUdSBV4W3RmZdqTd&jct=3ycUdsXj5Tj0DMg_Ur5oIWfYmnJmQQ"
            
            // Search for the song using the discord-player
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            // finish if no tracks were found
            if (result.tracks.length === 0)
            {
                return interaction.reply("EDM station currently offline, working on a fix soon!")
            }
            
            await queue.addTracks(result.tracks);
            queue.shuffle();

             // Play the song
            if (!queue.playing)
            {
                await queue.play()
                
            } else {
                queue.skip()
                
            }

            embed
                .setDescription(`Now playing the lofi station. To get the current song thats playing, just type /current`)

		}

        await interaction.reply({
            embeds: [embed]
        })
    }
}