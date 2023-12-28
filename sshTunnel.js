// sshTunnel.js
const { exec } = require('child_process');

let sshTunnel = exec('ssh -o "StrictHostKeyChecking=no" -i "nessh.pem" -L 27017:twynemedia.cluster-cauzbj835jsz.us-east-1.docdb.amazonaws.com:27017 ec2-user@ec2-54-158-231-233.compute-1.amazonaws.com -N', (error) => {
    if (error) {
        console.error(`SSH Tunnel error: ${error}`);
        process.exit(1); // Exit the script with an error code
    }
});

console.log('SSH Tunnel established.');

process.on('exit', () => {
    sshTunnel.kill('SIGTERM');
    console.log('SSH Tunnel closed.');
});
