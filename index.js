const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

const TOKEN = process.env.TOKEN;

const CLIENT_ID = "1403430139647365180";
const GUILD_ID = "1550134429161230407";

if (!TOKEN) {
  console.error("ERRO: a variável TOKEN não está configurada no Render.");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const command = new SlashCommandBuilder()
  .setName("under")
  .setDescription("Envia uma mensagem através do bot.")
  .addStringOption(option =>
    option
      .setName("texto")
      .setDescription("Texto que o bot deve enviar.")
      .setRequired(true)
      .setMaxLength(2000)
  );

async function registerCommand() {
  const rest = new REST({ version: "10" }).setToken(TOKEN);

  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    {
      body: [command.toJSON()]
    }
  );

  console.log("Comando /under registado no servidor.");
}

client.once("ready", () => {
  console.log("BOT ONLINE: " + client.user.tag);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName !== "under") return;

  const texto = interaction.options.getString("texto", true);

  try {
    // Responde primeiro à interação
    await interaction.reply({
      content: "Mensagem enviada!",
      flags: 64
    });

    // Obtém o canal diretamente pelo ID
    const channel = await client.channels.fetch(interaction.channelId);

    if (!channel || !channel.isTextBased()) {
      console.error("Não foi possível encontrar o canal.");
      return;
    }

    await channel.send(texto);

  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "Não consegui enviar a mensagem neste canal.",
        flags: 64
      });
    }
  }
});

async function start() {
  try {
    console.log("A registar comando...");

    await registerCommand();

    console.log("A iniciar bot...");

    await client.login(TOKEN);

  } catch (error) {
    console.error("ERRO AO INICIAR O BOT:");
    console.error(error);
    process.exit(1);
  }
}

start();
