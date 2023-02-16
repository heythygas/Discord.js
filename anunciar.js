const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("anunciar")
        .setDescription("Anúnciar dev")
        .addStringOption(option =>
            option.setName('message')
                .setDescription('mensagem')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('escolhe o canal')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.user.id !== "1041408414061973624") {
            interaction.reply({
              content: "Você não tem permissão para usar este comando.", ephemeral: true});
            return;
          }
        const message = interaction.options.getString("message")
        const canal = interaction.options.getChannel("canal")
        
        canal.send({content: message})
        interaction.reply({content: "Mensagem Enviada com sucesso.", ephemeral: true})
    }
}