const { WebhookClient, EmbedBuilder, resolveColor } = require("discord.js");

/**
 * The type of log
 */
const LEVEL = {
    Info: "info",
    Valid: "valid",
    Warn: "warn",
    Error: "error"
}

class WebhookLogger{
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
    async send(title, contents) {
        if (contents.constructor !== Array){
            throw new Error("Expected array of LogContent");
        }

        let content = "";
        for (let i = 0; i < contents.length; i++) {
            if (contents[i].constructor !== LogContent)
                continue;
            content += contents[i].getContent()+"\n"
        }

        if (content === ""){
            throw new Error("None of the content is valid");
        }

        var embed = new EmbedBuilder({
            color: {
                "info": resolveColor("#75C5D6"),
                "valid": resolveColor("#A5EA78"),
                "warn": resolveColor("#FFCC4D"),
                "error": resolveColor("#FF6464")
            }[contents[0].level] || resolveColor("#2B2D31"),
            title: title,
            description: content
        });
    
        await this.webhook.send({ embeds: [embed] });
    }
}


class LogContent{
    #content;

    /**
     * Get the content of this log
     * @returns The log content
     */
    getContent(){
        return this.#parseContent();
    }

    /**
     * The log to send
     * @param {LEVEL} level The type of log
     * @param {String} content The message of the log
     */
    constructor(level, content){
        this.level = level
        this.#content = content
    }

    /**
     * Parse the content of this log
     * @returns {String} Content parsed
     */
    #parseContent(){
        return "```"+({
            "info": "fix\n",
            "valid": "diff\n+ ",
            "error": "diff\n- "
        }[this.level] || "")+this.#content.replaceAll("\n", {
            "valid": "\n+ ",
            "error": "\n- "
        }[this.level] || "\n")+"```"
    }
}

module.exports = { LEVEL, WebhookLogger, LogContent };