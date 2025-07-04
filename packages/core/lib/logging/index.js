import chalk from "chalk";
import dayjs from "dayjs";

chalk.level = 1;

class Logger {
    constructor(options) {
        this.options = {
            level: 'info',
            color: true,
            timestamp: true,
            prefix: 'generate',
            format: '{icon} {level} {message} {timestamp}',
            showBorder: false,
        }
        this.options = { ...this.options, ...options };
        
        if (this.options.color) {
            process.env.FORCE_COLOR = '1';
        }
        
        this.levelConfig = {
            INFO: {
                icon: '✨',
                color: chalk.cyan,
                bgColor: chalk.bgCyan.black,
                label: 'INFO '
            },
            SUCCESS: {
                icon: '✅',
                color: chalk.green,
                bgColor: chalk.bgGreen.black,
                label: 'SUCC'
            },
            WARN: {
                icon: '⚠️ ',
                color: chalk.yellow,
                bgColor: chalk.bgYellow.black,
                label: 'WARN'
            },
            ERROR: {
                icon: '❌',
                color: chalk.red,
                bgColor: chalk.bgRed.white,
                label: 'ERR '
            },
            DEBUG: {
                icon: '🔍',
                color: chalk.blue,
                bgColor: chalk.bgBlue.white,
                label: 'DEBG'
            }
        };
    }
    
    formatMessage(level, message) {
        const config = this.levelConfig[level];
        const timestamp = this.options.timestamp ? 
            chalk.gray(`[${dayjs().format('HH:mm:ss')}]`) : '';
        
        let formattedMessage = '';
        
        if (this.options.color && config) {
            // 美化的格式
            const icon = config.icon;
            const levelLabel = config.bgColor(` ${config.label} `);
            const coloredMessage = config.color(message);
            const prefix = chalk.magenta.bold(`[${this.options.prefix}]`);
            
            formattedMessage = `${prefix} ${icon} ${levelLabel} ${coloredMessage} ${timestamp}`;
        } else {
            // 无颜色的格式
            formattedMessage = `[${this.options.prefix}] [${level}] ${message} ${timestamp}`;
        }
        
        return formattedMessage;
    }
    
    log(level, message, extraInfo = '') {
        const formattedMessage = this.formatMessage(level, message);
        if (extraInfo) {
            console.log(formattedMessage);
            console.log(chalk.gray(`    └─ ${extraInfo}`));
        } else {
            console.log(formattedMessage);
        }
    }
    
    separator(char = '─', length = 50) {
        if (this.options.color) {
            console.log(chalk.gray(char.repeat(length)));
        } else {
            console.log(char.repeat(length));
        }
    }
    
    // 添加标题
    title(text) {
        const border = '═'.repeat(text.length + 4);
        if (this.options.color) {
            console.log(chalk.cyan(border));
            console.log(chalk.cyan(`║ ${chalk.bold(text)} ║`));
            console.log(chalk.cyan(border));
        } else {
            console.log(border);
            console.log(`║ ${text} ║`);
            console.log(border);
        }
    }
    
    info(message, extraInfo = '') {
        this.log('INFO', message, extraInfo);
    }
    
    success(message, extraInfo = '') {
        this.log('SUCCESS', message, extraInfo);
    }
    
    error(message, extraInfo = '') {
        this.log('ERROR', message, extraInfo);
    }
    
    warn(message, extraInfo = '') {
        this.log('WARN', message, extraInfo);
    }
    
    debug(message, extraInfo = '') {
        this.log('DEBUG', message, extraInfo);
    }
    
    // 进度相关的方法
    step(stepNumber, totalSteps, message) {
        const progress = chalk.cyan(`[${stepNumber}/${totalSteps}]`);
        const arrow = chalk.blue('▶');
        if (this.options.color) {
            console.log(`${progress} ${arrow} ${chalk.white(message)}`);
        } else {
            console.log(`[${stepNumber}/${totalSteps}] > ${message}`);
        }
    }
    
    // 表格式输出
    table(data) {
        if (Array.isArray(data) && data.length > 0) {
            console.log();
            data.forEach((row, index) => {
                const prefix = chalk.gray(`${String(index + 1).padStart(2, '0')}│`);
                console.log(`${prefix} ${row}`);
            });
            console.log();
        }
    }
    
    // 代码块输出
    code(code, language = 'javascript') {
        const border = '─'.repeat(60);
        console.log(chalk.gray(border));
        console.log(chalk.gray(`Language: ${language}`));
        console.log(chalk.gray(border));
        console.log(chalk.white(code));
        console.log(chalk.gray(border));
    }
}

export default new Logger({mestamp: true});