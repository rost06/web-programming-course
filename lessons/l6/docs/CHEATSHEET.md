# L6. Короткая справка

[Задание](../README.md) · [Гайд](GUIDE.md) · [Интерактив](interactive.html) · [Слайды](slides-standalone/slides.html)

## Зачем и термины

Тест связывает действие с наблюдаемым результатом. Vitest запускает проверки, RTL работает с DOM через пользовательские границы, mock заменяет внешнюю зависимость, а cleanup изолирует DOM между тестами.

До L6 `npm test` не обязателен. Подключите зависимости к существующему проекту `trainer`:

```sh
npm install vitest@3.2.7 jsdom@26.1.0 @testing-library/dom@10.4.1 @testing-library/jest-dom@6.6.3 @testing-library/react@16.3.3 @testing-library/user-event@14.6.7 --save-dev --save-exact
npm pkg set "scripts.test=vitest run"
```

Команды одинаковы в Linux и Windows PowerShell. `--save-exact` сохраняет точные версии.

## Конфигурация

В `vite.config.ts` используйте `defineConfig` из `vitest/config`, сохраните React-плагин и добавьте тестовую секцию:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: "./src/test-setup.ts",
  },
});
```

В `src/test-setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup);
```

При `globals: false` в каждом тесте явно импортируйте `describe`, `it`/`test` и `expect` из `vitest`. `afterEach(cleanup)` нужен, чтобы DOM одного теста не влиял на другой.

## Unit и RTL на стороннем примере

```ts
import { describe, expect, it } from "vitest";

it("считает пробельную строку пустой", () => {
  expect("  ".trim().length > 0).toBe(false);
});
```

```tsx
const user = userEvent.setup();
render(<NoteForm />);
await user.click(screen.getByRole("button", { name: /добавить/i }));
expect(screen.getByText("Новая заметка")).toBeInTheDocument();
```

Примеры относятся к форме заметок/списку покупок, а не к тренажёру. Ищите role/name → label → text, не CSS-индекс.

## Что проверить в A6

- заполненность: пробелы не считаются ответом;
- навигация: ответ возвращается по тому же `taskId`;
- ошибка: сообщение видно, ввод сохранён, повтор доступен;
- API подменён на границе, сети нет;
- тест описывает дефект, а не внутренний setter.

## Запуск

Из `trainer/`, одинаково в Linux и Windows PowerShell:

```sh
npm run check
npm test
npm run build
```

Покрытие — диагностический сигнал. Для каждого важного теста ответьте: «какую ошибку он обнаружит?»
