# Local Semgrep UI

This is a Next.js app to provide a UI to triage the JSON output of a Semgrep CLI scan. It creates a Mongo DB to store the results.

![Screenshot](./static/screenshot.png)

## Pre-requisites

Following are the pre-requisites to be fulfilled before running the app:

1. Use [ghorg](https://github.com/gabrie30/ghorg) to quickly clone all repos in the target org locally
2. Run Semgrep CLI with a command like the following on the folder with the repos:

```bash
semgrep scan --config auto . --json >  marketing.json
```

3. Mount the folder with the JSON file generated in the step above in Docker settings and update the app volumes section in docker-compose.yml
4. Configure `semgrepJsonFilePath` and `baseGitlabPath` in app.config.js

### Configuration

- Update configurations in `app.config.js` file:
  - `semgrepJsonFilePath` - (mandatory) Path of the semgrep output JSON file on the mount. Results are loaded from this file to mongo DB for storage and triage. The name of the file is used to construct group name in the probable Gitlab URLs when presenting the results for triage.
  - `baseGitlabPath` - (mandatory) Base path of Gitlab to be appended to each Gitlab link.
  - `ignoredCheckIds` - Semgrep check ids to be ignored since they are all insignificant or false positive
  - `ignoredPathsContaining` - Any issue with any of these strings in the path is ignored.

## Run the application

Run the application

1. Install dependencies with `npm install`
2. `npm run dev`

## TODO

1. Allow configuration for switching to Github (in addition to Gitlab) links
2. Redesign the app to allow drag and drop since mounting with docker is a pain
3. Move from mongo to local file storage to make execution easier - simply run the html bundle locally and save changes to the json file

## Security

### Risk profile

The application is experimental and intended to be run locally and hence does not cater to authentication or self XSS kind of scenarios. Ensure that it is always run on a local interface - 127.0.0.1 as opposed to 0.0.0.0.
