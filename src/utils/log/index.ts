import moment from 'moment'
import {appendFile} from 'fs'
import chalk from 'chalk'
import {Logger as LoggerORM, QueryRunner} from 'typeorm'

export enum TIPO_LOG {
    INFO    = 'INFO',
    ALERTA  = 'WARN',
    ERRO    = 'ERROR',
    DEBUG   = 'DEBUG'
}

function sintaxeHighLightSQL(query: string): string {
    return query.replace(/SELECT /g, chalk.blue('SELECT '))
    .replace(/ BETWEEN /g, chalk.blue(' BETWEEN '))
    .replace(/ RIGTH /g, chalk.blue(' RIGTH '))
    .replace(/ INNER /g, chalk.blue(' INNER '))
    .replace(/ WHERE /g, chalk.blue(' WHERE '))
    .replace(/ UNION /g, chalk.blue(' UNION '))
    .replace(/ LIMIT /g, chalk.blue(' LIMIT '))
    .replace(/ FROM /g, chalk.blue(' FROM '))
    .replace(/ LIKE /g, chalk.blue(' LIKE '))
    .replace(/ LEFT /g, chalk.blue(' LEFT '))
    .replace(/ JOIN /g, chalk.blue(' JOIN '))
    .replace(/ NULL /g, chalk.blue(' NULL '))
    .replace(/ AND /g, chalk.blue(' AND '))
    .replace(/ NOT /g, chalk.blue(' NOT '))
    .replace(/ ALL /g, chalk.blue(' ALL '))
    .replace(/ TOP /g, chalk.blue(' TOP '))
    .replace(/ AS /g, chalk.blue(' AS '))
    .replace(/ OR /g, chalk.blue(' OR '))
    .replace(/ IS /g, chalk.blue(' IS '))
    .replace(/ IN /g, chalk.blue(' IN '))
}

export class Logger implements LoggerORM {
    logQuery(query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
        let msg: string = `[${chalk.green.bold('SQL')}  ]: ${sintaxeHighLightSQL(query)}`
        Logger.log(msg)

        if (parameters) {
            parameters.forEach((p, i) => {
                msg = `[${chalk.green.bold('TRACE')}]: [$${i+1}] = ${p}`
                Logger.log(msg)
            })
        }
    }

    logQueryError(error: any, query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
        let mensagem = `${error.message}
        [${chalk.magenta.bold('TRACE')}]: ${error.stack}
        [${chalk.magenta.bold('QUERY')}] ${query}}`;
        
        if (parameters) {
            parameters.forEach((p, i) => {
                mensagem += `\n[$${i+1}] = ${p}`
            })
        }
        Logger.erro(mensagem);
    }

    logQuerySlow(time: number, query: string, parameters?: any[] | undefined, queryRunner?: QueryRunner | undefined) {
        throw new Error("Method not implemented.");
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner | undefined) {
        Logger.info(message);
    }

    logMigration(message: string, queryRunner?: QueryRunner | undefined) {
        throw new Error("Method not implemented.");
    }

    log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner | undefined) {
        let msg: string = `${chalk.gray.bold(Logger.getDataFormatada())} [${chalk.green.bold('SQL')}  ]: ${message}`
        Logger.log(msg)
    }

    private static getDataFormatada(): string {
        moment.updateLocale('pt-br');
        return `${moment().format('DD/MM/YYYY - hh:mm:ss.SSS')}`;
    }

    private static loggarEmArquivo(mensagem: string) {
        if (!process.env.LOG_PATH) return;

        mensagem = mensagem.replace(/[\u001b\u009b]\[.*?m/g, '') + '\n';
        let nomeArquivo = process.env.LOG_PATH + '\\' + moment().format('YYYYMMDD') + '.log';
        appendFile(nomeArquivo, mensagem, (err) => { 
            if (err) console.error(`Falha ao registrar arquivo de log: ${nomeArquivo} \n${err.message} \n${err.stack}`)
        });
    }

    public static log(msg: any, type?: TIPO_LOG ) {
        msg = (typeof msg === 'string') ? msg : JSON.stringify(msg);
        let msg_color = msg;
        let data = this.getDataFormatada();

        switch (type) {
            case TIPO_LOG.INFO:
                msg_color = `${chalk.gray.bold(data)} [${chalk.blue.bold(type)} ]: ${msg_color}`;
                console.info(msg_color);
                break;
            case TIPO_LOG.ALERTA:
                if ([TIPO_LOG.ALERTA, TIPO_LOG.DEBUG, TIPO_LOG.ERRO].find(e => e == process.env.LOG_LEVEL)) {
                    msg_color = `${chalk.gray.bold(data)} [${chalk.yellow.bold(type)} ]: ${msg_color}`
                    console.warn(msg_color)
                }
                break;
            case TIPO_LOG.ERRO:
                if ([TIPO_LOG.DEBUG, TIPO_LOG.ERRO].find(e => e == process.env.LOG_LEVEL)) {
                    msg_color = `${chalk.gray.bold(data)} [${chalk.red.bold(type)}]: ${msg_color}`
                    console.error(msg_color)
                }
                break;
            case TIPO_LOG.DEBUG:
                if ([TIPO_LOG.DEBUG].find(e => e == process.env.LOG_LEVEL)) {
                    msg_color = `${chalk.gray.bold(data)} [${chalk.cyan.bold(type)}]: ${msg_color}`
                    console.debug(msg_color)
                }
                break;
            default:
                msg_color = `${chalk.gray.bold(data)} ${msg_color}`
                console.log(msg_color)
                break;
        }

        this.loggarEmArquivo(msg_color);
    }

    public static info(msg: any) {
        this.log(msg, TIPO_LOG.INFO);
    }

    public static alerta(msg: any) {
        this.log(msg, TIPO_LOG.ALERTA);
    }

    public static erro(msg: any) {
        this.log(msg, TIPO_LOG.ERRO);
    }

    public static debug(msg: any) {
        this.log(msg, TIPO_LOG.DEBUG);
    }
}