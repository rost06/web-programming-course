# Гайд L6: тестируем наблюдаемое поведение

[Задание](../README.md) · [Гайд](GUIDE.md) · [Справка](CHEATSHEET.md) · [Интерактив](interactive.html) · [Слайды](slides-standalone/slides.html)

Примеры используют маленькую форму списка покупок и заметки, чтобы объяснить границы тестов.

## Зачем тесты

Тест связывает сценарий с обещанным результатом: действие → наблюдение. Это полезнее, чем проверка случайного класса или внутреннего имени state. Unit-тест подходит для чистого правила, RTL — для доступного интерфейса и пользовательских действий.

Термины:

- **Vitest** — тестовый раннер и API ожиданий;
- **React Testing Library (RTL)** — рендер и запросы к DOM через пользовательские границы;
- **jsdom** — тестовое DOM-окружение Node.js;
- **mock** — управляемая замена внешней зависимости;
- **setup-файл** — код, который запускается до тестов;
- **cleanup** — удаление отрендеренного DOM после теста.

## Подключите Vitest и RTL к существующему проекту

Перед L6 проект `trainer` уже должен быть вашей рабочей версией после предыдущих этапов. Не создавайте новый проект и не заменяйте исходники. Если `npm test` раньше не запускался, это нормально: runner и RTL подключаются именно сейчас.

Из `trainer/`, одинаково в Linux и Windows PowerShell:

```sh
npm install vitest@3.2.7 jsdom@26.1.0 @testing-library/dom@10.4.1 @testing-library/jest-dom@6.6.3 @testing-library/react@16.3.3 @testing-library/user-event@14.6.7 --save-dev --save-exact
npm pkg set "scripts.test=vitest run"
```

`vitest` запускает проверки, `jsdom` даёт DOM, `@testing-library/react` рендерит React, `@testing-library/dom` предоставляет DOM-запросы, `jest-dom` добавляет читаемые matchers, а `user-event` моделирует действия пользователя. `--save-exact` сохраняет выбранные версии без `^`; lockfile обновляется в том же проекте.

Обновите существующий `vite.config.ts`, заменив импорт `defineConfig` из `vite` на импорт из `vitest/config`, и добавьте React-плагин и тестовую секцию:

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

Секция `test` находится рядом с `plugins`. Создайте `src/test-setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup);
```

При `globals: false` функции `describe`, `it`, `test` и `expect` не появляются глобально: импортируйте их в каждом тестовом файле:

```ts
import { describe, expect, it } from "vitest";
```

Явный `afterEach(cleanup)` обязателен для изоляции RTL-тестов в этом варианте настройки. Без него DOM предыдущего теста может остаться в `document` и сделать следующий тест зависимым от порядка запуска. Не полагайтесь на случайное поведение среды.

## Scripts и запуск

Скрипт `test` — это команда проекта, поэтому `npm test` запускает одноразовый прогон `vitest run`. Проверяйте весь маршрут:

```sh
npm run check
npm test
npm run build
```

Команды одинаковы в Linux и Windows PowerShell. Режим watch можно добавить отдельным script по документации Vitest, но для сдачи нужен воспроизводимый одноразовый запуск. Тесты не должны требовать запущенного API.

## Сначала сформулируйте правило

Фраза «компонент работает» слишком расплывчата. Сценарий для списка покупок точнее: пользователь вводит название, нажимает «Добавить» и видит его в списке; пустой или пробельный ввод не добавляется. Один тест отвечает на один вопрос.

## Unit-тест чистого правила

```ts
import { describe, expect, it } from "vitest";

function isFilled(value: string): boolean {
  return value.trim().length > 0;
}

describe("isFilled", () => {
  it("считает пробелы пустым вводом", () => {
    expect(isFilled("  ")).toBe(false);
  });
});
```

Такой тест не зависит от DOM, сети и часов. Для A6 перенесите идею на собственное правило заполненности.

## RTL проверяет границу пользователя

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();
render(<NoteForm />);
await user.type(screen.getByRole("textbox", { name: /текст/i }), "Проверить API");
await user.click(screen.getByRole("button", { name: /добавить/i }));
expect(screen.getByText("Проверить API")).toBeInTheDocument();
```

Ищите доступные элементы через роль и имя, label или текст. `user-event` асинхронен, поэтому действия ожидаются через `await`. В реальном тесте поместите этот сценарий внутрь `it` или `test` и импортируйте нужные функции.

## Навигация и ошибка

Для тренажёра сформулируйте сценарий без привязки к разметке: ввести ответ на одном шаге, перейти назад/вперёд и увидеть то же значение по тому же `taskId`. Отдельный сценарий: заполнить поле, получить контролируемую ошибку отправки, увидеть сообщение и убедиться, что ввод не исчез.

Сетевую границу подменяйте функцией клиента или `fetch`. Успех и ошибка должны задаваться тестом; не запускайте реальный сервер и не обращайтесь к интернету. Проверяйте пользовательское состояние, а не вызов `console.error` или внутренний setter.

## Async и очистка

Используйте `findByRole` или `waitFor`, только когда ожидаете изменение после асинхронной операции. Не добавляйте произвольный `setTimeout`. Перед каждым тестом очищайте только нужные mocks, а общий DOM очищайте `afterEach(cleanup)` из setup-файла. `globals: false` не отменяет необходимость cleanup.

## Разбор дефекта

Запишите четыре части: факт («после возврата текст исчез»), гипотеза («ответ привязан к позиции»), проверка (сценарий навигации) и исправление (выбранная модель связи). После исправления повторите исходный тест и один соседний сценарий. Не делайте вывод о всей системе по одному проходящему тесту.

## Источники

- [Vitest: mocking](https://vitest.dev/guide/mocking.html)
- [Vitest: configuration](https://vitest.dev/config/)
- [Testing Library: guiding principles](https://testing-library.com/docs/guiding-principles/)
- [Testing Library: queries](https://testing-library.com/docs/queries/about/)
