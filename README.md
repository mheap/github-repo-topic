# github-add-repo-topic

Add a topic to every repository in an organisation. Originally build to add the `hacktoberfest` topic to multiple repositories

## Usage

You'll need to create a [GitHub Token](https://github.com/settings/tokens/new) and make it available as `GITHUB_TOKEN` in your environment

```
git clone https://github.com/mheap/github-add-repo-topic.git
cd github-add-repo-topic
npm install
export GITHUB_TOKEN=xxxxxxxxxxx
node index.js YOUR_ORG_NAME TOPIC
```

e.g. `node index.js vonage hacktoberfest`

## Possible improvements

- Skip private repos
- Skip archived repos
- Support non-org accounts
