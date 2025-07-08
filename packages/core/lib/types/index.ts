export * from "./logger";
export interface Template {
  name: string;
  outputName: string;
}

export interface Module {
  name: string;
  configList: string[];
  templates: Template[];
}
