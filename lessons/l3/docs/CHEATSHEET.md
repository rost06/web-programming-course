# L3. Короткая справка

[Задание](../README.md) · [Гайд](GUIDE.md) · [Справка](CHEATSHEET.md) · [Интерактив](interactive.html) · [Слайды](slides-standalone/slides.html)

## Состояние ответа

```tsx
const [answers, setAnswers] = useState<Answer[]>([]);

function replaceAnswer(next: Answer) {
  setAnswers((current) => [
    ...current.filter((item) => item.taskId !== next.taskId),
    next,
  ]);
}
```

## Radio и текст

```tsx
<input
  type="radio"
  name={task.id}
  checked={answer?.kind === "single-choice" && answer.optionId === option.id}
  onChange={() => replaceAnswer({
    taskId: task.id,
    kind: "single-choice",
    optionId: option.id,
  })}
/>
```

```tsx
<textarea
  value={answer?.kind === "short-text" ? answer.text : ""}
  onChange={(event) => replaceAnswer({
    taskId: task.id,
    kind: "short-text",
    text: event.target.value,
  })}
/>
```

## Заполненность

```ts
function isAnswered(answer: Answer | undefined) {
  if (!answer) return false;
  return answer.kind === "single-choice"
    ? answer.optionId.length > 0
    : answer.text.trim().length > 0;
}
```

## Навигация

```ts
setCurrentIndex((index) => Math.min(index + 1, tasks.length - 1));
setCurrentIndex((index) => Math.max(index - 1, 0));
```

Перед `submitted` найдите `tasks.filter((task) => !isAnswered(...))`. Не храните отдельный счётчик прогресса и не используйте индекс как id ответа.
