import { validateProductionEnvironment } from "./runtime-config.mjs";

const result = validateProductionEnvironment(process.env);
if (result.ok) {
  console.log("Production environment contract: PASS");
} else {
  console.error("Production environment contract: FAIL");
  for (const failure of result.failures) console.error(`- ${failure}`);
  process.exitCode = 1;
}

