import { Server } from '@overnightjs/core'
import * as bodyParse from 'body-parser'
import {UsuarioController} from './controllers/usuario.controller'
import {Logger} from './utils/log'
import { initBD } from './config/bd';
import { Application } from 'express';

export class Servidor extends Server {
    private static servidor: Servidor;
    private _port: number;
    
    private constructor() {
        super();
        
        this._port = Number(process.env.PORT) || 3000;
        this.app.use(bodyParse.json());
        this.app.use(bodyParse.urlencoded({extended: true}));

        this.addControllers([
            new UsuarioController()
        ]);
    }

    private start(): Promise<Application> {
        return new Promise((sucesso, falha) => {
            this.app.listen(this._port, _ => {
                Logger.log(`Servidor iniciado na porta ${this._port}`)
                initBD()
                sucesso(this.app)
            })
        })
    }

    public static init(): Promise<Application> {
        this.servidor = new Servidor()
        return this.servidor.start();
    }
}

Servidor.init();