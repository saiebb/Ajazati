# Ajazati

Ajazati (أجازاتى) is a modern, bilingual (English/Arabic) vacation management web application built with Next.js, React, and Tailwind CSS. It allows users to efficiently manage, track, and analyze their vacation days with a beautiful, responsive, and RTL/LTR-aware interface.

## Features

- 🌍 **Bilingual Support:** Full support for English (LTR) and Arabic (RTL) languages, including UI direction and translations.
- 🗓️ **Vacation Dashboard:** View summary, quick actions, and upcoming/past vacations at a glance.
- ➕ **Add Vacation:** Request new vacations with type, date range, and notes.
- 📅 **Calendar View:** Visualize all vacations on a calendar, with color-coded types and status.
- 📊 **Insights & Analytics:** Get smart insights, trends, and breakdowns of your vacation usage.
- ⚙️ **Settings:** Manage profile, preferences, notification settings, and calendar integrations.
- 🎨 **Theme Support:** Light, dark, and system themes.
- 👤 **User Preferences:** Language, theme, and notification preferences are customizable.
- 📱 **Responsive Design:** Works great on desktop and mobile devices.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) components
- [Lucide Icons](https://lucide.dev/)
- [date-fns](https://date-fns.org/) for date handling
- [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- pnpm, npm, or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/saiebb/Ajazati.git
   cd Ajazati
   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```
3. **Run the development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` — Next.js app directory (pages, layouts, routes)
- `components/` — Reusable UI and layout components
- `lib/` — Utilities and i18n (internationalization) logic
- `hooks/` — Custom React hooks
- `public/` — Static assets
- `styles/` — Global and component CSS
- `types/` — TypeScript types

## Internationalization (i18n)
- All UI text is translated via `lib/i18n/messages/en.json` and `ar.json`.
- The layout automatically switches between LTR (English) and RTL (Arabic) based on the selected language.
- To add more languages, add a new JSON file in `lib/i18n/messages/` and update the config.

## Customization
- **Vacation types, departments, and other options** can be edited in the config files or translation files.
- **Themes** can be extended via Tailwind and the theme provider.

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Ajazati** — Manage your time off, your way.
