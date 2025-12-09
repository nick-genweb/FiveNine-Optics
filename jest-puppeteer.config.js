module.exports = {
  launch: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    defaultViewport: {
      width: 1440,
      height: 900,
    },
  },
  server: {
    command: 'npm start',
    port: 8081,
    launchTimeout: 30000,
    options: {
      env: {
        ...process.env,
        NODE_ENV: 'test',
      },
    },
  },
};
