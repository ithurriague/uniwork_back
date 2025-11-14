import {readFileSync} from 'fs';
import path from 'path';

import firebase from 'firebase-admin';

import {ERROR} from './errors.js';
import Config from '../../config/config.js';

let app = null;
export default function getFirebase() {
    if (app) {
        return app;
    }

    try {
        const absCredentialsPath = path.resolve(Config.credentialsPath());
        const raw = readFileSync(absCredentialsPath, 'utf-8');
        const credentials = JSON.parse(raw);

        app = firebase.initializeApp({
            credential: firebase.credential.cert(credentials),
        });
    } catch (err) {
        throw new Error(`${ERROR.FAILED_TO_INITIALIZE}:${err.message}`);
    }

    return app;
}