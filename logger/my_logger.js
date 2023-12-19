const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;

// const currentDate = new Date();
// const year = currentDate.getFullYear();
// const month = String(currentDate.getMonth() + 1).padStart(2, '0');
// const day = String(currentDate.getDate()).padStart(2, '0');
// const formattedDate = `${year}-${month}-${day}`;

// const logger = createLogger({
//     level: 'debug',
//     format: combine(
//         label({ label: 'Logger!' }),
//         timestamp({
//             format: 'DD/MM/YYYY HH:mm'
//         }),
//         prettyPrint()
//     ),
//     transports: [
//         new transports.Console(),
//         new transports.File({
//             filename: `./logs/${formattedDate}.log`
//         })
//     ]
// });

module.exports = logger;;
