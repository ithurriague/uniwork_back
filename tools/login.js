import {generateFirebaseAuthToken} from '../common/auth/generate_firebase_auth_token.js';

const uidParamIndex = 2;
try {
    const dotenv = await import('dotenv');
    dotenv.config();

    const token = await generateFirebaseAuthToken(process.argv[uidParamIndex]);
    console.log(token);
} catch (err) {
    console.error('Error generating token:', err);
    process.exit(1);
}
