# Local Semgrep UI

This is a Next.js project to provide a UI to triage the output of a Semgrep CLI scan.

## Scripts

`src/scripts/mongoUtils.js` has the scripts to add, update, delete a Semgrep output file in the MongoDB where the file can be updated. Each new file should be added as a new mongo collection.
You can use (ghorg)[https://github.com/gabrie30/ghorg] to quickly clone all repos in the org.

## Workflow

Following is the current workflow for both setting up the dev environment and triaging a file

0. Use [ghorg](https://github.com/gabrie30/ghorg) to quickly clone all repos in the org locally
1. Run Semgrep with a command like the following on the folder with the repos:

```bash
semgrep scan --config auto . --json >  marketing.json
```

2. Run the dev-container in VSCode to run the UI with the folder with the `.json` mounted
3. In the UI run scripts to import all results from the json file to mongo
   - In app/scripts/mongoUtils.js update the `semgrepJsonFilePath` at the top to match the file path on the mount
   - Uncomment the line to create collection from file - `await createCollectionFromJson(semgrepJsonFilePath);`
4. Run the application
   - Install dependencies with `npm install`
   - `npm run dev`
5. Triage the file in the UI

## TODO

1. Allow configuration for switching to Github (in addition to Gitlab) links
2. Redesign the app to allow drag and drop since mounting with docker is a pain
3. Move from mongo to local file storage to make execution easier - simply run the html bundle locally and save changes to the json file

## Security

### Risk profile

The application is experimental and intended to be run locally and hence does not cater to authentication or self XSS kind of scenarios. Ensure that it is always run on a local interface - 127.0.0.1 as opposed to 0.0.0.0.
