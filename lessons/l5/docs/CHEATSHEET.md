# L5. Краткая справка

[Задание](../README.md) · [Гайд](GUIDE.md) · [Справка](CHEATSHEET.md) · [Интерактив](interactive.html) · [Слайды](slides-standalone/slides.html)

## Запрос JSON

```ts
const response = await fetch(url, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
if (!response.ok) throw new Error(`HTTP ${response.status}`);
const data = await response.json();
```

## Маршруты A5

| Действие | Метод и путь | Тело |
| --- | --- | --- |
| Список | `GET /api/sets` | нет |
| Набор | `GET /api/sets/:id` | нет |
| Попытка | `POST /api/attempts` | `{setId}` |
| Ответ | `PUT /api/attempts/:id/answers/:taskId` | Answer |
| Очистка | `DELETE /api/attempts/:id/answers/:taskId` | нет |
| Завершение | `POST /api/attempts/:id/submit` | `{}` |
| Результат | `GET /api/attempts/:id/result` | нет |

## Ответы

```json
{"taskId":"ts-1","kind":"single-choice","optionId":"b"}
```

```json
{"taskId":"react-1","kind":"short-text","text":"Объяснение"}
```

Кнопка disabled при loading. В catch не стирайте локальный ввод. Проверяйте response.ok, затем JSON; не отправляйте score; null показывайте как ожидание проверки.

## Ошибки

400 — неверное тело, 404 — объект не найден, 409 — действие не соответствует состоянию, 413 — слишком большое тело, 500 — учебная ошибка. Ошибка сети не имеет HTTP-ответа.

## Запуск сервера

Linux и Windows PowerShell:

```sh
node course/server/server.mjs
```

Полная таблица находится в [CONTRACT.md](../../../course/CONTRACT.md).
