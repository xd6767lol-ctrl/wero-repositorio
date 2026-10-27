const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Usar variable de entorno para el token
const BOT_TOKEN = process.env.BOT_TOKEN;

// Caracteres permitidos
const CARACTERES = 'abcdefghijklmnopqrstuvwxyz0123456789_.';

// Generador de combinaciones
function* generar(longitud) {
  const arr = Array(longitud).fill(0);
  while (true) {
    yield arr.map(i => CARACTERES[i]).join('');
    let pos = longitud - 1;
    while (pos >= 0) {
      arr[pos]++;
      if (arr[pos] < CARACTERES.length) break;
      arr[pos] = 0;
      pos--;
    }
    if (pos < 0) break;
  }
}

// Lista de nombres ocupados (editable)
const OCUPADOS = [
  'bot','dev','abc','abd','abe','abf','mod','adm','xyz','usr','sys',
  'test','hola','luna','sol1','max1','neo','fox','ace','act','add'
];

function estaOcupado(nombre) {
  return OCUPADOS.includes(nombre);
}

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith('.check')) return;

  const args = message.content.split(' ');
  const len = parseInt(args[1]);

  if (![3, 4].includes(len)) {
    return message.reply('❌ Usa: `.check 3` o `.check 4`');
  }

  message.reply(`🔍 Buscando nombres de ${len} caracteres...`);

  const generador = generar(len);
  let contador = 0;
  const limite = 100; // Evitar spam excesivo

  for (const nombre of generador) {
    if (contador >= limite) break;
    
    const ocupado = estaOcupado(nombre);
    await message.channel.send(ocupado ? `false/${nombre}` : `true/${nombre}`);
    contador++;
    
    // Pequeña pausa para no spamear tan rápido
    await new Promise(res => setTimeout(res, 300));
  }

  await message.channel.send(`✅ Terminado — Se revisaron ${contador} nombres`);
});

client.login(BOT_TOKEN)
  .then(() => console.log('✅ Bot encendido y listo'))
  .catch(err => console.error('❌ Error:', err.message));
