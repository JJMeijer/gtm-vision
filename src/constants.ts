export const GTM_REGEXP = /^GTM-[A-Z0-9]{6,8}$/;

export enum GtmIdError {
    NotFound = "notFound",
    ParseError = "parseError",
}
