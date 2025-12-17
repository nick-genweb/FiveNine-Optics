---
description: Create git commit with automatic version bumping for asset changes
allowed-tools: Bash(git *), Bash(npm version:*)
argument-hint: (optional message)
---

# Commit with Version Bump

You are helping the user create a git commit for the FiveNine Optics website. This command handles version bumping for asset changes and creates a proper commit.

## Workflow

### 1. Check Git Status
First, check what files have been modified:
```bash
git status --short
git diff --name-only
```

### 2. Detect Asset Changes
Check if CSS or JS files were modified:
- `src/assets/css/styles.css`
- `src/assets/js/main.js`
- Any other files in `src/assets/css/` or `src/assets/js/`

### 3. Version Bump Decision

**If assets (CSS/JS) were modified:**
Ask the user which version type to bump:

"I detected changes to CSS/JS assets. Which version bump?"
- **patch** (1.0.1 → 1.0.2) - Bug fixes, minor changes
- **minor** (1.0.1 → 1.1.0) - New features, significant updates
- **major** (1.0.1 → 2.0.0) - Breaking changes

**If only content/template files changed:**
Skip version bump (not needed for content-only changes).

### 4. Bump Version (if needed)
Run the version bump command:
```bash
npm version [patch|minor|major] --no-git-tag-version
```

This updates `package.json` and `package-lock.json` but doesn't create a git tag.

### 5. Review Changes
Show the user what will be committed:
```bash
git status
git diff --staged
```

### 6. Create Commit
Ask the user for a commit message, or suggest one based on the changes.

**Commit message format:**
```
[Subject line - concise description]

[Optional detailed description]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Examples:**
- "Update navigation dropdown styles and add accessibility fixes"
- "Add skip link for keyboard navigation"
- "Fix accordion functionality on Resources page"

Create the commit:
```bash
git add .
git commit -m "$(cat <<'EOF'
[Commit message here]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### 7. Push (Optional)
Ask the user: "Would you like to push to remote?"

**If yes:**
```bash
git push
```

**If no:**
Inform the user they can push later with `git push`.

## Important Notes

- **Always** check for CSS/JS changes before bumping version
- **Never** bump version for content-only changes (template files, markdown, images)
- **Always** use HEREDOC for commit messages to preserve formatting
- **Always** add the Claude Code footer to commit messages
- **Never** create git tags (use `--no-git-tag-version`)
- **Never** run `git push --force`

## Examples

### Example 1: CSS Change
```
User: /commit
Assistant: I detected changes to:
- src/assets/css/styles.css
- src/_layouts/base.njk

CSS files were modified. Which version bump?
- patch (1.0.1 → 1.0.2)
- minor (1.0.1 → 1.1.0)
- major (1.0.1 → 2.0.0)

User: patch
Assistant: [Runs npm version patch, creates commit, asks about push]
```

### Example 2: Content-Only Change
```
User: /commit
Assistant: I detected changes to:
- src/index.njk
- src/resources.njk

No asset files modified, skipping version bump.

What would you like the commit message to be?

User: Update team member bios
Assistant: [Creates commit without version bump, asks about push]
```

## Edge Cases

- **No changes:** If no files are modified, inform the user there's nothing to commit
- **Untracked files:** Ask user if they want to add untracked files to the commit
- **Merge conflicts:** If conflicts exist, inform user to resolve them first
- **Already committed:** If working directory is clean, inform user

## Success Criteria

✅ Version bumped when CSS/JS changed
✅ Version NOT bumped for content-only changes
✅ Commit message includes Claude Code footer
✅ User is asked before pushing
✅ All changes are reviewed before committing
