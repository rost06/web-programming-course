# Гайд L2: React, props и одно состояние

[Задание](../README.md) · [Гайд](GUIDE.md) · [Справка](CHEATSHEET.md) · [Интерактив](interactive.html) · [Слайды](slides-standalone/slides.html)

Все объяснительные фрагменты ниже используют каталог книг и показывают приёмы React на небольших независимых примерах.

## Зачем подключать React и Vite

React описывает интерфейс компонентами и обновляет его после изменения состояния. Vite запускает dev-сервер и собирает модульный проект. A1 остаётся источником типов и функций; React добавляется поверх него, чтобы данные можно было показать и выбрать без перезагрузки.

Термины:

- **компонент** — функция, возвращающая JSX;
- **JSX** — синтаксис описания элементов интерфейса внутри TypeScript;
- **props** — входные данные компонента от родителя;
- **state** — данные компонента, изменение которых вызывает новый рендер;
- **`key`** — стабильный идентификатор элемента списка для сопоставления рендеров;
- **Vite** — dev-сервер и сборщик;
- **mount** — создание корневого React-дерева в элементе HTML.

## Подключите инструменты к проекту L1

Откройте существующую `trainer/` с вашим `package.json` и A1. Не выполняйте `npm create vite` в этой папке и не заменяйте проект генератором: он может удалить смысл предыдущего этапа. Команды одинаковы в Linux и Windows PowerShell.

```sh
npm install react@19.3.0 react-dom@19.3.0 --save-exact
npm install vite@6.4.3 @vitejs/plugin-react@4.3.4 @types/react@19.3.0 @types/react-dom@19.3.0 --save-dev --save-exact
npm pkg set "scripts.dev=vite" "scripts.build=tsc --noEmit && vite build"
```

`react` и `react-dom` дают библиотеку UI и связь с DOM. `vite` запускает сервер и сборку, плагин обрабатывает JSX, а `@types/*` описывают API для TypeScript. `--save-exact` сохраняет выбранные версии без `^`; lockfile обновляется npm. TypeScript и `tsx` уже должны быть установлены на L1 — повторно выбирать `latest` здесь не нужно.

Обновите конфигурацию TypeScript под JSX и Vite. Это инфраструктурные фрагменты, не код предметной области.

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"]
}
```

Оставьте эту единственную `tsconfig.json` для исходников `src/`. Скрипт `build` сначала выполняет `tsc --noEmit` по файлам, перечисленным в `include`, затем Vite собирает приложение. Отдельная node-конфигурация и `tsc -b` для этого маршрута не нужны.

Минимальный `vite.config.ts` подключает React-плагин:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({ plugins: [react()] });
```

Создайте или обновите следующие минимальные инфраструктурные файлы. Они не содержат доменную модель и нужны только для того, чтобы проверить mount.

`index.html`:

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Trainer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`src/main.tsx`:

```tsx
import { createRoot } from "react-dom/client";
import App from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("Root element is missing");
createRoot(root).render(<App />);
```

`src/App.tsx`:

```tsx
export default function App() {
  return <main><h1>React подключён</h1><p>Mount работает.</p></main>;
}
```

Это временная hello-проверка инфраструктуры. После проверки замените её на собственную структуру A2, сохранив `domain.ts` и демонстрацию A1.

## Минимальный state на стороннем примере

Синтаксис state можно освоить на независимом счётчике:

```tsx
import { useState } from "react";

export function ClickCounter() {
  const [value, setValue] = useState(0);

  return <button onClick={() => setValue(value + 1)}>Нажато: {value}</button>;
}
```

`value` — текущее значение, `setValue` — способ попросить React о новом рендере. Это пример синтаксиса, а не состояние выбора задания; модель A2 спроектируйте самостоятельно.

## Проверьте цепочку запуска

```sh
npm run check
npm run build
npm run dev
```

`check` проверяет TypeScript-файлы по вашей `tsconfig.json`, `build` повторяет эту проверку через `tsc --noEmit`, а затем Vite собирает приложение. `dev` открывает локальный сервер для ручной проверки. Команда `npm test` до L6 не обязательна и не означает, что тестовые зависимости установлены.

## Props: вход компонента

Props лучше рассматривать как контракт функции. На примере книги:

```tsx
type BookRowProps = {
  isbn: string;
  title: string;
  onChoose: (isbn: string) => void;
};

function BookRow({ isbn, title, onChoose }: BookRowProps) {
  return <button onClick={() => onChoose(isbn)}>{title}</button>;
}
```

Родитель передаёт данные вниз, а callback сообщает о действии вверх. Дочерний компонент не меняет объект props. Для A2 выберите свои названия и типы, совместимые с A1.

## Список и `key`

`map` превращает массив книг в JSX. `key` должен описывать саму сущность, например ISBN, а не случайную позицию:

```tsx
{books.map((book) => (
  <BookRow key={book.isbn} isbn={book.isbn} title={book.title} onChoose={onChoose} />
))}
```

Если фильтр или сортировка меняют порядок, стабильный идентификатор сохраняет связь строки с сущностью. Индекс может скрыть ошибку, когда React сопоставляет старую и новую позицию.

## Условное отображение

Разные формы данных показывайте через проверку общего отличителя. Для каталога это может быть формат книги:

```tsx
function BookMeta({ book }: { book: PaperBook | AudioBook }) {
  if (book.kind === "paper") return <p>{book.pages} страниц</p>;
  return <p>{book.duration} минут аудио</p>;
}
```

Сначала проверьте `kind`, затем обращайтесь к полю конкретной формы. В A2 это правило защищает от чтения `options` у текстового задания. Значение `code` выводите как текстовое содержимое `<pre>`, не как HTML и не как исполняемый код.

## Одно состояние выбора

Храните в состоянии минимальный идентификатор выбранной книги, а не копию всего объекта. При клике вызывайте setter с id; во время рендера определяйте, какой элемент каталога соответствует этому id, и предусмотрите ветку отсутствия. Не привязывайте связь к индексу массива.

Не храните отдельно и id, и полную копию той же книги: два источника могут разойтись. Не храните в state вычисляемое количество элементов — его можно получить из текущих данных.

## Самопроверка A2

Перенесите эти вопросы на модель тренажёра:

1. Какие props получает список, а какие — карточка одного элемента?
2. Кто меняет id выбора и что увидит карточка после callback?
3. Какое поле является стабильным `key`?
4. Что покажет экран при пустом наборе или отсутствующем id?
5. Как `kind` отделяет варианты от короткого текста?
6. Остаются ли типы и функции A1 рабочими после подключения JSX?

Проверьте сценарии в широком и узком окне, клавиатурой и через `npm run build`. Не добавляйте формы ответов, HTTP, storage или тестовый раннер до соответствующих лекций.

## Источники

- [React: Passing Props](https://react.dev/learn/passing-props-to-a-component)
- [React: Rendering Lists](https://react.dev/learn/rendering-lists)
- [React: Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)
- [Vite: Getting Started](https://vite.dev/guide/)
