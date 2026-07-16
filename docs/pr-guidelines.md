# RankUp Repository Guidelines

Baseline rules to maintain some consistency in this workspace!

## Branches

Branches should be named in the style `<type>/<kebab-description>`

### Description

This should be a concise summary of what this branch aims to do in 2-3 words

### Types

Types include: `feature/`, `bugfix/`, `refactor/`, `infra/`, or `chore/`

#### Feature

A new enhancement that is a wholly new addition

#### Bugfix

A fix for an existing issue

#### Refactor

A rework of code that isn't necessarily broken but needs improvement

#### Infra

Any work relating to the GitHub infrastructureEx: deployment actions or Continuous Integration workflows.

#### Chore

Miscellaneous tasks that are required but not directly relevant to the project. Ex: version or dependency updates

## Pull Requests

### Connected Issue

Each pull request should map to one issue or cluster of closely related issues. Connect these under the development so that they auto-close when the branch is merged.

### Merging

When a PR is ready for review it will undergo a build check to ensure the project still functions after this change.

The PR changes can then be **squash-merged**.
