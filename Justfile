# Build the site
build:
    hugo --minify

# Publish static output to the gh-pages branch
publish: build
    #!/usr/bin/env bash
    set -euo pipefail

    SITE_DIR="$(pwd)/public"
    WORKTREE_DIR="$(pwd)/.gh-pages-worktree"
    BRANCH="gh-pages"

    # Ensure the worktree directory is clean
    rm -rf "$WORKTREE_DIR"

    # Create or fetch the gh-pages branch
    if git ls-remote --exit-code --heads origin "$BRANCH" > /dev/null 2>&1; then
        git fetch origin "$BRANCH"
        git worktree add "$WORKTREE_DIR" "$BRANCH"
    else
        # Branch does not exist yet – create an orphan branch
        git worktree add --orphan -B "$BRANCH" "$WORKTREE_DIR"
    fi

    cd "$WORKTREE_DIR"

    # Remove everything except controlling files
    find . -mindepth 1 -maxdepth 1 \
        ! -name '.git' \
        ! -name 'CNAME' \
        ! -name '.nojekyll' \
        -exec rm -rf {} +

    # Copy freshly built site
    cp -r "$SITE_DIR"/. .

    # Ensure .nojekyll exists so GitHub doesn't run Jekyll
    touch .nojekyll

    # Commit and push
    git add --all
    if git diff --cached --quiet; then
        echo "Nothing to publish – working tree is clean."
    else
        git commit -m "Publish $(date -u '+%Y-%m-%d %H:%M UTC')"
        git push origin "$BRANCH"
        echo "Published to $BRANCH."
    fi

    # Clean up worktree
    cd - > /dev/null
    git worktree remove "$WORKTREE_DIR" --force
