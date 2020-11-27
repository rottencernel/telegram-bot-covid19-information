require('dotenv').config();
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const Markap = require('telegraf/markup');
const COUNTRIES_LIST = require('./constants');
const img = require('./imj');


const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply(`
Привет ${ctx.message.from.first_name} !
Здесь ты можешь узнать статистику по COVID-19.
Все что нужно сделать: написать название интересующей тебя страны(на английском),
и бот предоставит самую свежую информацию!
Просмотреть весь список стран можно командой /help.
`,
Markap.keyboard([
    ['US', 'Russia'],
    ['Ukraine', 'Belarus'],
    ['tips', '/help'],
])
.resize()
.extra()
)
);

bot.help((ctx) => ctx.reply(COUNTRIES_LIST));
bot.hears('tips', (ctx) => ctx.reply(img));
bot.on('sticker', (ctx) => ctx.reply('👍'));

bot.on('text', async (ctx) => {
  let data = {};
  try{
  data = await api.getReportsByCountries(ctx.message.text);
  const formatData = `
Страна: ${data[0][0].country}
Случаи заражения: ${data[0][0].cases}
Смертей: ${data[0][0].deaths}
Вылечились: ${data[0][0].recovered}
  `;
  ctx.reply(formatData);
  } catch {
    ctx.reply('Название страны написано не коректоб посмотрите команду /help');
  }
});

bot.launch();

