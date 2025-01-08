const { WebhookConsole } = require("./index.js");

const wconsole = new WebhookConsole("[webhook url]");

wconsole.assert(false, "Assert test");
wconsole.count("Count test");
wconsole.count("Count test");
wconsole.countReset("Count test");
wconsole.count("Count test");
wconsole.debug("Debug test");
wconsole.error("Error test");
wconsole.info("Info test");
wconsole.log("Log test");
wconsole.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }]);
wconsole.time("Time test");
wconsole.timeLog("Time test");
wconsole.timeEnd("Time test");
wconsole.trace("Trace test");
wconsole.warn("Warn test");