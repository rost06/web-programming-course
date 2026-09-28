# Шпаргалка нулевого занятия

## Окружение

Node.js запускает инструменты JavaScript, npm управляет пакетами, редактор нужен для файлов, а Git — для истории проекта. На L0 достаточно проверить их наличие; рабочий проект `trainer/` создаётся на L1.

Одинаковые команды для Linux и Windows PowerShell:

~~~sh
node --version
npm --version
git --version
code --version
~~~

Для курса нужна версия Node.js 24 или новее. Если `code --version` недоступна, проверьте редактор через его графический интерфейс.

## HTML

Фрагменты ниже — краткая справка по структуре страницы и базовым инструментам. Сначала соберите свой вариант по требованиям, затем используйте справку для проверки синтаксиса и терминов.

Более подробные материалы по отдельным темам перечислены в разделе [Расширенный справочник](#расширенный-справочник).

~~~html
<header>...</header>

<main>
  <!-- обязательные разделы -->
</main>

<footer>...</footer>
~~~

Смысловые элементы страницы: `header`, `nav`, `main`, `section`, `article`, `figure`, `figcaption`, `footer`.

Полезные элементы: header, nav, main, section, article, figure, figcaption, footer, h1–h3, p, a, img, ul, li, button, form, label, input.

Правило: на странице должен быть один основной h1. Заголовки h2 и h3 отражают вложенность разделов.

## Ссылки и изображения

~~~html
<a href="#contacts">Перейти к контактам</a>
<section id="contacts">...</section>

<img src="images/wedding_1.jpg" alt="Свадебная фотография">
~~~

Путь к файлу проверяйте относительно текущего HTML-файла.

## CSS

~~~css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  color: #202124;
  background: #f7f4ef;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.gallery img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

@media (max-width: 700px) {
  .gallery {
    grid-template-columns: 1fr;
  }
}
~~~

Часто используемые свойства: color, background, margin, padding, width, max-width, display, gap, grid-template-columns, flex-direction, align-items, justify-content, border, border-radius, font-size.

## JavaScript

~~~js
const button = document.querySelector("#contact-button");
const message = document.querySelector("#contact-message");

if (button && message) {
  button.addEventListener("click", () => {
    message.hidden = !message.hidden;
  });
}
~~~

Для элементов формы:

~~~js
const form = document.querySelector("#contact-form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("Форма отправлена");
  });
}
~~~

## DevTools

- Console — ошибки JavaScript и сообщения console.log;
- Elements — текущая HTML-структура и стили;
- Network — загрузка CSS, JavaScript и изображений;
- Device toolbar — проверка узкого экрана.

## Git

Полный workflow fork → clone → branch → commit → push → pull request описан в [гайде по Git и GitHub](../../../docs/GITHUB_GUIDE.md).

~~~bash
git status
git diff
git add lessons/l0/index.html lessons/l0/css/style.css lessons/l0/js/script.js
git commit -m "Complete lesson 0 portfolio"
~~~

## Локальный запуск

Откройте `lessons/l0/index.html` двойным щелчком или перетащите файл в браузер. Для этого задания сервер не нужен: все ресурсы подключаются из папки занятия.

## Расширенный справочник

- HTML: [подробный конспект](guide/1_html_tags_guide.md) и [расширенная шпаргалка](cheatsheet/1_html_tags_cheatsheet.md)
- CSS: [подробный конспект](guide/2_css_full_guide.md) и [практическая шпаргалка](cheatsheet/2_css_practical_cheatsheet.md)
- JavaScript: [подробный конспект](guide/3_js_full_guide.md) и [практическая шпаргалка](cheatsheet/3_js_practical_cheatsheet.md)
- Интерактив: [HTML](interactive/1_html_interactive_guide.html), [CSS](interactive/2_css_interactive_guide.html), [JavaScript](interactive/3_js_interactive_guide.html)
