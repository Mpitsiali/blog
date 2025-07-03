# Git Workflow Best Practices

A well-organized Git workflow improves collaboration, reduces conflicts, and makes your development process more efficient. Here are proven strategies for better Git management.

## Choosing a Git Workflow

### Git Flow
Best for: Projects with scheduled releases and multiple environments.

**Branches:**
- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Individual features
- `release/*`: Release preparation
- `hotfix/*`: Emergency fixes

### GitHub Flow
Best for: Continuous deployment and smaller teams.

**Branches:**
- `main`: Always deployable
- `feature/*`: Short-lived feature branches

### GitLab Flow
Best for: Projects needing environment-specific branches.

**Branches:**
- `main`: Development
- `staging`: Pre-production testing
- `production`: Live environment

## Branch Naming Conventions

Use clear, descriptive branch names:

\`\`\`bash
# Good examples
feature/user-authentication
feature/shopping-cart
bugfix/login-validation
hotfix/security-patch
docs/api-documentation

# Avoid
fix-stuff
temp
john-branch
\`\`\`

## Commit Message Best Practices

### Format Structure
\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

### Commit Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples
\`\`\`bash
feat(auth): add user registration endpoint

Add POST /api/register endpoint with email validation
and password hashing using bcrypt.

Closes #123
\`\`\`

\`\`\`bash
fix(ui): resolve mobile navigation toggle issue

The hamburger menu wasn't closing on mobile devices
after clicking a navigation link.

Fixes #456
\`\`\`

## Essential Git Commands

### Daily Workflow
\`\`\`bash
# Start new feature
git checkout -b feature/new-feature
git push -u origin feature/new-feature

# Regular commits
git add .
git commit -m "feat: add user profile component"
git push

# Update from main
git checkout main
git pull origin main
git checkout feature/new-feature
git rebase main

# Merge feature
git checkout main
git merge feature/new-feature
git push origin main
git branch -d feature/new-feature
\`\`\`

### Useful Commands
\`\`\`bash
# View commit history
git log --oneline --graph --decorate

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Stash changes temporarily
git stash
git stash pop

# Cherry-pick specific commit
git cherry-pick <commit-hash>

# Interactive rebase (clean up commits)
git rebase -i HEAD~3
\`\`\`

## Pull Request Best Practices

### Before Creating a PR
- [ ] Rebase on latest main
- [ ] Run tests locally
- [ ] Update documentation
- [ ] Self-review your changes

### PR Description Template
\`\`\`markdown
## What does this PR do?
Brief description of changes

## How to test
Step-by-step testing instructions

## Screenshots (if applicable)
Before/after images for UI changes

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Follows coding standards
\`\`\`

### Code Review Guidelines

**For Authors:**
- Keep PRs small and focused
- Provide context in descriptions
- Respond to feedback promptly
- Don't take feedback personally

**For Reviewers:**
- Be constructive and specific
- Focus on code, not the person
- Suggest improvements
- Approve when ready

## Handling Merge Conflicts

### Prevention
\`\`\`bash
# Regularly sync with main
git checkout main
git pull origin main
git checkout feature/branch
git rebase main
\`\`\`

### Resolution
\`\`\`bash
# When conflicts occur during rebase
git status  # See conflicted files
# Edit files to resolve conflicts
git add .
git rebase --continue
\`\`\`

## Git Hooks for Quality Control

### Pre-commit Hook Example
\`\`\`bash
#!/bin/sh
# .git/hooks/pre-commit

# Run linter
npm run lint
if [ $? -ne 0 ]; then
  echo "Linting failed. Please fix errors before committing."
  exit 1
fi

# Run tests
npm test
if [ $? -ne 0 ]; then
  echo "Tests failed. Please fix before committing."
  exit 1
fi
\`\`\`

## Repository Organization

### .gitignore Best Practices
\`\`\`gitignore
# Dependencies
node_modules/
vendor/

# Build outputs
dist/
build/
*.min.js
*.min.css

# Environment files
.env
.env.local
.env.production

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
logs/
\`\`\`

### Repository Structure
\`\`\`
project/
├── .github/
│   ├── workflows/          # GitHub Actions
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/                   # Documentation
├── src/                    # Source code
├── tests/                  # Test files
├── .gitignore
├── README.md
└── CONTRIBUTING.md
\`\`\`

## Advanced Git Techniques

### Squashing Commits
\`\`\`bash
# Interactive rebase to squash last 3 commits
git rebase -i HEAD~3

# In the editor, change 'pick' to 'squash' for commits to combine
\`\`\`

### Bisect for Bug Hunting
\`\`\`bash
# Find the commit that introduced a bug
git bisect start
git bisect bad          # Current commit is bad
git bisect good v1.0    # v1.0 was good
# Git will checkout commits for you to test
git bisect good/bad     # Mark each commit
git bisect reset        # When done
\`\`\`

## Team Collaboration Tips

### Communication
- Use descriptive commit messages
- Reference issues in commits
- Keep team informed of major changes
- Document decisions in commit messages

### Code Organization
- One feature per branch
- Regular integration with main
- Clean up merged branches
- Use tags for releases

## Troubleshooting Common Issues

### Accidentally Committed to Wrong Branch
\`\`\`bash
# Move commits to correct branch
git log --oneline  # Note commit hashes
git reset --hard HEAD~2  # Remove last 2 commits
git checkout correct-branch
git cherry-pick <commit-hash>
\`\`\`

### Recover Deleted Branch
\`\`\`bash
# Find the commit hash
git reflog
# Recreate branch
git checkout -b recovered-branch <commit-hash>
\`\`\`

## Conclusion

A good Git workflow:
- **Reduces conflicts** through regular integration
- **Improves code quality** with reviews and hooks
- **Maintains clean history** with meaningful commits
- **Enables collaboration** through clear processes

Choose a workflow that fits your team size and deployment strategy, then stick to it consistently. The key is having everyone follow the same process.

Remember: Git is a tool to help you collaborate and maintain code quality. Don't let complex workflows get in the way of productivity!

