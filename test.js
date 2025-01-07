const { WebhookConsole } = require("./index.js");

const wconsole = new WebhookConsole("https://discord.com/api/webhooks/765193588241858602/q4pOyYociRycIEmzqCqiOc_PwMDJQs1ER6mt7HVxCzYXUblksCk9tbaDHGjyfyyWzSzj");

wconsole.log("Log: %s", "formatted log");