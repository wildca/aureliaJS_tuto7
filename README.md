# aurss

RSS reader application.

- Run lint: `nps test.lint`
- Run the test suite: `nps test`
- Run the test suite in watch mode: `nps test.jest.watch`
- Build the project for production: `nps build`
- Start the project: `nps`
- Start the project with hot module reloading: `au run --watch`

## Adding a RSS backend

1. Implement the backend. It must implement the `Backend` interface.
2. Make it selectable by adding it to the `SelectableBackend` enum.
test
test
