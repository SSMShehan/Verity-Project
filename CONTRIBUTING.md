# Contributing to VERITY

Thank you for your interest in contributing to the VERITY Smart Campus Management System!

## 📋 Branching Strategy

We follow a feature-branch workflow:

| Branch | Purpose |
|---|---|
| `main` | Production-ready code |
| `feature/<name>` | New features |
| `fix/<name>` | Bug fixes |
| `docs/<name>` | Documentation updates |

## 🔄 How to Contribute

1. **Fork** the repository or **create a branch** from `main`
2. Make your changes in the branch
3. Write clear, descriptive commit messages (see below)
4. Open a **Pull Request** into `main`
5. Wait for review and approval from the team lead

## ✍️ Commit Message Format

We use the [Conventional Commits](https://www.conventionalcommits.org/) standard:

```
<type>: <short description>

Types:
  feat     - New feature
  fix      - Bug fix
  docs     - Documentation changes
  chore    - Build/config/tooling changes
  refactor - Code refactoring
  style    - Formatting, missing semicolons, etc.
  test     - Adding or updating tests
```

**Examples:**
```
feat: add student calendar view
fix: resolve JWT token expiry issue
docs: update README setup instructions
chore: add .env.example for backend
```

## 🚫 Rules

- Do NOT commit directly to `main`
- Do NOT commit sensitive data (API keys, passwords, `.env` files)
- Always test your changes locally before pushing
- Keep PRs small and focused

## 📦 Setting Up Locally

See the [README.md](./README.md) for full setup instructions.
