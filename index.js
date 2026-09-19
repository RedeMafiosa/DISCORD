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

// /msgu + texto
const command = new SlashCommandBuilder()
  .setName("msgu")
  .setDescription("Envia uma mensagem oficial do bot.")
  .addStringOption(option =>
    option
      .setName("texto")
      .setDescription("Texto que o bot vai enviar")
      .setRequired(true)
      .setMaxLength(2000)
  );

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

  const texto = interaction.options.getString("texto", true);

  try {
    // Resposta privada para quem executou o comando
    await interaction.reply({
      content: "Mensagem enviada.",
      flags: 64
    });

    // Mensagem oficial visível para todos
    await interaction.channel.send({
      content: texto
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
