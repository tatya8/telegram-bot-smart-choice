const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GUIDE_URL = process.env.GUIDE_URL || "";
const PRODUCTS_URL = process.env.PRODUCTS_URL || "";
const TG = TOKEN ? `https://api.telegram.org/bot${TOKEN}` : "";

async function tg(method, body) {
  if (!TOKEN) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  const r = await fetch(`${TG}/${method}`, {method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
  if (!r.ok) throw new Error(`Telegram API ${r.status}: ${await r.text()}`);
  return r.json();
}
const keyboard = {inline_keyboard:[
  [{text:"С чего начать поиск",callback_data:"start_search"}],
  [{text:"Архивный маршрут",callback_data:"archive"},{text:"Разобрать находку",callback_data:"finding"}],
  [{text:"Бесплатный гайд",callback_data:"guide"},{text:"Материалы",callback_data:"products"}]
]};
const texts={
 welcome:"Здравствуйте! Я помощник по семейной истории. Помогу понять, с чего начать поиск предков, как двигаться по архивам и как фиксировать находки.\n\nВыберите, что нужно сейчас:",
 start_search:"Начните с четырёх шагов:\n\n1. Расспросите старших родственников и запишите разговор.\n2. Соберите домашние документы и подпишите старые фотографии.\n3. Составьте черновое древо: ФИО, даты, места, родство.\n4. Отметьте пробелы — именно они станут поисковыми задачами.\n\nНе пытайтесь сразу найти весь род: двигайтесь от известного к неизвестному.",
 archive:"Чтобы выбрать архив, сначала определите: КОГО ищем, ГДЕ он жил и КОГДА. Затем ищем метрические книги/ЗАГС, переписи и ревизии, похозяйственные книги, воинский учёт, переселенческие и репрессивные дела.\n\nДля запроса нужны ФИО, ориентировочный год, населённый пункт и конкретное событие.",
 finding:"Пришлите текст находки или основные сведения из документа: имя, год, место и тип записи. Бот подскажет, какие факты выписать и какой следующий источник искать."
};
async function send(chat_id,text,reply_markup=keyboard){return tg("sendMessage",{chat_id,text,reply_markup,disable_web_page_preview:true});}
export default async function handler(req,res){
  if(req.method==="GET") return res.status(200).json({ok:true,service:"genealogy-telegram-bot",configured:Boolean(TOKEN)});
  if(req.method!=="POST") return res.status(405).end();
  try{
    const u=req.body||{};
    if(u.message){
      const chat=u.message.chat.id;
      const txt=(u.message.text||"").trim();
      if(txt==="/start"||txt==="/menu") await send(chat,texts.welcome);
      else await send(chat,"Я пока работаю через меню. Выберите нужный раздел:",keyboard);
    } else if(u.callback_query){
      const q=u.callback_query; await tg("answerCallbackQuery",{callback_query_id:q.id});
      const chat=q.message.chat.id;
      if(q.data==="guide") await send(chat,GUIDE_URL?`Бесплатный гайд «С чего начать поиск предков»:\n${GUIDE_URL}`:"Гайд подготовлен. Ссылка появится здесь после подключения файла.");
      else if(q.data==="products") await send(chat,PRODUCTS_URL?`Дополнительные материалы для самостоятельного поиска:\n${PRODUCTS_URL}`:"Раздел материалов готовится к подключению.");
      else await send(chat,texts[q.data]||texts.welcome);
    }
    return res.status(200).json({ok:true});
  }catch(e){console.error(e); return res.status(500).json({ok:false,error:e.message});}
}