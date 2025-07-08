import chalk from "chalk";
import dayjs from "dayjs";
import { LoggerLevel, LoggerLevelConfig } from "../types/logger";

chalk.level = 1;

const levelConfig = {
  INFO: {
    icon: "✨",
    color: chalk.cyan,
    bgColor: chalk.bgCyan.black,
    label: LoggerLevel.INFO,
  },
  SUCCESS: {
    icon: "✅",
    color: chalk.green,
    bgColor: chalk.bgGreen.black,
    label: LoggerLevel.SUCCESS,
  },
  WARN: {
    icon: "⚠️ ",
    color: chalk.yellow,
    bgColor: chalk.bgYellow.black,
    label: LoggerLevel.WARN,
  },
  ERROR: {
    icon: "❌",
    color: chalk.red,
    bgColor: chalk.bgRed.white,
    label: LoggerLevel.ERROR,
  },
  DEBUG: {
    icon: "🔍",
    color: chalk.blue,
    bgColor: chalk.bgBlue.white,
    label: LoggerLevel.DEBUG,
  },
};
class Logger {
  private levelConfig: Record<keyof typeof LoggerLevel, LoggerLevelConfig>;
  constructor() {
    this.levelConfig = levelConfig;
  }

  formatMessage(level: keyof typeof LoggerLevel, message: string) {
    const config = this.levelConfig[level];
    const timestamp = chalk.gray(`[${dayjs().format("HH:mm:ss")}]`);
    let formattedMessage = "";
    if (config) {
      const icon = config.icon;
      const levelLabel = config.bgColor(` ${config.label} `) as string;
      const coloredMessage = config.color(message);
      formattedMessage = `${icon} ${levelLabel} ${coloredMessage} ${timestamp}`;
    } else {
      formattedMessage = `${level} ${message} ${timestamp}`;
    }

    return formattedMessage;
  }

  log(level: keyof typeof LoggerLevel, message: string, extraInfo = "") {
    const formattedMessage = this.formatMessage(level, message);
    if (extraInfo) {
      console.log(formattedMessage);
      console.log(chalk.gray(`    └─ ${extraInfo}`));
    } else {
      console.log(formattedMessage);
    }
  }
  separator(char = "─", length = 50) {
    console.log(chalk.gray(char.repeat(length)));
  }

  info(message: string, extraInfo = "") {
    this.log(LoggerLevel.INFO, message, extraInfo);
  }

  success(message: string, extraInfo = "") {
    this.log(LoggerLevel.SUCCESS, message, extraInfo);
  }

  error(message: string, extraInfo = "") {
    this.log(LoggerLevel.ERROR, message, extraInfo);
  }

  warn(message: string, extraInfo = "") {
    this.log(LoggerLevel.WARN, message, extraInfo);
  }

  debug(message: string, extraInfo = "") {
    this.log(LoggerLevel.DEBUG, message, extraInfo);
  }
}

export default new Logger();
