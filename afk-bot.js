const mineflayer = require('mineflayer');
const http = require('http');

const config = {
  host: 'Osmanos-2bpS.aternos.me',
  port: 64090,
  username: 'Redbull',
  version: '1.21.8',
  auth: 'offline'
};

const ACTION_INTERVAL = 20000;
const RECONNECT_DELAY = 10000;

let status = 'iniciando';

function createBot() {
  const bot = mineflayer.createBot(config);

  bot.once('spawn', () => {
    status = 'conectado';
    console.log('[AFK Bot] Conectado ao servidor:', config.host);
    startAntiAfkLoop(bot);
  });

  bot.on('kicked', (reason) => {
    status = 'expulso, reconectando';
    console.log('[AFK Bot] Expulso do servidor:', reason);
  });

  bot.on('error', (err) => {
    console.log('[AFK Bot] Erro:', err.message);
  });

  bot.on('end', () => {
    status = 'desconectado, reconectando';
    console.log('[AFK Bot] Desconectado. Reconectando em', RECONNECT_DELAY / 1000, 's...');
    setTimeout(createBot, RECONNECT_DELAY);
  });

  return bot;
}

function startAntiAfkLoop(bot) {
  setInterval(() => {
    try {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);

      const yaw = Math.random() * Math.PI * 2;
      bot.look(yaw, 0, true);
    } catch (e) {
      console.log('[AFK Bot] Falha ao executar ação:', e.message);
    }
  }, ACTION_INTERVAL);
}

const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Status do bot: ' + status);
}).listen(PORT, () => {
  console.log('[AFK Bot] Servidor de status na porta', PORT);
});

createBot();
