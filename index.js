const { Octokit } = require("@octokit/rest");

const org = process.argv[2];
const topic = process.argv[3];

if (!org || !topic) {
  console.log("Usage: node index.js YOUR_ORG_NAME TOPIC");
  return;
}

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

(async function () {
  let repos = await octokit.paginate(
    octokit.repos.listForOrg,
    {
      org,
    },
    (response) => response.data
  );

  const reqs = [];

  for (let r of repos) {
    reqs.push(
      new Promise(async (resolve, reject) => {
        const owner = r.owner.login;
        const repo = r.name;

        const {
          data: { names: names },
        } = await octokit.repos.getAllTopics({
          owner,
          repo,
        });

        if (names.includes(topic)) {
          return resolve();
        }

        names.push(topic);

        await octokit.repos.replaceAllTopics({
          owner,
          repo,
          names,
        });

        return resolve();
      })
    );
  }

  await Promise.all(reqs);
})();
