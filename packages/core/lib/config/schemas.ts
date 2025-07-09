import { z } from "zod";

export const ConfigSchema = z.object({
  name: z.string(),
  configList: z.array(z.string()),
  outputDir: z.string(),
  templates: z.array(
    z.object({
      name: z.string(),
      outputName: z.string(),
    })
  ),
});
