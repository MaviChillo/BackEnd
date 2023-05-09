import winston from "winston"
import config from '../config.js'

const LevelsLogs = {
    names:{
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors:{
        fatal: 'bold red',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'cyan',
        debug: 'magenta'
    }
}

winston.addColors(LevelsLogs.colors);

let logger

if(config.node_env === 'development'){
    logger = winston.createLogger({
        levels: LevelsLogs.names,
        transports: [
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize({colors:LevelsLogs.colors}),
                    winston.format.simple()
                )
            })
        ]
    })
}else{
    logger = winston.createLogger({
        levels: LevelsLogs.names,
        transports: [
            new winston.transports.File({
                level: 'info',
                filename: './errors.log',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.prettyPrint(),
                    // winston.format.label({label: 'Este es un log de Stage'})
                )
            })
        ]
    })
}

export default logger