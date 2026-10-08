# Genealogy Telegram Bot

Telegram-бот для проекта «История рода».

## Готово
- /start и /menu
- кнопочное меню
- «С чего начать поиск»
- «Архивный маршрут»
- «Разобрать находку»
- бесплатный гайд
- раздел цифровых материалов
- health-check GET /api/webhook

## Переменные окружения
- TELEGRAM_BOT_TOKEN — токен из BotFather (секрет)
- GUIDE_URL — публичная ссылка на бесплатный PDF-гайд
- PRODUCTS_URL — ссылка на страницу продуктов

## Запуск на Vercel
После деплоя добавить переменные окружения и установить webhook Telegram:
https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<domain>/api/webhook

Токен нельзя сохранять в GitHub или присылать в открытом виде.
