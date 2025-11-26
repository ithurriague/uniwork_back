export const ERROR = {
    MISSING_BEARER_TOKEN: `missing bearer token 'Bearer \${TOKEN}' in 'Authorization' header `,
    INVALID_OR_EXPIRED_BEARER_TOKEN: `invalid or expired token`,
    FAILED_TO_INITIALIZE: `failed to initialize firebase`,
    FAILED_TO_EXCHANGE_CUSTOM_TOKEN: `failed to exchange custom token for firebase token`,
    MISSING_REQUEST_USER: `missing user in request`,
    MISSING_USER_ROLE: `missing user role`,
    INSUFFICIENT_PERMISSIONS: `user has insufficient permissions to access this resource`,
    AUTHORIZATION_FAILED: `an error ocurred during authorization`,
    ROLE_NOT_FOUND: `role not found`,
};
