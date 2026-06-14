# [nycnerd.com](https://www.nycnerd.com/) hugo photoblog 

### Links
- [github repo](https://github.com/taoofshawn/nycnerd.com)
- [gh actions](https://github.com/taoofshawn/nycnerd.com/actions)
- [gh container registry](https://github.com/taoofshawn/nycnerd.com/pkgs/container/nycnerd.com)
- [nycnerd.com](https://www.nycnerd.com/)

### Notes

- first attempt at vibe coding a full project with a local llm [deepseek-ai/DeepSeek-V4-Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash)
- migrated from squarespace and converted to hugo
- initial prompt and follow up iterative prompt history is included for historical purposes
- agent, skills and prompts
  - [opencode](https://github.com/anomalyco/opencode)
  - [karpathy CLAUDE.md](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md)
  - [superpowers](https://github.com/obra/superpowers.git)

- git actions for building and pushing the container image
    - add the token to repo > settings > actions > new repository secret under `GHCR_TOKEN`
    - setup a [classic personal access token](https://github.com/settings/tokens)
        - give permission `write:packages`
    - add to repository secrets (repo > settings > secrets and variables > actions > new repository secret)
        - named `GHCR_TOKEN` to match the .github/workflows/docker-image.yml in this repository


### Todo

- add/style contact page
- confirm/add responsiveness (for mobile)