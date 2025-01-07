# discord-webhook-console
Like JavaScript `console` object but work with Discord webhooks.

Exemple of use:
```javascript
const { WebhookLogger, LogContent, LEVEL } = require("discord-webhook-logger");

// Create the webhook
const wl = new WebhookLogger("https://discord.com/api/webhooks/{webhook_id}/{webhook_token}");
// Create logs
const contents = [
    new LogContent(LEVEL.Valid, "Log sent!")
];
// Send logs
wl.send("NOTIF", contents);
```
