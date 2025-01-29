# Contributing

> ⚠ The default branch is `main`.

When it comes to open source, there are different ways you can contribute, all
of which are valuable. Here's few guidelines that should help you as you prepare
your contribution.

## Initial steps

Before you start working on a contribution, create an issue describing what you want to build. It's possible someone else is already working on something similar, or perhaps there is a reason that feature isn't implemented. The maintainers will point you in the right direction.

## Development

The following steps will get you setup to contribute changes to this repo:

1. Fork this repo.

2. Clone your forked repo: `git clone git@github.com:{your_username}/cretex.git`

3. Run `yarn` to install dependencies.

4. Start playing with the code! You can do some simple experimentation in [`playground.ts`](playground.ts) (see `yarn play` below) or start implementing a feature right away.

## Alternative: VSCode Dev Container setup

For an officially supported isolated dev environment that automatically installs dependencies for you:

1. `F1` in VSCode and start typing `Dev Containers: Clone Repository in Named Container Volume` to run the command.
2. For the repo, paste `git@github.com:{your_username}/cretex.git` if you're using ssh.
3. Click `Create a new volume...` and name it `cretex` and the folder name as `cretex`.

Note: if you can't see `Dev Containers` in the `F1` menu, follow [this guide](https://code.visualstudio.com/docs/devcontainers/tutorial) to install the needed extension.
In the OSS version of VSCode the extension may be not available.

### Commands

**`yarn build`**

- deletes `lib` and re-compiles `src` to `lib`

**`yarn test`**

- runs all Jest tests and generates coverage badge

**`yarn play`**

- executes [`playground.ts`](playground.ts), watches for changes. useful for experimentation

### Tests

cretex uses Jest for testing. After implementing your contribution, write tests for it. Just create a new file under `__tests__` or add additional tests to the appropriate existing file.

Before submitting your PR, run `yarn test` to make sure there are no (unintended) breaking changes.

### Documentation

The cretex documentation lives in the README.md. Be sure to document any API changes you implement.

## License

By contributing your code to the cretex GitHub repository, you agree to
license your contribution under the MIT license.
