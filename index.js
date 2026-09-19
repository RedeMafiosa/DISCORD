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

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const command = new SlashCommandBuilder()
  .setName("msgu")
  .setDescription("Envia uma mensagem oficial.");

async function registerCommand() {
  const rest = new REST({ version: "10" }).setToken(TOKEN);

  console.log("A registar /msgu...");

  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    {
      body: [command.toJSON()]
    }
  );

  console.log("/msgu REGISTADO COM SUCESSO!");
}

client.once("clientReady", () => {
  console.log("BOT ONLINE: " + client.user.tag);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "msgu") {
    await interaction.reply({
      content: "Mensagem oficial enviada.",
      ephemeral: true
    });

    await interaction.channel.send("Mensagem oficial do bot.");
  }
});

async function start() {
  try {
    await registerCommand();
    await client.login(TOKEN);
  } catch (error) {
    console.error("ERRO:");
    console.error(error);
  }
}

start();
