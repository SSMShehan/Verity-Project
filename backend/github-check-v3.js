const axios = require('axios');

async function check(owner, repo) {
    try {
        const url = `https://api.github.com/repos/${owner}/${repo}`;
        const res = await axios.get(url, {
            headers: { 'User-Agent': 'Verity-Check' }
        });
        console.log(`CHECKING_RESULT:${owner}/${repo}:${res.status}:FOUND`);
    } catch (e) {
        console.log(`CHECKING_RESULT:${owner}/${repo}:${e.response?.status || 'ERR'}:NOT_FOUND`);
    }
}

async function main() {
    await check('kavi419', 'Verity-Project');
    await check('SSMShehan', 'Verity-Project');
    await check('kavi419', 'verity-project');
}

main();
