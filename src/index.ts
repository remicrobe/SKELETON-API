import * as express from 'express'

import config from './config'

import * as cors from 'cors'
import {AppDataSource} from "./database/datasource";
import { countriesRouter } from './route/countries';
import { groupsRouter } from './route/groups';
import { simulateRouter } from './route/simulate';
import { competitionsRouter } from './route/competitions';

export class Index {
    static app = express()
    static router = express.Router()

    static globalConfig(){
        Index.app.use(cors())
        Index.app.use(express.json())
    }

    static routeConfig(){
        Index.app.use('/countries', countriesRouter)
        Index.app.use('/groups', groupsRouter)
        Index.app.use('/simulate', simulateRouter)
        Index.app.use('/competitions', competitionsRouter)
        Index.app.get('/', (req,res)=>{
            res.send('Travail de Tess & Rémi')
        })

    }

    static async serverConfig(){
        await AppDataSource.initialize().then(async () => {
            console.log("Connecté a la base de données")
            Index.app.listen(config.PORT, ()=> {
                console.log(`API démarrée sur le port ${config.PORT}....`)
                Index.app.emit("ready")
            })
        }).catch(error => console.log(error))

    }

    static async main() {
        Index.globalConfig()
        Index.routeConfig()
        await Index.serverConfig()
    }

}

Index.main() 