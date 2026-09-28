# L4. Короткая справка

[Задание](../README.md) · [Гайд](GUIDE.md) · [Справка](CHEATSHEET.md) · [Интерактив](interactive.html) · [Слайды](slides-standalone/slides.html)

## Reducer

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: "answerChanged", answer: next });
```

```ts
function reducer(state: State, action: Action): State {
  if (state.status === "submitted" && action.type === "answerChanged") return state;
  switch (action.type) {
    case "answerChanged": return replaceAnswer(state, action.answer);
    case "moved": return { ...state, currentIndex: action.index };
    case "reset": return initialState;
    default: return state;
  }
}
```

## Сериализация

```ts
try {
  localStorage.setItem(key, JSON.stringify(draft));
} catch {
  // показать предупреждение, но не блокировать текущий ввод
}
```

## Восстановление

`localStorage.getItem` может вернуть `null`, а `JSON.parse` может бросить исключение. Значение после parse имеет тип `unknown`: проверяйте `version`, `setId`, `status`, `answers`, `taskId`, `kind` и соответствующее поле ответа. `submitted` только отображается как завершённое состояние.
