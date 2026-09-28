# Git и GitHub в рамках курса

Этот гайд описывает рабочий маршрут: получить свою копию курса, выполнить этап в отдельной ветке, сохранить результат коммитами и отправить его на проверку через pull request.

Основной репозиторий курса: [github.com/demyurg/web-programming-course](https://github.com/demyurg/web-programming-course).

## Рабочая схема

~~~text
fork → clone → ветка этапа → commit → push → pull request
                                      ↑
                         исправления после замечаний
~~~

После замечаний новый commit и push в той же ветке обновляют уже открытый pull request.

## Что нужно знать

- **Fork** — ваша копия репозитория курса на GitHub.
- **Ветка** — отдельная линия изменений для одной работы.
- **Commit** — сохранённая точка в истории изменений.
- **Push** — отправка локальных коммитов на GitHub.
- **Pull request** — предложение проверить изменения и принять их в main.
- **origin** — ваш fork.
- **upstream** — основной репозиторий курса.

Команды в этом гайде одинаковы в Linux и Windows PowerShell, если отдельно не указано иное. Для задания работайте в своей ветке, а не непосредственно в main.

## 1. Подготовьте Git

Установите Git и проверьте его в терминале, Git Bash или PowerShell:

~~~bash
git --version
~~~

Один раз настройте имя и email автора коммитов:

~~~bash
git config --global user.name "Имя Фамилия"
git config --global user.email "your.email@example.com"
~~~

Настройки автора не заменяют вход в GitHub.

## 2. Создайте fork и клонируйте его

На странице [репозитория курса](https://github.com/demyurg/web-programming-course):

1. Нажмите **Fork**.
2. Выберите свой аккаунт GitHub.
3. Откройте созданный fork, нажмите **Code** и скопируйте HTTPS-адрес.
4. Выполните команды:

~~~bash
git clone https://github.com/YOUR_USERNAME/web-programming-course.git
cd web-programming-course
git remote -v
~~~

Замените YOUR_USERNAME на свой логин. В выводе origin должен указывать на ваш fork:

~~~text
origin  https://github.com/YOUR_USERNAME/web-programming-course.git (fetch)
origin  https://github.com/YOUR_USERNAME/web-programming-course.git (push)
~~~

Добавьте основной репозиторий под именем upstream:

~~~bash
git remote add upstream https://github.com/demyurg/web-programming-course.git
git remote -v
~~~

Свои ветки отправляйте в origin, а новые материалы курса получайте из upstream.

## 3. Создайте ветку для текущего этапа

Основание ветки зависит от этапа. Перед любой командой git switch -c проверьте рабочее дерево:

~~~bash
git status --short
~~~

Пустой вывод означает, что незакоммиченных изменений нет. Если вывод не пустой, сначала сохраните свои изменения коммитом или остановитесь и разберите состояние; не создавайте ветку поверх непонятных правок.

### L0: первый пример ветки, commit и PR

Для стартового портфолио синхронизируйте main, снова проверьте чистое дерево и создайте ветку от актуальной точки:

~~~bash
git switch main
git fetch upstream
git merge --ff-only upstream/main
git status --short
git push origin main
git switch -c l0-photo-portfolio
git branch --show-current
~~~

После этого используйте разделы 4–7: они показывают commit, push и pull request на примере L0.

### L1: первая ветка приложения

L1 — первая рабочая ветка проекта trainer. Она создаётся от актуального main после синхронизации и проверки чистого дерева:

~~~bash
git switch main
git fetch upstream
git merge --ff-only upstream/main
git status --short
git push origin main
git switch -c l1-typescript-basics
git branch --show-current
~~~

Откройте существующую папку trainer уже в этой ветке и создайте внутри неё файлы проекта по материалам L1.

### L2 и последующие этапы: накапливайте код

Для L2 и дальше не возвращайтесь к main, если в нём ещё нет предыдущего этапа. Переключитесь на локальную рабочую ветку предыдущего этапа, проверьте её и создайте новую ветку от неё:

~~~bash
git switch l1-typescript-basics
git status --short
git switch -c l2-react-components
git branch --show-current
~~~

Для L3 используйте вместо l1-typescript-basics ветку с A2, для L4 — ветку с A3 и так далее. Если имя локальной ветки предыдущего этапа недоступно, вместо двух команд выше можно создать новую ветку сразу от сохранённой точки сдачи:

~~~bash
git switch -c l2-react-components A1_SUBMISSION_SHA
~~~

Замените `A1_SUBMISSION_SHA` на фактический SHA. Команда `git rev-parse HEAD` лишь помогает записать текущий SHA для описания сдачи; это необязательная фиксация точки, а не обязательный второй шаг и не новая ветка.

Незавершённый pull request не требуется сливать в main: продолжайте от своей предыдущей рабочей ветки или локальной точки сдачи и укажите это основание в новом PR. Если синхронизация main завершилась конфликтом, не используйте принудительный push. Проверьте git status и обратитесь за помощью.

## 4. Выполните задание и создайте commit

Ниже приведён сквозной пример для L0. Для L1–L7 подставьте пути текущего этапа, например trainer/, и имя своей ветки.

Проверяйте состояние проекта:

~~~bash
git status
git diff
~~~

Перед commit убедитесь, что:

- активна ветка этапа, а не main;
- изменены только нужные файлы;
- в проект не попали пароли, токены, .env и личные данные;
- результат проверен в браузере или командами текущего этапа.

Для L0 откройте lessons/l0/index.html и проверьте изображения, навигацию, стили и Console в DevTools. Добавьте изменения и проверьте индекс Git:

~~~bash
git add lessons/l0/index.html lessons/l0/css/style.css lessons/l0/js/script.js
git status
git diff --cached --stat
git diff --cached
~~~

Создайте commit:

~~~bash
git commit -m "Complete lesson 0 portfolio"
~~~

Commit сохраняется локально. На GitHub он появится после push.

## 5. Отправьте ветку

Пример ниже продолжает ветку L0; для другого этапа используйте имя своей ветки. Команда одинакова в Linux и Windows PowerShell.

Первый push новой ветки:

~~~bash
git push -u origin l0-photo-portfolio
~~~

После следующих commit в этой же ветке достаточно:

~~~bash
git push
~~~

Не отправляйте рабочие изменения в upstream.

## 6. Создайте pull request

Пример ниже показывает L0. В новом PR замените compare branch на ветку текущего этапа и укажите её основание, если она содержит предыдущие этапы. После push откройте свой fork на GitHub и нажмите **Compare & pull request**. Если кнопки нет, откройте **Pull requests** → **New pull request**.

Проверьте направление изменений:

~~~text
base repository: demyurg/web-programming-course
base branch:     main
head repository: YOUR_USERNAME/web-programming-course
compare branch:  l0-photo-portfolio
~~~

Изменения должны идти из ветки вашего fork в main репозитория курса.

В pull request укажите:

- занятие и название работы;
- основание ветки и SHA точки сдачи, если PR содержит предыдущие этапы;
- что сделано;
- как проверяли результат;
- какие вопросы или затруднения остались.

Перед **Create pull request** откройте **Files changed**. В diff должны быть только изменения текущего задания и явно указанные предыдущие этапы.

Пример заголовка:

~~~text
L0: портфолио фотографа — Имя Фамилия
~~~

## 7. Исправьте замечания

Пример ниже исправляет PR L0. Для L1–L7 сохраняется тот же принцип: новые коммиты идут в ветку текущего этапа, а не в main:

~~~bash
git switch l0-photo-portfolio

# измените файлы и проверьте результат
git status
git diff

git add lessons/l0
git commit -m "Fix review comments"
git push
~~~

Новый push появится в уже открытом pull request. Новый PR для исправлений того же задания создавать не нужно.

## 8. Перейдите к следующему заданию

После сдачи при необходимости сохраните SHA текущей рабочей версии командой git rev-parse HEAD и убедитесь через git log --oneline, что в ветке есть нужные коммиты. Затем следуйте блоку «L2 и последующие этапы» в разделе 3: новая ветка создаётся один раз от предыдущей рабочей версии или точки сдачи. Если предыдущий PR ещё проверяется, незавершённый merge в main не нужен. Не удаляйте ветку предыдущего этапа, пока её PR ещё проверяется или от неё создана следующая ветка.

## Если что-то не работает

- **not a git repository** — перейдите в папку проекта командой cd web-programming-course.
- **src refspec ... does not match any** — проверьте имя ветки командами git branch и git branch --show-current.
- **rejected при push** — проверьте git remote -v и git status; не используйте git push --force.
- **GitHub не принимает push** — убедитесь, что origin указывает на ваш fork, и выполните вход через Git Credential Manager, GitHub Desktop или другой настроенный клиент.
- **В PR видны не те изменения** — проверьте base repository, base branch, head repository, compare branch и вкладку Files changed.

Не записывайте пароли и токены в URL remote, commit или файлы проекта.

## Чек-лист

- fork создан;
- локально склонирован ваш fork;
- origin указывает на ваш fork;
- upstream указывает на репозиторий курса;
- перед ветвлением выполнен git status --short, рабочее дерево чистое;
- основание ветки соответствует этапу: main для L1, предыдущая рабочая версия или SHA для L2+;
- задание выполнено в отдельной ветке;
- результат проверен в браузере или командами этапа;
- перед commit просмотрены git status и git diff --cached;
- ветка отправлена в ваш fork;
- pull request направлен в main репозитория курса;
- исправления отправляются в тот же PR.
