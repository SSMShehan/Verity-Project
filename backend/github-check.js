const axios = require('axios');

async function check(owner, repo) {
    try {
        const url = `https://api.github.com/repos/${owner}/${repo}`;
        console.log(`Checking ${url}...`);
        const res = await axios.get(url, {
            headers: { 'User-Agent': 'Verity-Check' }
        });
        console.log(`Result: ${res.status} OK`);
    } catch (e) {
        console.log(`Result: ${e.response?.status} ${e.message}`);
    }
}

async function main() {
    await check('kavi419', 'Verity-Project');
    await check('SSMShehan', 'Verity-Project');
}

main();
