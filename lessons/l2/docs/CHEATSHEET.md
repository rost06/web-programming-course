# L2. Короткая справка

[Задание](../README.md) · [Гайд](GUIDE.md) · [Интерактив](interactive.html) · [Слайды](slides-standalone/slides.html)

Все кодовые примеры здесь используют книги.

## Зачем и термины

- компонент — функция JSX;
- props — вход компонента;
- state — изменяемые данные, запускающие новый рендер;
- `key` — стабильный id сущности в списке;
- Vite — dev-сервер и сборщик;
- mount — подключение React к DOM-элементу.

## Подключение к существующему проекту

Не запускайте генератор поверх `trainer/`: продолжайте проект L1.

```sh
npm install react@19.3.0 react-dom@19.3.0 --save-exact
npm install vite@6.4.3 @vitejs/plugin-react@4.3.4 @types/react@19.3.0 @types/react-dom@19.3.0 --save-dev --save-exact
npm pkg set "scripts.dev=vite" "scripts.build=tsc --noEmit && vite build"
```

Команды одинаковы в Linux и Windows PowerShell. Конфиги `tsconfig`, `vite.config.ts`, `index.html` и mount-фрагмент находятся в [гайде](GUIDE.md).

```sh
npm run check
npm run build
npm run dev
```

До L6 `npm test` не обязателен: Vitest и RTL подключаются позже.

## Props и список книг

```tsx
type BookRowProps = {
  isbn: string;
  title: string;
  onChoose: (isbn: string) => void;
};

function BookRow({ isbn, title, onChoose }: BookRowProps) {
  return <button onClick={() => onChoose(isbn)}>{title}</button>;
}

{books.map((book) => (
  <BookRow key={book.isbn} isbn={book.isbn} title={book.title} onChoose={onChoose} />
))}
```

Используйте id сущности в `key`, не индекс. Дочерний компонент сообщает о выборе callback-ом.

## Формы данных

Проверяйте общее поле union до чтения специальных полей. Бумажная книга имеет `pages`, аудиокнига — `duration`; аналогичная граница нужна между двумя формами задания A1.

## State

Храните только идентификатор выбранной сущности. На каждом рендере предусмотрите состояние «ничего не выбрано» и не дублируйте весь объект в state. A2 не включает ввод ответов, HTTP и сохранение.
