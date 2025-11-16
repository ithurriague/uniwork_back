import {ERROR} from './errors.js';
import firebase from './firebase.js';
import Config from '../../config/config.js';


export async function generateFirebaseAuthToken(uid = 'test_user') {
    let res;
    try {
        const customToken = await firebase().auth().createCustomToken(uid);
        res = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${Config.webApiKey()}`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    token: customToken,
                    returnSecureToken: true,
                }),
            }
        );
    } catch (err) {
        throw new Error(`${ERROR.FAILED_TO_EXCHANGE_CUSTOM_TOKEN}: ${err.message}`);
    }

    const data = await res.json();
    if (!data.idToken) {
        throw new Error(`${ERROR.FAILED_TO_EXCHANGE_CUSTOM_TOKEN}: ${JSON.stringify(data)}`);
    }

    return data.idToken;
}
