# Companyend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Company job creation (single page)

This workspace provides a simple, single-page flow that lets a company create a job description. There are no login pages — the form is available at the root route.

Usage:
- Navigate to `http://localhost:4200/` (root).
- Enter a company name (optional) and fill the job fields: title, CTC, location, experience required, and description.
- Click "Post Job" to save the job locally. Created jobs will appear below the form.
 - Click "Post Job" to save the job locally. Created jobs will appear below the form. Use "Approach Colleges" next to a job to send it to a college (simulated, stored in localStorage).

This is a demo implementation that uses localStorage to save job entries locally with no backend.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
