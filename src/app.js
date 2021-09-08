import express from "express";
import http from "http";
import https from "https";
import cors from "cors";
import helmet from "helmet";
import hidePoweredBy from "hide-powered-by";
import hsts from "hsts";
import xssFilter from "x-xss-protection";
import morgan from "morgan";
import swagger from "swagger-ui-express";
import YAML from "yamljs";
import { readFileSync } from "fs";
import path from "path";
import useragent from "express-useragent";
const swaggerDocument = YAML.load("./doc/swagger.yml");
import logger from "./logger";
import uuidMiddleware from "./middleware/uuidMiddleware";
import throttlingResquestMiddleware from "./middleware/throttlingResquestMiddleware";
import changeLocaleMiddleware from "./middleware/changeLocaleMiddleware";
import env from "./env";
import { requestCounters, responseCounters, injectMetricsRoute } from "./utils/metric";
import responseTime from "response-time";
import i18n from "./i18n";
import systemRouter from "./routes/system.routes";
import userRouter from "./routes/user.routes";
import roleRouter from "./routes/roles.routes";
import scopeRouter from "./routes/scopes.routes";
import authRouter from "./routes/auth.routes";
import clientCredentialsRouter from "./routes/clientCredentials.routes";

/** Instances */
const app = express();
const httpServer = env.server.ssl ? https.createServer({
    cert: readFileSync(env.security.ssl.cert),
    key: readFileSync(env.security.ssl.key),
}, app) : http.createServer(app);


/** Middlewares */
app.use(cors());
app.use(express.json({limit: env.server.bodyLimit}));
app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use(hsts({
    maxAge: 31536000,
    includeSubDomains: true, 
    preload: true
}));
app.use(xssFilter());
app.use(hidePoweredBy());
app.use(responseCounters);
app.use(requestCounters);
app.use(responseTime());
app.use(useragent.express());
app.use(uuidMiddleware);
app.use(i18n.init);
app.use(changeLocaleMiddleware);
app.use(throttlingResquestMiddleware);

/** Engine View */
app.set("view engine", "ejs");
app.set("views", "./src/views");

/** Assets */
app.use("/static", express.static(path.join(__dirname, "/public")));

/** Logger */
morgan.token("id", (req)=>{
    return req.id;
});
morgan.token("date", function() {
    return new Date().toLocaleString("pt-BR");
});
morgan.token("body", (req) => JSON.stringify(req.body));

app.use(morgan(":id :remote-addr - :remote-user [:date[clf]] \":method :url HTTP/:http-version\" :status :res[content-length] :body \":referrer\" \":user-agent\"", {
    stream: logger.stream
}));

/** Routers */
app.get("/", (req, res)=>{
    res.render("index");
});
app.use("/api-doc", swagger.serve, swagger.setup(swaggerDocument));
app.use("/system", systemRouter);
app.use("/user", userRouter);
app.use("/role", roleRouter);
app.use("/scope", scopeRouter);
app.use("/credentials", clientCredentialsRouter);
app.use("/auth", authRouter);
app.all("*", (req, res)=>{
    res.status(404).json({message: "Rota Não Encontrada"});
});

/** Metric Endpoint */
injectMetricsRoute(app);

export { app, httpServer };