# Local Semgrep UI

This is a Next.js app to provide a UI to triage the output of a Semgrep CLI scan.

## Scripts

`src/scripts/mongoUtils.js` has the scripts to add, update, delete a Semgrep output file in the MongoDB where the file can be updated. Each new file should be added as a new mongo collection.
You can use (ghorg)[https://github.com/gabrie30/ghorg] to quickly clone all repos in the org.

## Pre-requisites

Following is the current workflow for both setting up the dev environment and triaging a file

1. Use [ghorg](https://github.com/gabrie30/ghorg) to quickly clone all repos in the org locally
2. Run Semgrep with a command like the following on the folder with the repos:

```bash
semgrep scan --config auto . --json >  marketing.json
```

3. Mount the folder with the `json` file generated in the step above in Docker settings and update the app volumes section in docker-compose.yml
4. Configure `baseGitlabPath` in app.config.js
5. In the UI run scripts to import all results from the json file to Mongo
   - In app/scripts/mongoUtils.js update the `semgrepJsonFilePath` at the top to match the file path on the mount
   - Uncomment the line to create collection from file - `await createCollectionFromJson(semgrepJsonFilePath);`

## Run the application

Run the application

- Install dependencies with `npm install`
- `npm run dev`

## TODO

1. Allow configuration for switching to Github (in addition to Gitlab) links
2. Redesign the app to allow drag and drop since mounting with docker is a pain
3. Move from mongo to local file storage to make execution easier - simply run the html bundle locally and save changes to the json file

## Security

### Risk profile

The application is experimental and intended to be run locally and hence does not cater to authentication or self XSS kind of scenarios. Ensure that it is always run on a local interface - 127.0.0.1 as opposed to 0.0.0.0.
