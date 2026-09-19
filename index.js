const {
  Client,
  GatewayIntentBits
} = require("discord.js");

const TOKEN = process.env.TOKEN;

if (!TOKEN) {
  console.error("ERRO: TOKEN não configurado no Render.");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("clientReady", () => {
  console.log("BOT ONLINE: " + client.user.tag);
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;

  if (!message.content.startsWith("!under ")) return;

  const texto = message.content.slice(7).trim();

  if (!texto) return;

  try {
    // Apaga a mensagem do utilizador
    await message.delete();

    // Envia apenas a mensagem do bot
    await message.channel.send(texto);

  } catch (error) {
    console.error("ERRO NO UNDER:");
    console.error(error);
  }
});

client.login(TOKEN);
