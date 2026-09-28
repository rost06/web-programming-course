# L5. Гайд: запрос как часть состояния интерфейса

[Задание](../README.md) · [Гайд](GUIDE.md) · [Справка](CHEATSHEET.md) · [Интерактив](interactive.html) · [Слайды](slides-standalone/slides.html)

Этот гайд объясняет небольшие приёмы на примере списка заметок. Целевой экран тренажёра студент проектирует самостоятельно; полного каркаса приложения здесь нет.

## Зачем нужен HTTP-слой

Компонент знает, что пользователь нажал кнопку, но не должен считать ответ сервера подтверждённым только потому, что `fetch` вернул Promise. У запроса есть жизненный цикл: idle, loading, success или error. Сервер остаётся источником истины для сохранённой попытки и результата.

```ts
type Note = { id: string; text: string };

async function loadNote(id: string): Promise<Note> {
  const response = await fetch(`/api/notes/${id}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json() as Promise<Note>;
}
```

`fetch` отклоняет Promise обычно при проблеме сети, но 400 или 500 нужно проверять через `response.ok`. Тело JSON читается отдельно.

## JSON-запрос

```ts
await fetch('/api/notes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'наблюдение' }),
});
```

В A5 путь, метод и тело берите из контракта. Не переносите пример `/api/notes` в тренажёр.

## Состояния запроса

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success' }
  | { status: 'error'; message: string };
```

Перед запросом установите loading, в try сохраните подтверждённый ответ, в catch покажите сообщение, в finally снимите блокировку. Локальное поле ответа не очищайте в catch.

## PUT и DELETE

В учебном API PUT сохраняет или заменяет ответ задания. Идентификатор задания находится и в URL, и в JSON; они должны совпадать. DELETE очищает ответ. Повторное DELETE допустимо.

## Submit и result

Submit переводит попытку в submitted, а не «считает оценку в браузере». Если непустой short-text ждёт преподавателя, общий status — pending-review, а score — null. Такой результат нужно подписать как ожидание.

## Ошибка и повтор

Добавьте к учебному запросу `X-Demo-Fail: 1`: сервер вернёт 500 без изменения данных. Проверьте, что поле осталось видимым, ошибка объяснена, повтор без заголовка выполняется одной кнопкой. Не делайте бесконечный автоматический retry.

## Network

DevTools → Network: рассмотрите Request Method, URL, Request Payload, Status и Response. Сверяйте taskId, kind и optionId/text. Network наблюдает факт и не добавляет новых полей.

## Самопроверка

- Что показывается, пока PUT не завершён?
- Где хранится последний подтверждённый Attempt?
- Почему response.ok проверяется до response.json()?
- Как UI различает score: null и score: 0?

### Источники

- [MDN: Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [MDN: HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)
- [Контракт курса](../../../course/CONTRACT.md)
