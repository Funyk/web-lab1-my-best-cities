# Мої 3 найкращі міста світу

Лабораторна робота №1 з дисципліни «Веб-програмування».
Автор: **Костюк Артем**, група **КН-42**.

## План перед реалізацією

Блог розповідає про Львів (рідне місто й культура), Шанхай (технології та футуристична атмосфера) і Токіо (аніме та японська культура). Сторінки створюються лише мовою HTML, без CSS, JavaScript, серверної обробки та фреймворків.

### Карта сайту

```text
index.html — головна: вступ і три анонси
├── city-lviv.html — Львів
├── city-shanghai.html — Шанхай
├── city-tokyo.html — Токіо
└── form.html — запропонувати місто
```

На кожній сторінці буде спільна навігація до всіх п’яти сторінок і підпис автора. Внутрішні посилання та зображення матимуть відносні шляхи для роботи локально й на GitHub Pages.

### Контент і фотографії

Сторінка кожного міста міститиме назву, фотографію, короткий опис, особисту причину вибору, цікаві факти, визначні місця, суб’єктивну оцінку привабливості, посилання на джерела та повернення на головну. Оцінка не означає твердження про відвідування міста.

Локальні фотографії зберігатимуться в `images/`: площа Ринок у Львові, нічний Пудун у Шанхаї, Акіхабара в Токіо. Для кожної буде змістовний `alt` і атрибуція з автором, джерелом та ліцензією. Факти перевіряються за офіційними туристичними та культурними джерелами.

### План форми

Форма пропозиції міста: ім’я, електронна пошта, місто, країна/регіон, причина вибору й категорія зацікавлення. Поля матимуть `label`, `id`, `name`, відповідні типи та `required`, де потрібно. Нативна перевірка браузера забезпечить обов’язкове заповнення. Це демонстрація HTML-форми: вона не доставляє повідомлення автору та не зберігає заявки. Перевіряти її потрібно вигаданими тестовими даними.

## Заплановані етапи

1. План структури та початковий commit.
2. П’ять семантичних HTML-сторінок, тексти й зображення.
3. Перевірка HTML, переходів, фотографій, форми й повідомлень браузера.
4. Commit готового проєкту, GitHub-репозиторій і push.
5. Публікація GitHub Pages з `main` / кореня та перевірка опублікованого сайту.


## Готові файли

```text
.
├── index.html
├── city-lviv.html
├── city-shanghai.html
├── city-tokyo.html
├── form.html
├── images/
│   ├── lviv.jpg
│   ├── shanghai.jpg
│   ├── tokyo.jpg
│   └── credits.json
└── README.md
```

На всіх сторінках є спільна навігація. Кожна міська сторінка містить фотографію, опис, особисті мотиви вибору, три факти, три визначні місця, якісну особисту оцінку та посилання на джерела. Тексти не стверджують, що автор відвідав Шанхай або Токіо.

## Як відкрити локально

Завантажте весь проєкт і відкрийте `index.html` у браузері. Зберігайте HTML-файли разом із каталогом `images/`, щоб усі відносні посилання й зображення працювали. Встановлювати залежності чи збирати сайт не потрібно.

## Як працює форма

`form.html` демонструє `form`, `input`, `label`, `textarea`, `select`, `option`, `button`, групування `fieldset`/`legend` і перемикачі `radio`. Обов’язкові поля, довжину тексту й формат email перевіряє браузер. `for` кожного підпису відповідає `id` поля; поля мають `name`.

Після валідного введення метод `GET` відкриває ту саму сторінку з параметрами в адресному рядку. Дані не надсилаються автору й не зберігаються як заявки. Для перевірки використовуйте лише вигадані дані, наприклад `reader@example.com`. Кнопка очищення повертає початкові значення.

## Джерела інформації

Факти мають посилання на джерела безпосередньо на сторінках міст. Переглянуто 10 листопада 2026 року.

### Львів

- [UNESCO: L’viv — the Ensemble of the Historic Centre](https://whc.unesco.org/en/list/865/)
- [lviv.travel: Площа Ринок у Львові](https://lviv.travel/ua/places/attractions/ploshcha-rinok)
- [Офіційне конференц-бюро міста Львова: Архітектура](https://www.lvivconvention.com/arkhitektura/)
- [Львівська національна опера: Уродини Львівської опери](https://opera.lviv.ua/urodyny-lvivskoyi-opery/)
- [lviv.travel: Театр опери та балету ім. Соломії Крушельницької](https://lviv.travel/ua/places/attractions/teatr-operi-ta-baletu-im-solomiyi-krushelnitskoyi)

### Шанхай

- [Офіційний портал Шанхая: Shanghai Tower](https://english.shanghai.gov.cn/en-ScenicSpots/20240507/f3ce9cade30f4ff2a0bad6293626a232.html)
- [Офіційний портал Шанхая: Oriental Pearl Tower](https://english.shanghai.gov.cn/en-ScenicSpots/20231205/19a5f5184eca45728fd57a4d4c8efc61.html)
- [Офіційний портал Шанхая: Lujiazui Financial City](https://english.shanghai.gov.cn/en-NationalDevelopmentZone/20231211/0a27a204c2f7473482d824b5715daab6.html)
- [Офіційний портал Шанхая: The Bund Historical and Cultural Block](https://english.shanghai.gov.cn/en-HeritageZones/20231208/f2ac293f546a4d32aba936f2e733a47c.html)

### Токіо

- [GO TOKYO: A guide to Akihabara](https://www.gotokyo.org/en/destinations/central-tokyo/akihabara/index.html)
- [GO TOKYO: Sensoji Temple](https://www.gotokyo.org/en/spot/15/)
- [Tokyo Museum Collection: The Procession of the Emperor Going to Tokyo](https://museumcollection.tokyo/en/works/6244159/)
- [Офіційний сайт Tokyo Tower: Main Deck](https://www.tokyotower.co.jp/maindeck/)
- [Офіційний сайт Дедзіми: Dejima History](https://nagasakidejima.jp/english/history/)

## Фотографії та ліцензії

Усі фото збережені локально. Нижче наведені їхні власні ліцензії; вони не означають автоматичного ліцензування всього проєкту на тих самих умовах.

| Файл | Фото й автор | Ліцензія |
| --- | --- | --- |
| `images/lviv.jpg` | [Panorama Rynok Platz Blick W Lemberg Ukraine](https://commons.wikimedia.org/wiki/File:Panorama_Rynok_Platz_Blick_W_Lemberg_Ukraine.JPG) — Herbert wie | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `images/shanghai.jpg` | [Pudong Shanghai November 2017 HDR panorama](https://commons.wikimedia.org/wiki/File:Pudong_Shanghai_November_2017_HDR_panorama.jpg) — King of Hearts | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| `images/tokyo.jpg` | [Akihabara Night](https://commons.wikimedia.org/wiki/File:Akihabara_Night.jpg) — ElHeineken | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) |

Використані зменшені копії завширшки 1280 px, надані Wikimedia Commons; кадрування та зміни змісту не виконувалися. Повні метадані, початкові адреси й розміри містяться в `images/credits.json`. Атрибуція також видима під кожним фото на відповідній HTML-сторінці.

## Публікація

Це статичний проєкт для GitHub Pages. Джерело публікації: **Deploy from a branch → main → /(root)**. HTML-файли та `images/` потрібно розмістити в корені репозиторію. Внутрішні посилання не починаються з `/`, тому працюють і в підкаталозі project site.
