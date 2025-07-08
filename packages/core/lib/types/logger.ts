export const LoggerLevel = {
  INFO: "INFO",
  SUCCESS: "SUCCESS",
  WARN: "WARN",
  ERROR: "ERROR",
  DEBUG: "DEBUG",
} as const;

export interface LoggerLevelConfig {
  icon: string;
  color: (text: string) => string;
  bgColor: (text: string) => string;
  label: (typeof LoggerLevel)[keyof typeof LoggerLevel];
}
