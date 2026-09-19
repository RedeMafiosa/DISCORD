const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

const http = require("http");

const TOKEN = process.env.TOKEN;

const CLIENT_ID = "1403430139647365180";
const GUILD_ID = "1550134429161230407";

const PORT = process.env.PORT || 3000;

// Servidor HTTP para o Render Web Service
http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/plain"
  });

  res.end("Bot online");
}).listen(PORT, "0.0.0.0", () => {
  console.log("Servidor HTTP ativo na porta " + PORT);
});

if (!TOKEN) {
  console.error("ERRO: TOKEN não configurado no Render.");
  process.exit(1);
}

// Cliente Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

// Comando /msgu + texto
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

// Registar /msgu no servidor
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

// Bot online
client.once("clientReady", () => {
  console.log("BOT ONLINE: " + client.user.tag);
});

// Quando alguém usa /msgu
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName !== "msgu") return;

  const texto = interaction.options.getString("texto", true);

  try {
    // Confirmação privada para quem executou
    await interaction.reply({
      content: "Mensagem enviada.",
      flags: 64
    });

    // Mensagem oficial para todos no canal
    await interaction.channel.send({
      content: texto
    });

    console.log("Mensagem enviada:", texto);

  } catch (error) {
    console.error("ERRO NO /msgu:");
    console.error(error);
  }
});

// Iniciar
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
