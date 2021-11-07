# Contributing to 모아영

✨ 모아영에 기여하는 데 시간을 투자해 주셔서 감사합니다! 귀하의 모든 기여는 [moayoung-call.web.app](https://moayoung-call.web.app/)에 반영됩니다. ✨

모든 기여자는 [행동 강령](CODE_OF_CONDUCT.md)의 적용을 받습니다. 위반 사항 발견 즉시 [508yeah@gmail.com](mailto:508yeah@gmail.com)으로 고발 부탁드립니다.

본 문서의 왼쪽 상단 모서리에 있는 목차 아이콘(![image](https://bit.ly/3bKlwEi))으로 특정 내용에 빠르게 접근하실 수 있습니다.

## New contributor guide

프로젝트의 개요는 [README](README.md)에서 확인하실 수 있습니다. 보다 자세한 사항은 [Wiki](https://github.com/daaaayeah/oss-moayoung/wiki)에서 확인해주십시오.

다음은 오픈 소스 기여를 시작하는 데 도움이 되는 문서입니다:

- [Finding ways to contribute to open source on GitHub](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github)
- [Set up Git](https://docs.github.com/en/get-started/quickstart/set-up-git)
- [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Collaborating with pull requests](https://docs.github.com/en/github/collaborating-with-pull-requests)

## Issues

### Create a new issue

프로젝트에서 issue를 발견하면 이미 열려 있는 issue 인지 확인합니다.

관련 issue가 존재하지 않는 경우, 적절한 [템플릿](https://github.com/daaaayeah/oss-moayoung/issues/new/choose)을 선정하여 새로운 issue를 생성해주십시오.

### Solve an issue

열려 있는 issue 중에서 관심 있는 issue를 찾습니다. `labels`로 검색 범위를 좁힐 수 있습니다.

해결할 issue를 찾고 이를 수정하여 PR을 생성할 수 있습니다.

## Pull Requests

### Prerequisites

- Git
- npm
- yarn
- Node.js
- grunt

### 1. Fork the repository

### 2. Clone the forked repository to your local environment

```
git clone https://github.com/[USERNAME]/[REPOSITORY_NAME].git
cd [REPOSITORY_NAME]
```

```
cd homepage
yarn
```

```
cd ../meeting
npm i
```

### 3. Create a working branch and start with your changes!

#### Create configuration and customize files

Linux
```
cp src/config.tmp.json src/config.json
cp src/assets/sass/_custom.tmp.scss src/assets/sass/_custom.scss
```

Windows
```
copy src\config.tmp.json src\config.json
copy src\assets\sass\_custom.tmp.scss src\assets\sass\_custom.scss
```

#### Coding Convention

Prettier 초기 설정에 따르고, 아래의 항목을 활성화해주십시오.

- Jsx Single Quote
- Single Quote

#### Commit convention

Commit message는 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary)에 따라서 작성해주십시오.

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 4. Pull request

`upstream/main` <= `origin/...`

Pull request template에 따르고, 필요에 따라 내용을 가감해주십시오.

issue를 해결하는 경우 [PR에 issue를 연결](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue)합니다.

PR을 보내시면 모아영 팀이 귀하의 제안을 검토할 것입니다. 질문을 하거나 추가 정보를 요청할 수 있습니다.

### 5. Your PR is merged!

축하드립니다! 🎉 모아영 팀원 모두가 귀하에게 감사의 인사를 드립니다. ✨

귀하의 기여는 [moayoung-call.web.app](https://moayoung-call.web.app/)에서 공개적으로 확인할 수 있습니다.
