# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


---

## Conversation Messages Rendering (Ocean Professional)

This frontend includes a semantic and accessible messages list that follows the “single wrapper per message” pattern (Option B). It eliminates extra wrappers and avoids empty containers when items are removed.

### Rendering Pattern

- One wrapper per message (`.message-block`).
- For `role: "result"` messages, render `<ResultTable .../>` followed by a single timestamp.
- For other roles, render the message text followed by a single timestamp.
- The list is wrapped with a semantic container:
  - `<section aria-label="Conversation">`
  - `<div role="list">`
  - Each message wrapper has `role="listitem"`.

### Stable Keys

Keys are never array indices. The helper `getMessageKey(m)` uses:
1. `m.id` (preferred)
2. ISO string of `m.timestamp` (if present)
3. A stable hash of `role + content + timestamp` (last resort)

This ensures React diffing behaves correctly and no stray DOM nodes remain after deletions.

### Timestamp

`formatTime(ts)` renders a 24-hour HH:MM time. Timestamps are displayed once per message using a small, subdued style (`.message-timestamp`).

### Theme & Styles

The list aligns to the Ocean Professional theme:
- App gradient: `from-blue-500/10 to-gray-50` analogue (`.app-gradient`)
- Card-like message surfaces: rounded-xl, subtle ring and shadow
- Subdued timestamp color and small size

All styles are implemented with minimal CSS in `src/App.css`, without requiring Tailwind.

### Files

- `src/components/MessagesList.jsx` — Semantic messages list with utilities:
  - `getMessageKey`, `formatTime` (exported)
- `src/components/ResultTable.jsx` — Minimal result table for `role: "result"`
- `src/App.css` — Gradient and chat styles

Integrate by passing your messages array into `<MessagesList messages={messages} />`. The component renders nothing when the array is empty, preserving current behavior.
