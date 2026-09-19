# Discord Bot — /undermsg

Bot Discord.js v14 preparado para funcionar no Render.

## 1. Criar o bot

No Discord Developer Portal, cria uma aplicação, adiciona um Bot e copia o token.

**Nunca publiques o token no GitHub.**

Também precisas do:
- `CLIENT_ID`: Application ID da aplicação.
- `GUILD_ID`: ID do teu servidor Discord (opcional, mas recomendado para testes).

## 2. Instalar no computador (opcional)

```bash
npm install
npm start
```

## 3. Publicar no GitHub

Envia estes ficheiros para um repositório:
- `index.js`
- `package.json`
- `.gitignore`
- `README.md`

Não envies `node_modules` nem o token.

## 4. Configurar no Render

Cria um serviço do tipo **Background Worker** e liga o repositório do GitHub.

Configuração:
- Build Command: `npm install`
- Start Command: `npm start`

Em Environment Variables adiciona:

```text
TOKEN=O_TOKEN_DO_TEU_BOT
CLIENT_ID=O_APPLICATION_ID
GUILD_ID=O_ID_DO_TEU_SERVIDOR
```

Depois faz Deploy.

## 5. Convidar o bot para o servidor

No Developer Portal, gera o convite OAuth2 com os scopes:
- `bot`
- `applications.commands`

Permissões necessárias para este exemplo:
- View Channels
- Send Messages

## 6. Usar o comando

No Discord:

```text
/undermsg texto: Olá pessoal!
```

O bot envia:

```text
Olá pessoal!
```

## Nota

Se usares `GUILD_ID`, o comando fica registado apenas nesse servidor e normalmente aparece mais rapidamente para testes.
