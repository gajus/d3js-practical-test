let API_URL,
    ENVIRONMENT;


API_URL = 'http://127.0.0.1:8000/';
/* eslint-disable no-process-env */
ENVIRONMENT = process.env.NODE_ENV;
/* eslint-enable */

if (ENVIRONMENT !== 'development' && ENVIRONMENT !== 'production') {
    throw new Error('Unknown ENVIRONMENT.');
}

export {
    API_URL,
    ENVIRONMENT
};
