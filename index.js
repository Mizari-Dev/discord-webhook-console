const { WebhookClient, EmbedBuilder, resolveColor } = require("discord.js");
const util = require("util");

class WebhookConsole{
    /**
     * The webhook to send logs to
     * @param {String} url The URL of the Discord webhook
     */
    constructor(url){
        this.webhook = new WebhookClient({ url: url });
    }

    /**
     * Send the log to the webhook
     * @param {String} content The content to send 
     * @param {String} type The type of log to send
     */
    async #send(content, type){
        var embed = new EmbedBuilder({
            color: ({
                "error": resolveColor("#A3332C")
            }[type] || resolveColor("#2B2D31")),
            title: type.toUpperCase(),
            description: "```ansi\n"+({
                "error": "[0;31m",
                "warn": "[0;33m"
            }[type] || "")+content+"[0;0m```"
        });
    
        await this.webhook.send({ embeds: [embed] });
    }

    /**
     * `wconsole.assert()` writes a message if `value` is [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) or omitted. It only
     * writes a message and does not otherwise affect execution. The output always
     * starts with `"Assertion failed"`. If provided, `message` is formatted using
     * [`util.format()`](https://nodejs.org/docs/latest-v22.x/api/util.html#utilformatformat-args).
     *
     * If `value` is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), nothing happens.
     *
     * ```js
     * wconsole.assert(true, 'does nothing');
     *
     * wconsole.assert(false, 'Whoops %s work', 'didn\'t');
     * // Assertion failed: Whoops didn't work
     *
     * wconsole.assert();
     * // Assertion failed
     * ```
     * @since v1.0.0
     * @param {Boolean} value The value tested for being truthy.
     * @param {String} message All arguments besides `value` are used as error message.
     */
    async assert(value, message, ...optionalParams){

        if (!value){
            const content = util.format(message, ...optionalParams);
            const result = ["Assertion failed"];
            if (content !== "undefined")
                result.push(content);

            this.#send(result.join(": "), "assert");
        }
    }

    /**
     * Prints to `webhook` with new embed. Multiple arguments can be passed, with the
     * first used as the primary message and all additional used as substitution
     * values similar to [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3.html)
     * (the arguments are all passed to [`util.format()`](https://nodejs.org/docs/latest-v22.x/api/util.html#utilformatformat-args)).
     *
     * ```js
     * const count = 5;
     * wconsole.log('count: %d', count);
     * // Sends: count: 5, to webhook
     * console.log('count:', count);
     * // Sends: count: 5, to webhook
     * ```
     *
     * See [`util.format()`](https://nodejs.org/docs/latest-v22.x/api/util.html#utilformatformat-args) for more information.
     * @since v1.0.0
     */
    async log(message, ...optionalParams) {
        const content = util.format(message, ...optionalParams);

        await this.#send(content, "log");
    }
}

module.exports = { WebhookConsole };