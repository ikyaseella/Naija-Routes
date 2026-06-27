# 🛠️ 00 — Project Setup Guide

Welcome to Naija Routes! If you're a learner setting up this project for the first time, this guide will walk you through everything you need to get the applications running locally on your computer.

---

## Prerequisites (What you need installed)

Before you begin, ensure you have the following installed on your machine:
1. **Node.js**: The Javascript runtime required to run our dev server and tools. (Download the LTS version from nodejs.org)
2. **VS Code (or any IDE)**: The recommended code editor for this project.
3. **Git**: To version control and pull the latest code.

---

## Step 1: Open the Project in your IDE

1. Open **VS Code** (or your preferred IDE).
2. Go to `File > Open Folder...` and select the `naija-routes` folder (which contains the `package.json`, `pnpm-workspace.yaml`, and `apps/` folders).
3. Open a new Terminal inside VS Code (Usually `Terminal > New Terminal` or `Ctrl + ~`).

---

## Step 2: Install pnpm

We use **pnpm** instead of standard `npm` to manage our monorepo because it's much faster and saves disk space. 

Run this command in your terminal to install pnpm globally:
```powershell
npm install -g pnpm
```

*To verify it installed correctly, run `pnpm --version`. You should see a version number printed out.*

---

## Step 3: Install Project Dependencies

Because we are using a **monorepo**, you don't need to install dependencies in every individual folder. You just run one command at the root of the project to install everything for the Web App, Agent App, Operator Portal, and Backend API simultaneously!

In your terminal (make sure you are at the root of `naija-routes`), run:
```powershell
pnpm install
```

This will automatically download and link all dependencies (including Vite, Turborepo, and our frontend tools) across the entire workspace.

---

## Step 4: Start the Development Servers

We use **Turborepo** to orchestrate our apps. With one single command, you can start the Vite development servers for all three frontend portals at the same time.

In your terminal, run:
```powershell
pnpm run dev
```

### What happens next?
Turborepo will spin up the Vite servers for each app on different local ports. Your terminal will show you the exact URLs, but they typically look like this:
* **Web App (Traveller Portal)**: `http://localhost:5173`
* **Admin Dashboard**: `http://localhost:5174`
* **Operator Portal**: `http://localhost:5175`
* **Agent App**: `http://localhost:5176`

*Note: You can `Ctrl + Click` the links in your VS Code terminal to open them directly in your browser.*

---

## Troubleshooting

- **Command not found (pnpm or vite)**: Make sure you ran `npm install -g pnpm` and restarted your VS Code terminal if the path wasn't updated.
- **Port already in use**: If Vite says port 5173 is in use, it will automatically try the next one (5174). Just check your terminal output for the correct URL!
- **CSS not loading**: The apps rely on the `/shared/css/` directory. Ensure you haven't moved or deleted the `packages/shared/web/css` folder, as Vite's configuration serves CSS directly from there.

🎉 **You're all set!** You can now move on to `01_Concepts.md` to understand how the architecture you just started actually works under the hood.
