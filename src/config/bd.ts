
import "reflect-metadata";
import {createConnection, Connection} from "typeorm"
import { Usuario } from "../models/usuario.model";
import { Logger } from "../utils/log";

export function initBD(): Promise<void> {
    return new Promise((sucesso, falha) => {
        let tipo: any = process.env.BD_TYPE || 'postgres';

        createConnection({
            type: tipo,
            host: process.env.BD_HOST || 'localhost',
            port:  Number(process.env.BD_PORT) || 5432,
            database: process.env.BD || 'emprestei',
            username: process.env.BD_USER || 'app',
            password: process.env.BD_PASS || 'dados',
            entities: [
                Usuario
            ],
            logger: new Logger(),
            logging: "all"
        })
        .then((_conn: Connection) => {
            Logger.info("Conexão com banco de dados realizada com sucesso!")
            sucesso()
        })
        .catch((error: any) => {
            Logger.erro(error)
            falha(error)
        })
    })
}