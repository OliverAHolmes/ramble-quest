# Frontend Application with MapBox GL JS

This project uses a minimal React application and integrates the [MapBox GL JS library](https://docs.mapbox.com/mapbox-gl-js/guides/). It was initialized using [Create React App](https://github.com/facebook/create-react-app).

## Prerequisites

- Node.js (version 16 or higher)
  
**Note:** It's recommended to start the backend server before running the frontend. For backend setup instructions, please refer to its respective README.

## Quick Start

### Installation

First, navigate to the project directory and install the required dependencies:

```bash
yarn install
```

### Development

To run the app in development mode:

```bash
yarn start
```

Then, open [http://localhost:3000](http://localhost:3000) in your web browser.

A proxy is set up in the `package.json` to automatically redirect API requests to the backend server running on port 8000.

The app will auto-reload if you make changes. Lint errors, if any, will appear in the console.

### Building the Project

To create an optimized production build:

```bash
yarn build
```

### Testing

To run tests:

```bash
yarn test
```

To generate a test coverage report:

```bash
yarn test-coverage
```

### Code Formatting

To format the codebase using Prettier:

```bash
yarn format
```
