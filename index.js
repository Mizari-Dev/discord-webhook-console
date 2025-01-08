const { WebhookClient, EmbedBuilder, resolveColor } = require("discord.js");
const { Console } = require('node:console');
const stream = require('stream');

class WebhookConsole{
    #assert_console
    #count_console
    #error_console
    #log_console
    #time_console
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
                write: function(chunk, encoding, next){
                    let embed = new EmbedBuilder({
                        title: "ASSERT",
                        color: resolveColor("Red"),
                        description: "```ansi\n"+chunk.toString()+"[0;0m```"
                    });
                
                    webhook.send({ embeds: [embed] });
                    next();
                }
            }),
            color: true
        });
        // Count
        this.#count_console = new Console({
            stdout: new stream.Writable({
                write: function(chunk, encoding, next){
                    let embed = new EmbedBuilder({
                        title: "COUNT",
                        color: resolveColor("Blurple"),
                        description: "```ansi\n"+chunk.toString()+"[0;0m```"
                    });
                
                    webhook.send({ embeds: [embed] });
                    next();
                }
            }),
            color: true
        });
        // Error
        this.#error_console = new Console({
            stdout: new stream.Writable({
                write: function(chunk, encoding, next){
                    let embed = new EmbedBuilder({
                        title: "ERROR",
                        color: resolveColor("Red"),
                        description: "```ansi\n"+"[0;31m"+chunk.toString()+"[0;0m```"
                    });
                
                    webhook.send({ embeds: [embed] });
                    next();
                }
            })
        });
        // Log
        this.#log_console = new Console({
            stdout: new stream.Writable({
                write: function(chunk, encoding, next){
                    let embed = new EmbedBuilder({
                        title: "LOG",
                        description: "```ansi\n"+chunk.toString()+"[0;0m```"
                    });
                
                    webhook.send({ embeds: [embed] });
                    next();
                }
            }),
            color: true
        });
        // Time
        this.#time_console = new Console({
            stdout: new stream.Writable({
                write: function(chunk, encoding, next){
                    let embed = new EmbedBuilder({
                        color: resolveColor("Blurple"),
                        title: "TIME",
                        description: "```ansi\n"+chunk.toString()+"[0;0m```"
                    });
                
                    webhook.send({ embeds: [embed] });
                    next();
                }
            }),
            color: true
        });
        // Warn
        this.#warn_console = new Console({
            stdout: new stream.Writable({
                write: function(chunk, encoding, next){
                    let embed = new EmbedBuilder({
                        color: resolveColor("Orange"),
                        title: "WARN",
                        description: "```ansi\n"+"[0;33m"+chunk.toString()+"[0;0m```"
                    });
                
                    webhook.send({ embeds: [embed] });
                    next();
                }
            })
        })
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
     * Maintains an internal counter specific to `label` and outputs to `stdout` the
     * number of times `wconsole.count()` has been called with the given `label`.
     *
     * ```js
     * > wconsole.count()
     * default: 1
     * > wconsole.count('default')
     * default: 2
     * > wconsole.count('abc')
     * abc: 1
     * > wconsole.count('xyz')
     * xyz: 1
     * > wconsole.count('abc')
     * abc: 2
     * > wconsole.count()
     * default: 3
     * >
     * ```
     * @since v1.0.0
     * @param [label='default'] The display label for the counter.
     */
    count(label='default'){
        this.#count_console.count(label);
    }

    /**
     * Resets the internal counter specific to `label`.
     *
     * ```js
     * > wconsole.count('abc');
     * abc: 1
     * > wconsole.countReset('abc');
     * > wconsole.count('abc');
     * abc: 1
     * >
     * ```
     * @since v1.0.0
     * @param [label='default'] The display label for the counter.
     */
    countReset(label='default'){
        this.#count_console.countReset(label);
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
    log(message, ...optionalParams) {
        this.#log_console.log(message, ...optionalParams);
    }

    /**
     * Try to construct a table with the columns of the properties of `tabularData` (or use `properties`) and rows of `tabularData` and log it. Falls back to just
     * logging the argument if it can't be parsed as tabular.
     *
     * ```js
     * // These can't be parsed as tabular data
     * wconsole.table(Symbol());
     * // Symbol()
     *
     * wconsole.table(undefined);
     * // undefined
     *
     * wconsole.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }]);
     * // ┌─────────┬─────┬─────┐
     * // │ (index) │  a  │  b  │
     * // ├─────────┼─────┼─────┤
     * // │    0    │  1  │ 'Y' │
     * // │    1    │ 'Z' │  2  │
     * // └─────────┴─────┴─────┘
     *
     * wconsole.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }], ['a']);
     * // ┌─────────┬─────┐
     * // │ (index) │  a  │
     * // ├─────────┼─────┤
     * // │    0    │  1  │
     * // │    1    │ 'Z' │
     * // └─────────┴─────┘
     * ```
     * @since v1.0.0
     * @param properties Alternate properties for constructing the table.
     */
    table(tabularData, properties){
        this.#log_console.table(tabularData, properties);
    }

    /**
     * Starts a timer that can be used to compute the duration of an operation. Timers
     * are identified by a unique `label`. Use the same `label` when calling {@link timeEnd} to stop the timer and sends the elapsed time in
     * suitable time units to `webhook`. For example, if the elapsed
     * time is 3869ms, `wconsole.timeEnd()` displays "3.869s".
     * @since v1.0.0
     * @param [label='default']
     */
    time(label='default'){
        this.#time_console.time(label);
    }

    /**
     * Stops a timer that was previously started by calling {@link time} and
     * sends the result to `webhook`:
     *
     * ```js
     * wconsole.time('bunch-of-stuff');
     * // Do a bunch of stuff.
     * wconsole.timeEnd('bunch-of-stuff');
     * // Sends: bunch-of-stuff: 225.438ms
     * ```
     * @since v1.0.0
     * @param [label='default']
     */
    timeEnd(label='default'){
        this.#time_console.timeEnd(label);
    }

    /**
     * For a timer that was previously started by calling {@link time}, sends
     * the elapsed time and other `data` arguments to `webhook`:
     *
     * ```js
     * wconsole.time('process');
     * const value = expensiveProcess1(); // Returns 42
     * wconsole.timeLog('process', value);
     * // Prints "process: 365.227ms 42".
     * doExpensiveProcess2(value);
     * wconsole.timeEnd('process');
     * ```
     * @since v1.0.0
     * @param [label='default']
     */
    timeLog(label='default', ...data){
        this.#time_console.timeLog(label, ...data);
    }

    /**
     * Sends to `webhook` the string `'Trace: '`, followed by the [`util.format()`](https://nodejs.org/docs/latest-v22.x/api/util.html#utilformatformat-args)
     * formatted message and stack trace to the current position in the code.
     *
     * ```js
     * wconsole.trace('Show me');
     * // Sends: (stack trace will vary based on where trace is called)
     * //  Trace: Show me
     * //    at repl:2:9
     * //    at REPLServer.defaultEval (repl.js:248:27)
     * //    at bound (domain.js:287:14)
     * //    at REPLServer.runBound [as eval] (domain.js:300:12)
     * //    at REPLServer.<anonymous> (repl.js:412:12)
     * //    at emitOne (events.js:82:20)
     * //    at REPLServer.emit (events.js:169:7)
     * //    at REPLServer.Interface._onLine (readline.js:210:10)
     * //    at REPLServer.Interface._line (readline.js:549:8)
     * //    at REPLServer.Interface._ttyWrite (readline.js:826:14)
     * ```
     * @since v1.0.0
     */
    trace(message, ...optionalParams){
        this.#log_console.trace(message, ...optionalParams);
    }

    /**
     * Sends to `webhook` with new embed. Multiple arguments can be passed, with the
     * first used as the primary message and all additional used as substitution
     * values similar to [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3.html)
     * (the arguments are all passed to [`util.format()`](https://nodejs.org/docs/latest-v22.x/api/util.html#utilformatformat-args)).
     *
     * ```js
     * const code = 5;
     * wconsole.warn('warn #%d', code);
     * // Sends: warn #5, to webhook
     * wconsole.warn('warn', code);
     * // Sends: warn 5, to webhook
     * ```
     *
     * If formatting elements (e.g. `%d`) are not found in the first string then
     * [`util.inspect()`](https://nodejs.org/docs/latest-v22.x/api/util.html#utilinspectobject-options) is called on each argument and the
     * resulting string values are concatenated. See [`util.format()`](https://nodejs.org/docs/latest-v22.x/api/util.html#utilformatformat-args)
     * for more information.
     * @since v1.0.0
     */
    warn(message, ...optionalParams){
        this.#warn_console.warn(message, ...optionalParams);
    }
}

module.exports = { WebhookConsole };