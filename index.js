const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

const http = require("http");

// =====================================================
// CONFIGURAÇÃO
// =====================================================

const TOKEN = process.env.TOKEN;

const CLIENT_ID = "1403430139647365180";
const GUILD_ID = "1550134429161230407";

const PORT = process.env.PORT || 10000;

// =====================================================
// VERIFICAR TOKEN
// =====================================================

if (!TOKEN) {
  console.error("ERRO: TOKEN não está configurado no Render.");
  process.exit(1);
}

// =====================================================
// SERVIDOR HTTP
// =====================================================

const server = http.createServer(function (req, res) {
  if (req.url === "/health") {
    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
      status: "ok",
      bot: client.isReady()
    }));

    return;
  }

  res.writeHead(200, {
    "Content-Type": "text/plain; charset=utf-8"
  });

  res.end("Bot online");
});

server.listen(PORT, "0.0.0.0", function () {
  console.log("Servidor HTTP ativo na porta " + PORT);
});

// =====================================================
// CLIENTE DISCORD
// =====================================================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

// =====================================================
// COMANDO /MSGU
// =====================================================

const command = new SlashCommandBuilder()
  .setName("msgu")
  .setDescription("Envia uma mensagem oficial do bot.")
  .addStringOption(function (option) {
    return option
      .setName("texto")
      .setDescription("Texto que o bot vai enviar")
      .setRequired(true)
      .setMaxLength(2000);
  });

// =====================================================
// REGISTAR /MSGU
// =====================================================

async function registerCommand() {
  console.log("A registar o comando /msgu...");

  const rest = new REST({
    version: "10"
  }).setToken(TOKEN);

  try {
    await rest.put(
      Routes.applicationGuildCommands(
        CLIENT_ID,
        GUILD_ID
      ),
      {
        body: [command.toJSON()]
      }
    );

    console.log("/msgu registado com sucesso!");
  } catch (error) {
    console.error("ERRO AO REGISTAR /msgu:");
    console.error(error);

    throw error;
  }
}

// =====================================================
// BOT ONLINE
// =====================================================

client.once("clientReady", async function () {
  console.log("----------------------------------------");
  console.log("BOT ONLINE: " + client.user.tag);
  console.log("ID DO BOT: " + client.user.id);
  console.log("----------------------------------------");

  try {
    await registerCommand();
  } catch (error) {
    console.error("Não foi possível registar o /msgu.");
  }
});

// =====================================================
// /MSGU
// =====================================================

client.on("interactionCreate", async function (interaction) {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  if (interaction.commandName !== "msgu") {
    return;
  }

  console.log("----------------------------------------");
  console.log("/msgu recebido!");
  console.log("Utilizador: " + interaction.user.tag);
  console.log("Canal: " + interaction.channelId);
  console.log("----------------------------------------");

  try {
    const texto = interaction.options.getString(
      "texto",
      true
    );

    // Responder imediatamente ao Discord
    await interaction.reply({
      content: "Mensagem enviada.",
      ephemeral: true
    });

    console.log("Interação respondida.");

    if (!interaction.channel) {
      console.error("ERRO: canal não encontrado.");
      return;
    }

    // Enviar a mensagem no canal
    await interaction.channel.send({
      content: texto
    });

    console.log("Mensagem enviada com sucesso:");
    console.log(texto);

  } catch (error) {
    console.error("----------------------------------------");
    console.error("ERRO NO /msgu:");
    console.error(error);
    console.error("----------------------------------------");

    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "Ocorreu um erro ao enviar a mensagem.",
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: "Ocorreu um erro ao executar o comando.",
          ephemeral: true
        });
      }
    } catch (replyError) {
      console.error("ERRO AO RESPONDER AO DISCORD:");
      console.error(replyError);
    }
  }
});

// =====================================================
// LOGIN
// =====================================================

async function start() {
  try {
    console.log("A iniciar...");

    await client.login(TOKEN);

  } catch (error) {
    console.error("----------------------------------------");
    console.error("ERRO AO FAZER LOGIN NO DISCORD:");
    console.error(error);
    console.error("----------------------------------------");

    process.exit(1);
  }
}

start();

// =====================================================
// ERROS GLOBAIS
// =====================================================

process.on("unhandledRejection", function (error) {
  console.error("UNHANDLED REJECTION:");
  console.error(error);
});

process.on("uncaughtException", function (error) {
  console.error("UNCAUGHT EXCEPTION:");
  console.error(error);
});
