# Contributing to FS-Linker

Thanks for considering a contribution! Bug reports, ideas, documentation improvements, and code contributions are welcome.

## Before you start

- For a substantial feature or breaking change, open an issue first so we can discuss the approach.
- Check existing issues and pull requests before starting work on a bug or feature.
- Keep each pull request focused on one change. Avoid unrelated edits.

## Development setup

FS-Linker requires Node.js 22.18.0 or newer and uses pnpm. From the project directory, install dependencies with:

```bash
pnpm install
```

## Before submitting a pull request

Run the available checks:

```bash
pnpm fmt:check
pnpm lint
pnpm build
```

If your change affects behavior, explain how you verified it. The project does not currently have an automated test script.

Please also:

- Update the documentation when behavior or usage changes.
- Review your diff for mistakes and unrelated changes.
- Do not commit editor-specific files such as `.idea` settings.
- Use a focused branch and a clear pull request title and description.
- Link the related issue in the pull request description when applicable.

Thank you for helping improve FS-Linker!
