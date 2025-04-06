export default class Config {
  public static readonly LOGIC_URL: string = 'http://127.0.0.1:3000/'
  public static readonly defaultConfig: Record<string, any> = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }
}
