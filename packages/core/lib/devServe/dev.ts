import { watch } from "./watch";
import { generator } from "@core/index";

export const dev = () => {
  watch((event, path) => {
    generator.generate();
  });
};
