const { Events, Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits, ChannelType, PermissionsBitField } = require("discord.js");
const Discord = require("discord.js");
const {QuickDB} = require("quick.db");
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Create a ticket on the server")
    .addStringOption(option =>
        option.setName('about')
            .setDescription('Select Category')
            .setRequired(true)
            .addChoices(
                { name: 'questions', value: 'Questions' },
                { name: 'purchase', value: 'Purchase' },
            ))
    .setDMPermission(false),
    async execute(interaction) {
        const category = interaction.options.getString('about');
        const channel = interaction.guild.channels.cache.find(channel => channel.name.includes(`ticket-${interaction.user.id}`));
        if(channel){
            interaction.reply({content: "You already have an open ticket.", ephemeral: true})
            return false;
        }
        
        interaction.guild.channels.create({
            name: `ticket-${interaction.user.id}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
            ],
        }).then(async createdChannel => {
            console.log(`NOVO TICKET CRIADO: ${createdChannel.name} no servidor: ${interaction.guild.name}`);
            const avatarURL = interaction.user.displayAvatarURL({dynamic: true});
            const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('ticket')
					.setLabel('🔒 Close Ticket')
					.setStyle(ButtonStyle.Danger),
            );
            let embed = new Discord.EmbedBuilder()
            .setTitle("NEW TICKET!")
            .setThumbnail(avatarURL)
            .setDescription(`Topic: \`${category}\`\nUser: \`${interaction.user.tag}\``)
            .setColor("#36393f")
            .setFooter({ text: 'Wezy | Made by ! Thiago.#6985', iconURL: interaction.user.displayAvatarURL({dynamic: true}) });
            interaction.reply({content: `Ticket successfully created. ${createdChannel}`, ephemeral: true})
            await createdChannel.send({content : `${interaction.user}`, embeds: [embed], components: [row]});
        }).catch(err => {
            console.error(`Erro ao criar o canal: ${err}`);
        });
    }
}