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
  console.error("ERRO: TOKEN não configurado no Render.");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const command = new SlashCommandBuilder()
  .setName("msgu")
  .setDescription("Envia uma mensagem oficial.");

async function registerCommand() {
  const rest = new REST({ version: "10" }).setToken(TOKEN);

  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    {
      body: [command.toJSON()]
    }
  );

  console.log("Comando /msgu registado.");
}

client.once("clientReady", () => {
  console.log("BOT ONLINE: " + client.user.tag);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "msgu") return;

  try {
    await interaction.reply({
      content: "Mensagem oficial enviada.",
      ephemeral: true
    });

    await interaction.channel.send({
      content: "Mensagem oficial do bot."
    });

  } catch (error) {
    console.error("ERRO NO /msgu:");
    console.error(error);
  }
});

async function start() {
  try {
    await registerCommand();
    await client.login(TOKEN);
  } catch (error) {
    console.error("ERRO AO INICIAR:");
    console.error(error);
    process.exit(1);
  }
}

start();
