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
     * Send logs via webhook
     * @param {String} title The title of this log
     * @param {LogContent[]} contents Array of LogContent
     */
    async log() {
        const content = util.format(...arguments);

        var embed = new EmbedBuilder({
            title: "LOG",
            description: "```ansi\n"+content+"```"
        });
    
        await this.webhook.send({ embeds: [embed] });
    }
}

module.exports = { WebhookConsole };