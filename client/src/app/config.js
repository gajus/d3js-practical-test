let API_URL,
    ENVIRONMENT;


API_URL = 'http://127.0.0.1:8000/';
ENVIRONMENT = process.env.NODE_ENV;

if (ENVIRONMENT !== 'development' && ENVIRONMENT !== 'production') {
    throw new Error('Unknown ENVIRONMENT.');
}

export {
    API_URL,
    ENVIRONMENT
};
