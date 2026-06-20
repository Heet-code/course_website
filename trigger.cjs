const https = require('https');

const triggerOptions = {
  hostname: 'api.render.com',
  port: 443,
  path: '/v1/services/srv-d8mhb51o3t8c73bqh000/deploys',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer rnd_WMD3bkkGM57Bk22ZNP9ExSWBzPWP',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

const req = https.request(triggerOptions, (res) => {
  let body = '';
  res.on('data', (d) => { body += d; });
  res.on('end', () => {
    console.log(`Triggered: ${res.statusCode}`);
    console.log(`Body: ${body}`);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(JSON.stringify({ clearCache: 'do_not_clear' }));
req.end();
