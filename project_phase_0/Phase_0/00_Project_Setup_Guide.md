# 🛠️ 00 — Project Setup Guide

Welcome to Naija Routes! If you're a learner setting up this project for the first time, this guide will walk you through everything you need to get the applications running locally on your computer.

---

## Prerequisites (What you need installed)

Before you begin, ensure you have the following installed on your machine:
1. **Node.js** (v16 or higher): The JavaScript runtime required to run our dev server and tools. [Download the LTS version from nodejs.org](https://nodejs.org/)
2. **npm**: Comes automatically with Node.js (used to install pnpm)
3. **VS Code (or any IDE)**: The recommended code editor for this project. [Download from code.visualstudio.com](https://code.visualstudio.com/)
4. **Git**: To version control and pull the latest code. [Download from git-scm.com](https://git-scm.com/)

---

## Step 0: Verify Your System Setup

Before proceeding, verify that Node.js and npm are correctly installed on your system.

### For Windows (PowerShell or Command Prompt):
```powershell
node --version
npm --version
```

### For macOS/Linux (Terminal):
```bash
node --version
npm --version
```

You should see version numbers printed out (e.g., `v18.17.0` for Node.js and `9.8.1` for npm). If you see "command not found", reinstall Node.js from [nodejs.org](https://nodejs.org/).

---

## Step 1: Clone or Open the Project Repository

If you haven't already cloned the repository, do so now:

### For Windows (PowerShell):
```powershell
git clone https://github.com/ikyaseella/Naija-Routes.git
cd Naija-Routes
```

### For macOS/Linux (Terminal):
```bash
git clone https://github.com/ikyaseella/Naija-Routes.git
cd Naija-Routes
```

If you already have the project cloned, simply navigate to the project directory:

### For Windows (PowerShell):
```powershell
cd path/to/Naija-Routes
```

### For macOS/Linux (Terminal):
```bash
cd path/to/Naija-Routes
```

---

## Step 2: Open the Project in Your IDE

1. Open **VS Code** (or your preferred IDE).
2. Go to `File > Open Folder...` and select the `Naija-Routes` folder (which contains the `package.json`, `pnpm-workspace.yaml`, and `apps/` folders).
3. Open a new Terminal inside VS Code:
   - **Windows**: `Terminal > New Terminal` or press `Ctrl + ~`
   - **macOS/Linux**: `Terminal > New Terminal` or press `Ctrl + ~`

Your terminal should now be open at the root of the project directory.

---

## Step 3: Install pnpm (Package Manager)

We use **pnpm** instead of standard `npm` to manage our monorepo because it's much faster and saves disk space.

Run this command in your IDE terminal to install pnpm globally:

### For Windows (PowerShell):
```powershell
npm install -g pnpm
```

### For macOS/Linux (Terminal):
```bash
npm install -g pnpm
```

**Verify the installation:**

### For Windows (PowerShell):
```powershell
pnpm --version
```

### For macOS/Linux (Terminal):
```bash
pnpm --version
```

You should see a version number printed out (e.g., `8.6.0`). If you see "command not found", try restarting your IDE terminal or adding pnpm to your system PATH.

---

## Step 4: Install Project Dependencies

Because we are using a **monorepo**, you don't need to install dependencies in every individual folder. You just run one command at the root of the project to install everything for the Web App, Admin Dashboard, Operator Portal, and Agent App.

**Make sure you are at the root of the `Naija-Routes` directory**, then run:

### For Windows (PowerShell):
```powershell
pnpm install
```

### For macOS/Linux (Terminal):
```bash
pnpm install
```

This command will:
- Download all required dependencies (React, Vite, Turborepo, etc.)
- Link dependencies across all packages in the monorepo
- Create a `node_modules` folder with all necessary packages
- Set up the workspace for development

**This may take 2-5 minutes depending on your internet speed.** Wait for it to complete.

---

## Step 5: Verify Vite Installation

Vite should have been installed as part of Step 4. Verify it's available:

### For Windows (PowerShell):
```powershell
pnpm exec vite --version
```

### For macOS/Linux (Terminal):
```bash
pnpm exec vite --version
```

You should see a version number printed out (e.g., `4.3.9`).

---

## Step 6: Start the Development Servers

We use **Turborepo** to orchestrate our apps. With one single command, you can start the Vite development servers for all frontend portals at the same time.

**Make sure you are at the root of the `Naija-Routes` directory**, then run:

### For Windows (PowerShell):
```powershell
pnpm run dev
```

### For macOS/Linux (Terminal):
```bash
pnpm run dev
```

### What happens next?

Turborepo will spin up the Vite servers for each app on different local ports. Your terminal will show you the exact URLs, but they typically look like this:

* **Web App (Traveller Portal)**: `http://localhost:5173`
* **Admin Dashboard**: `http://localhost:5174`
* **Operator Portal**: `http://localhost:5175`
* **Agent App**: `http://localhost:5176`

**Tip:** You can `Ctrl + Click` (or `Cmd + Click` on macOS) the links in your VS Code terminal to open them directly in your browser.

---

## Complete Command Summary (Quick Reference)

Here's a condensed version of all commands you need to run:

### Windows (PowerShell):
```powershell
# Verify Node.js and npm
node --version
npm --version

# Clone the repository
git clone https://github.com/ikyaseella/Naija-Routes.git
cd Naija-Routes

# Install pnpm globally
npm install -g pnpm

# Verify pnpm installation
pnpm --version

# Install all project dependencies
pnpm install

# Verify Vite installation
pnpm exec vite --version

# Start development servers
pnpm run dev
```

### macOS/Linux (Terminal):
```bash
# Verify Node.js and npm
node --version
npm --version

# Clone the repository
git clone https://github.com/ikyaseella/Naija-Routes.git
cd Naija-Routes

# Install pnpm globally
npm install -g pnpm

# Verify pnpm installation
pnpm --version

# Install all project dependencies
pnpm install

# Verify Vite installation
pnpm exec vite --version

# Start development servers
pnpm run dev
```

---

## Troubleshooting

### "Command not found: Node.js"
- **Solution**: Node.js is not installed or not in your system PATH. Download and install from [nodejs.org](https://nodejs.org/) and restart your terminal.

### "Command not found: pnpm"
- **Solution**: Make sure you ran `npm install -g pnpm` and restarted your VS Code terminal. If still not found, try:
  - **Windows**: Close and reopen PowerShell as Administrator
  - **macOS/Linux**: Try `sudo npm install -g pnpm`

### "Command not found: vite"
- **Solution**: Make sure you ran `pnpm install` successfully and are at the root of the project. Try running `pnpm install` again.

### Port already in use (5173, 5174, etc.)
- **Solution**: If Vite says a port is in use, it will automatically try the next available port. Check your terminal output for the correct URL. Alternatively, stop other applications using those ports or restart your IDE.

### CSS not loading
- **Solution**: The apps rely on the `/shared/css/` directory. Ensure you haven't moved or deleted the `packages/shared/web/css` folder, as Vite's configuration serves CSS directly from there.

### "Permission denied" errors on macOS/Linux
- **Solution**: You may need to use `sudo` for global installations:
  ```bash
  sudo npm install -g pnpm
  ```

### Dependencies not installing / "npm ERR!"
- **Solution**: 
  1. Delete the `node_modules` folder and lock files: `rm -rf node_modules pnpm-lock.yaml`
  2. Clear the npm cache: `npm cache clean --force`
  3. Try installing again: `pnpm install`

### Terminal doesn't recognize commands after installation
- **Solution**: Restart your IDE terminal or restart your computer. This ensures the system PATH is refreshed with new global package locations.

---

## Next Steps

🎉 **You're all set!** Once the development servers are running and you can access the applications at the URLs above, you can:

1. Move on to `01_Concepts.md` to understand how the architecture you just started actually works under the hood.
2. Start exploring the codebase in the `apps/` directory.
3. Begin contributing to the project!

**Need help?** Check the main README or open an issue on the GitHub repository.
