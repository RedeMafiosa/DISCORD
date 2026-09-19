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
  console.error("ERRO: A variável TOKEN não está configurada no Render.");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

// Comando /msgu
const command = new SlashCommandBuilder()
  .setName("msgu")
  .setDescription("Envia uma mensagem oficial do bot.");

async function registerCommand() {
  const rest = new REST({ version: "10" }).setToken(TOKEN);

  console.log("A registar o comando /msgu...");

  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    {
      body: [command.toJSON()]
    }
  );

  console.log("/msgu registado com sucesso!");
}

client.once("clientReady", () => {
  console.log("BOT ONLINE: " + client.user.tag);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName !== "msgu") return;

  try {
    // Confirma apenas para quem executou o comando
    await interaction.reply({
      content: "Mensagem enviada.",
      ephemeral: true
    });

    // Mensagem normal do bot para todos
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
    console.log("A iniciar...");

    await registerCommand();

    await client.login(TOKEN);

  } catch (error) {
    console.error("ERRO AO INICIAR O BOT:");
    console.error(error);
    process.exit(1);
  }
}

start();
