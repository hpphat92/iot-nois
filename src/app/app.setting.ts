export class AppSetting {
  public static API_ENDPOINT = 'http://192.168.1.242:44421/api/';
  // public static API_ENDPOINT = 'http://localhost:59292/api/';
  public static HUB_ENDPOINT = 'http://192.168.1.242:44421/';
  // for localhost
  // public static API_ENDPOINT = 'http://localhost:59291/api/';
  // public static HUB_ENDPOINT = 'http://localhost:59291/';
  public static pattern = {
    email: '[A-Za-z0-9]+([\\._-][A-Za-z0-9]+)*@[A-Za-z0-9]+([\\.-][A-Za-z0-9]+)*(\\.[A-Za-z]{2,4})',
    phone: '[\\d\\s]+',
  };
}
