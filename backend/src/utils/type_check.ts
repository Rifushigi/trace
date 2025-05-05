import { requiredEnvVars } from "../config/index.js";
import { ValueError } from "../middlewares/index.js";

export function isEnvDefined(): void {
    if (process.env.LOCAL_DATABASE_URL) {
        const EnvVars = requiredEnvVars.filter((value) => value !== "PRD_DATABASE_URL");
        for (const key of EnvVars) {
            if (!process.env[key]) throw new ValueError("Env variable is not defined", `${key} is not defined`);
        }
        return
    }
    for (const key of requiredEnvVars) {
        if (!process.env[key]) throw new ValueError("Env variable is not defined", `${key} is not defined`);
    }
    return
}