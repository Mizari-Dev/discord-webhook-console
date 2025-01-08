const { WebhookClient, EmbedBuilder, resolveColor } = require("discord.js");
const util = require("node:util");
const { Console } = require('node:console');
const stream = require('stream');

class WebhookConsole{
    #assert_console
    #error_console
    #log_console
    #warn_console

    /**
     * The webhook to send logs to
     * @param {String} url The URL of the Discord webhook
     */
    constructor(url){
        const webhook = new WebhookClient({ url: url });
        // Assert
        this.#assert_console = new Console({
            stdout: new stream.Writable({
                write: function(chunk){
                    let embed = new EmbedBuilder({
                        title: "ASSERT",
                        color: resolveColor("Red"),
                        description: "```ansi\n"+chunk.toString()+"[0;0m```"
                    });
                
                    webhook.send({ embeds: [embed] });
                }
            }),
            color: true
        });
        // Error
        this.#error_console = new Console({
            stdout: new stream.Writable({
                write: function(chunk){
                    let embed = new EmbedBuilder({
                        title: "ERROR",
                        color: resolveColor("Red"),
                        description: "```ansi\n"+"[0;31m"+chunk.toString()+"[0;0m```"
                    });
                
                    webhook.send({ embeds: [embed] });
                }
            })
        });
        // Log
        this.#log_console = new Console({
            stdout: new stream.Writable({
                write: function(chunk){
                    let embed = new EmbedBuilder({
                        title: "LOG",
                        description: "```ansi\n"+chunk.toString()+"[0;0m```"
                    });
                
                    webhook.send({ embeds: [embed] });
                }
            }),
            color: true
        });
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
    assert(value, message, ...optionalParams){
        this.#assert_console.assert(value, message, ...optionalParams);
    }

    /**
     * The `wconsole.debug()` function is an alias for {@link log}.
     * @since v1.0.0
     */
    debug(message, ...optionalParams){
        this.log(message, ...optionalParams);
    }

    /**
     * Sends to `webhook` with new embed. Multiple arguments can be passed, with the
     * first used as the primary message and all additional used as substitution
     * values similar to [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3.html)
     * (the arguments are all passed to [`util.format()`](https://nodejs.org/docs/latest-v22.x/api/util.html#utilformatformat-args)).
     *
     * ```js
     * const code = 5;
     * wconsole.error('error #%d', code);
     * // Sends: error #5, to webhook
     * wconsole.error('error', code);
     * // Sends: error 5, to webhook
     * ```
     *
     * If formatting elements (e.g. `%d`) are not found in the first string then
     * [`util.inspect()`](https://nodejs.org/docs/latest-v22.x/api/util.html#utilinspectobject-options) is called on each argument and the
     * resulting string values are concatenated. See [`util.format()`](https://nodejs.org/docs/latest-v22.x/api/util.html#utilformatformat-args)
     * for more information.
     * @since v1.0.0
     */
    error(message, ...optionalParams){
        this.#error_console.error(message, ...optionalParams);
    }

    /**
     * The `wconsole.info()` function is an alias for {@link log}.
     * @since v1.0.0
     */
    info(message, ...optionalParams){
        this.log(message, ...optionalParams);
    }

    /**
     * Sends to `webhook` with new embed. Multiple arguments can be passed, with the
     * first used as the primary message and all additional used as substitution
     * values similar to [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3.html)
     * (the arguments are all passed to [`util.format()`](https://nodejs.org/docs/latest-v22.x/api/util.html#utilformatformat-args)).
     *
     * ```js
     * const count = 5;
     * wconsole.log('count: %d', count);
     * // Sends: count: 5, to webhook
     * wconsole.log('count:', count);
     * // Sends: count: 5, to webhook
     * ```
     *
     * See [`util.format()`](https://nodejs.org/docs/latest-v22.x/api/util.html#utilformatformat-args) for more information.
     * @since v1.0.0
     */
    async log(message, ...optionalParams) {
        this.#log_console.log(message, ...optionalParams);
    }
}

module.exports = { WebhookConsole };