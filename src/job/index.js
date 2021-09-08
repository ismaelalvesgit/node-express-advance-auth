import { CronJob } from "cron";
import axios from "axios";
import env from "../env";
import logger from "../logger";

logger.info("Registered service JOB batch is ON");

/** Auto healthcheck em cada 10 Minutos */
new CronJob("*/10 * * * *", async ()=>{
    logger.info(`Iniciando auto healthcheck: ${new Date().toLocaleString("pt-BR")}`);
    await axios.get(`http://localhost:${env.server.port}/system/healthcheck`);
    logger.info(`Finalizando auto healthcheck: ${new Date().toLocaleString("pt-BR")}`);
}, null, true, env.timezone);