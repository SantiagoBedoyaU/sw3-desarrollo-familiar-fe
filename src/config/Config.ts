const Config = {
  LOGIC_URL: 'http://127.0.0.1:3000/',
  defaultConfig: {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  } as { headers: Record<string, string> },
}

export default Config
