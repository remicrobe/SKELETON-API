import * as express from 'express'

import config from './config'

import * as cors from 'cors'
import { templateRouter } from './route/template'

export class Index {
    static app = express()
    static router = express.Router()

    static globalConfig(){
        Index.app.use(cors())
        Index.app.use(express.json())
    }

    static routeConfig(){
        Index.app.use('/template', templateRouter)

    }

    static async serverConfig(){
        Index.app.listen(config.PORT, ()=> {
            console.log(`API démarrée sur le port ${config.PORT}....`)
            Index.app.emit("ready")
        })
    }

    static async main() {
        Index.globalConfig()
        Index.routeConfig()
        await Index.serverConfig()
    }

}

Index.main() 