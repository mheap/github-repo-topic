# github-repo-topic

Add or remove a topic to every repository in an organisation. Originally build to add the `hacktoberfest` topic to multiple repositories

## Usage

You'll need to create a [GitHub Token](https://github.com/settings/tokens/new) and make it available as `GITHUB_TOKEN` in your environment

```
export GITHUB_TOKEN=xxxxxxxxxxx
npx github-repo-topic add hacktoberfest --org my-org-name
npx github-repo-topic remove other-topic --org my-org-name
```

## Possible improvements

- Skip private repos
- Skip archived repos
- Support non-org accounts
