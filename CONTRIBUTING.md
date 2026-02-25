# Contributing to Jairus Car Shop

This is your project. You can push directly to your GitHub repo (no fork needed).

## Workflow

1. **Clone your repo** (if on another machine):
   ```bash
   git clone https://github.com/owenlim225/JairusCarShop.git
   cd JairusCarShop
   ```

2. **Create a branch and work**:
   ```bash
   git checkout -b feature/your-feature
   cd starter-pack
   npm install
   npm run dev
   ```

3. **Commit and push to your repo**:
   ```bash
   git add .
   git commit -m "feat: your change"
   git push -u origin feature/your-feature
   ```

4. **Open a Pull Request** on your own GitHub repo (e.g. `owenlim225/JairusCarShop`) from your branch to `master` (or `main`) if you use branches for review.

If you’re the only contributor, you can also push straight to `master`:

```bash
git checkout master
git add .
git commit -m "feat: your change"
git push origin master
```

## Standards

- Run from `StarterPack/starter-pack`: `npm run lint`, `npm run type-check`, `npm run build`
- Use clear commit messages (e.g. `feat:`, `fix:`, `docs:`)

## Using a different GitHub username

If your GitHub username is not `owenlim225`, set the remote once:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/JairusCarShop.git
```

Then push as above.
