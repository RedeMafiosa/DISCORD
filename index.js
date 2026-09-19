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
  console.error("TOKEN não configurado.");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const command = new SlashCommandBuilder()
  .setName("under")
  .setDescription("Envia uma mensagem.")
  .addStringOption(option =>
    option
      .setName("texto")
      .setDescription("Texto da mensagem.")
      .setRequired(true)
      .setMaxLength(2000)
  );

async function start() {
  try {
    console.log("A registar /under...");

    const rest = new REST({ version: "10" }).setToken(TOKEN);

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      {
        body: [command.toJSON()]
      }
    );

    console.log("/under registado.");

    await client.login(TOKEN);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

client.once("clientReady", () => {
  console.log("BOT ONLINE: " + client.user.tag);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "under") {
    const texto = interaction.options.getString("texto", true);

    console.log("COMANDO UNDER RECEBIDO:", texto);

    await interaction.reply({
      content: texto
    });
  }
});

start();
