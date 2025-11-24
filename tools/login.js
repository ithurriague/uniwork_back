import {generateFirebaseAuthToken} from '../common/auth/generate_firebase_auth_token.js';
import log from '../common/log/pino.js';

const uidParamIndex = 2;
try {
    const dotenv = await import('dotenv');
    dotenv.config();

    const token = await generateFirebaseAuthToken(process.argv[uidParamIndex]);
    log.info(token);
} catch (err) {
    log.error(err, 'error generating token:');
    process.exit(1);
}
