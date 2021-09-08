import env from './src/env';
import errorHandler from './src/middleware/errorMiddleware';
import logger from './src/logger';
import { startCollection } from './src/utils/metric';
import { httpServer, app } from './src/app';

setImmediate(() =>{
    if(env.server.active){
        httpServer.listen(env.server.port, ()=>{
            app.use(errorHandler)
            import('./src/job')
            startCollection()
            logger.info(`Server on http://localhost:${env.server.port}`)
        })
    }
})