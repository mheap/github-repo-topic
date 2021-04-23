#!/usr/bin/env node
const { Octokit } = require("@octokit/rest");

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { argv } = require("yargs");

yargs(hideBin(process.argv))
  .command(
    "add <topic>",
    "Add a topic to all repos",
    (yargs) => {
      yargs.positional("topic", {
        describe: "The topic to add",
      });

      yargs.option("org", {
        describe: "The org to operate on",
      });
    },
    async (argv) => {
      return run(argv);
    }
  )
  .command(
    "remove <topic>",
    "Remove a topic from all repos",
    (yargs) => {
      yargs.positional("topic", {
        describe: "The topic to remove",
      });

      yargs.option("org", {
        describe: "The org to operate on",
      });
    },
    async (argv) => {
      return run(argv);
    }
  )
  .strictCommands()
  .demandCommand(1)
  .demandOption("org").argv;

async function run(argv) {
  const org = argv.org;
  const topic = argv.topic;

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

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
      new Promise(async (resolve) => {
        const owner = r.owner.login;
        const repo = r.name;

        let {
          data: { names: names },
        } = await octokit.repos.getAllTopics({
          owner,
          repo,
        });

        if (argv._[0] === "add") {
          if (names.includes(topic)) {
            return resolve();
          }

          names.push(topic);
        } else if (argv._[0] === "remove") {
          if (!names.includes(topic)) {
            return resolve();
          }
          names = names.filter(function (name) {
            return name !== topic;
          });
        } else {
          console.log(`Unknown command: ${argv._[0]}`);
        }

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
}
