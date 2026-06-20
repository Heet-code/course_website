const https = require('https');

const options = {
  hostname: 'api.render.com',
  port: 443,
  path: '/v1/services/srv-d8mhb51o3t8c73bqh000/deploys/dep-d8reep3eo5us73d9jbig',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer rnd_WMD3bkkGM57Bk22ZNP9ExSWBzPWP',
    'Accept': 'application/json'
  }
};

https.get(options, (res) => {
  let body = '';
  res.on('data', (d) => { body += d; });
  res.on('end', () => {
    console.log(JSON.stringify(JSON.parse(body), null, 2));
  });
}).on('error', (error) => {
  console.error(error);
});
