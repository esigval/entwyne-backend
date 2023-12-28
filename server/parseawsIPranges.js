import https from 'https';
import fs from 'fs';

https.get('https://ip-ranges.amazonaws.com/ip-ranges.json', (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const ipRanges = JSON.parse(data);
    const usEast1Ips = ipRanges.prefixes.filter(item => item.region === 'us-east-1').map(item => item.ip_prefix);
    fs.writeFileSync('us-east-1-ips.txt', usEast1Ips.join('\n'));
    console.log('IP ranges for us-east-1 have been written to us-east-1-ips.txt');
  });

}).on('error', (err) => {
  console.log("Error: " + err.message);
});