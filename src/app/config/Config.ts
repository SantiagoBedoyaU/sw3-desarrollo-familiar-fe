const Config = {
  // LOGIC_URL: 'http://localhost:8000/api/',
  LOGIC_URL: 'https://hollow-allys-santiagobedoya-bcfdf10a.koyeb.app/api/',
  defaultConfig: {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  } as { headers: Record<string, string> },
}

export default Config
