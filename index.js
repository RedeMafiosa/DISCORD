```js
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

// O TOKEN deve ser configurado no Render como variável de ambiente.
// NÃO coloque o token diretamente neste arquivo.
const TOKEN = process.env.TOKEN;

const CLIENT_ID = "1403430139647365180";
const GUILD_ID = process.env.GUILD_ID; // opcional

if (!TOKEN || !CLIENT_ID) {
  console.error("Falta a variável TOKEN no Render.");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const command = new SlashCommandBuilder()
  .setName("undermsg")
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

  if (GUILD_ID) {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: [command.toJSON()] }
    );
    console.log("Comando /under registado neste servidor.");
  } else {
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: [command.toJSON()] }
    );
    console.log("Comando /under registado globalmente.");
  }
}

client.once("ready", () => {
  console.log(`Bot online como ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "under") return;

  const texto = interaction.options.getString("texto", true);

  try {
    await interaction.channel.send(texto);

    await interaction.reply({
      content: "Mensagem enviada!",
      ephemeral: true
    });
  } catch (error) {
    console.error(error);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "Não consegui enviar a mensagem neste canal.",
        ephemeral: true
      });
    }
  }
});

(async () => {
  try {
    await registerCommand();
    await client.login(TOKEN);
  } catch (error) {
    console.error("Erro ao iniciar o bot:", error);
    process.exit(1);
  }
})();
```
