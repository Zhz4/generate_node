import chokidar from "chokidar";
import { WATCH_FILE } from "@core/constants";
import logger from "@core/logging";
import path from "path";
import { CONFIG_DIR } from "../constants";

export const watch = (cb: (event: string, path: string) => void) => {
  const watcher = chokidar.watch(WATCH_FILE, {
    persistent: true,
    atomic: true,
    cwd: path.join(process.cwd(), CONFIG_DIR),
    // 初始化时不触发事件
    ignoreInitial: true,
  });
  watcher.on("ready", () => {
    logger.info(`开发服务启动成功，监听文件变化`);
  });
  watcher.on("all", (event, path) => {
    const cbEvent = ["change", "add", "addDir", "unlink", "unlinkDir"];
    if (cbEvent.includes(event)) {
      cb(event, path);
    }
  });
};
