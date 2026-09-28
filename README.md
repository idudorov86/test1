# 📊 Дашборд аналитики отчетов УВПК

Веб-приложение (React + TypeScript + Vite + Tailwind CSS v4) для загрузки, парсинга и визуализации Excel-отчетов отдела продаж УВПК.

## Быстрый старт

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production-сборка
```

## Документация

1. **PROJECT_SUMMARY.md** — сводка проекта (читать первым)
2. **QUICK_START.md** — инструкция по созданию с нуля
3. **PROJECT_DOCUMENTATION.md** — полное техническое задание
4. **TRANSFER_INSTRUCTIONS.md** — инструкция по переносу проекта

## Технологии

- React 18, TypeScript, Vite
- Tailwind CSS v4 (@tailwindcss/vite)
- Recharts — графики
- XLSX (SheetJS) — парсинг Excel
- Lucide React — иконки

## Структура

```
src/
├── App.tsx                  # Главный компонент
├── main.tsx                 # Точка входа
├── index.css                # Глобальные стили
├── types.ts                 # TypeScript интерфейсы
├── components/
│   ├── FileUpload.tsx       # Загрузка файлов (drag & drop)
│   ├── Sidebar.tsx          # Фильтры (группа/менеджеры)
│   ├── KPICards.tsx         # 5 карточек KPI
│   ├── Charts.tsx           # BarChart + LineChart
│   └── Leaderboard.tsx      # Таблица рейтинга
└── utils/
    ├── parser.ts            # Парсер Excel
    ├── calculations.ts      # Расчеты KPI
    ├── dateUtils.ts         # Конвертация дат (Europe/Moscow)
    └── demoData.ts          # Генератор демо-данных
```

Файлы обрабатываются локально в браузере — данные никуда не отправляются.
