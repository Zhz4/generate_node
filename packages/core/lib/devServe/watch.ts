import chokidar from "chokidar";
import { WATCH_FILE } from "@core/constants";

export const watch = (cb: (event: string, path: string) => void) => {
  const watcher = chokidar.watch(WATCH_FILE, {
    persistent: true,
    atomic: true,
    cwd: process.cwd(),
    // 初始化时不触发事件
    ignoreInitial: true,
  });
  watcher.on("all", (event, path) => {
    cb(event, path);
  });
};
