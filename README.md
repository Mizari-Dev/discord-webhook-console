# discord-webhook-console
Like JavaScript `console` object but works with Discord webhooks.

Exemple of use:
```javascript
const { WebhookConsole } = require("./index.js");

// create the webhook console with a Discord webhook URL
const wconsole = new WebhookConsole("https://discord.com/api/webhooks/{webhook_id}/{webhook_token}");

// assert log
wconsole.assert(false, "Assert test");
// count log
wconsole.count("Count test");
wconsole.count("Count test");
wconsole.countReset("Count test");
wconsole.count("Count test");
// default log
wconsole.debug("Debug test");
wconsole.info("Info test");
wconsole.log("Log test");
// error log
wconsole.error("Error test");
// table log
wconsole.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }]);
// time log
wconsole.time("Time test");
wconsole.timeLog("Time test");
wconsole.timeEnd("Time test");
// trace log
wconsole.trace("Trace test");
// warn log
wconsole.warn("Warn test");
```
