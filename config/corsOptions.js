const allowOrigins = require('./allowOrigins');
const corsOptions = {
    origin: (origin, callback) => {     // !origin) => origin est lurl de l'origine de la requete  de postman puisque postman mayb33ethetcvh domauin name 
        if (allowOrigins.indexOf(origin)!==-1 || !origin) {
            callback(null, true); //true value of origine   et null est lerror 
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204

};

module.exports = corsOptions;
