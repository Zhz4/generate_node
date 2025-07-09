import { watch } from "./watch";
import { generator } from "@core/index";

export const dev = (selectedModules?: string[]) => {
  watch((event, path) => {
    generator.generate(selectedModules);
  });
};
