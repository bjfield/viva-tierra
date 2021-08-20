All Google services below use the account for bjfield@gmail.com.

The database uses a Google doc to manage the data.

https://docs.google.com/spreadsheets/d/1QWZxkGFpMtCDYi2J4fKZlJxJJL-VJwmR6ug2qwZF4MU/edit#gid=0

We access that sheet data using the Google Sheets API.

This requires an API key.
Guide: https://developers.google.com/sheets/api/guides/authorizing?hl=en#APIKey
Management Console: https://console.developers.google.com/apis/
See google-sheets-api-key.json in this directory.

It also requires a Google Cloud Platform Project.
Guide: https://developers.google.com/sheets/api/quickstart/js
Management Console: https://console.cloud.google.com/home/dashboard
See google-cloud-platform-project-credentials.json in this directory.

Then the website pulls that data in.
Google Example: https://developers.google.com/sheets/api/samples/reading
See header-code-injection.js.
