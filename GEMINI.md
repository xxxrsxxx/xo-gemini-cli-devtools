# Project Overview

This project is a developer widget for the Gemini CLI, built with React, TypeScript, and Vite. It provides a set of tools for debugging, monitoring, and visualizing Gemini CLI operations within a host application.

The main components of the project are:
-   `DevToolsWidget`: The main React component that renders the developer tools widget.
-   `monitor`: A service for monitoring Gemini CLI operations.
-   `recharts`: A library used for creating charts and graphs to visualize metrics.
-   `lucide-react`: A library used for icons.

# Building and Running

To build the project, run the following command:

```bash
npm run build
```

This will create a `dist` directory with the compiled and bundled code.

To run the project in development mode, use the following command:

```bash
npm run dev
```

This will start a development server and open the application in your browser.

To preview the production build, use the following command:

```bash
npm run preview
```

# Development Conventions

The project uses TypeScript for static typing and follows standard React best practices. The code is formatted using Prettier and ESLint (inferred from the presence of `package.json` dev dependencies, though no config files are present).

The project is structured as follows:
-   `components`: Contains the React components.
-   `contexts`: Contains the React contexts.
-   `services`: Contains the services for monitoring and other functionalities.
-   `lib.ts`: The main entry point of the library.
-   `App.tsx`: The main application component for development and testing.
