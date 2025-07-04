import chalk from "chalk";
import dayjs from "dayjs";

class Logger {
    constructor(options) {
        this.options = {
            level: 'info',
            color: false,
            timestamp: false,
            prefix: 'generate',
            format: '[{level}] {message} {timestamp}',
        }
        this.options = { ...this.options, ...options };
    }
    formatMessage(message) {
        return `${this.options.prefix} ${message} ${this.options.timestamp ? dayjs().format('YYYY-MM-DD HH:mm:ss') : ''}`;
    }
    info(message) {
        console.log(chalk.green(this.formatMessage(message)));
    }
    error(message) {
        console.log(chalk.red(this.formatMessage(message)));
    }
    warn(message) {
        console.log(chalk.yellow(this.formatMessage(message)));
    }
    debug(message) {
        console.log(chalk.blue(this.formatMessage(message)));
    }
}

export default Logger;