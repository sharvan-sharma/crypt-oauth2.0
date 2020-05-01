const appRoot = require('app-root-path')
const { createLogger, format, transports } =  require('winston');
const { combine, timestamp, label, prettyPrint } = format;
//levels priority
const levels = { 
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};
// define the custom settings for each transport (file, console)
var options = {
  file: {
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 10,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// instantiate a new Winston Logger with the settings defined above
var winslog = createLogger({
  level:'debug',
  format:combine(
        timestamp(),
        prettyPrint()
  ),
  transports: [
    new transports.File({...options.file,filename:'./combined.log'}),
    new transports.File({...options.file,filename:'./error.log',level:'error'}),
     new transports.File({...options.file,filename:'./info.log',level:'info'}),
    new transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

module.exports = winslog