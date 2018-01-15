export class AppSetting {
    public static API_ENDPOINT = '/api/';
    // for localhost
    // public static API_ENDPOINT = 'http://localhost:59291/api/';
    public static pattern = {
        email: '[A-Za-z0-9]+([\\._-][A-Za-z0-9]+)*@[A-Za-z0-9]+([\\.-][A-Za-z0-9]+)*(\\.[A-Za-z]{2,4})',
        phone: '[\\d\\s]+'
    };
}