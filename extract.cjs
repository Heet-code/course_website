const https = require('https');

https.get('https://cdde53b8.course-website-pages.pages.dev', (res) => {
  let html = '';
  res.on('data', d => html += d);
  res.on('end', () => {
    const match = html.match(/assets\/index-[a-zA-Z0-9_-]+\.js/);
    if (match) {
      const jsUrl = 'https://cdde53b8.course-website-pages.pages.dev/' + match[0];
      console.log('Fetching JS:', jsUrl);
      https.get(jsUrl, (jsRes) => {
        let js = '';
        jsRes.on('data', d => js += d);
        jsRes.on('end', () => {
          const keyMatch = js.match(/0x4AAAAAA[a-zA-Z0-9_-]+/g);
          if (keyMatch) {
            console.log('Found keys:', [...new Set(keyMatch)]);
          } else {
            console.log('No keys found');
          }
        });
      });
    } else {
      console.log('No JS bundle found');
    }
  });
});
