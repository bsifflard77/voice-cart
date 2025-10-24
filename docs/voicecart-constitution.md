# VoiceCart Project Constitution

## Core Principles

### 1. User Experience First
- Voice input must be frictionless (< 2 seconds)
- Results must be accurate and useful
- Accessibility is non-negotiable

### 2. Code Quality
- All new code includes unit tests (TDD)
- Error handling is comprehensive
- Code is readable and maintainable

### 3. Cost Efficiency
- Minimize API calls (Whisper, Claude)
- Cache results when possible
- Monitor and optimize costs

### 4. Security & Privacy
- User data is encrypted
- No tracking without consent
- GDPR/CCPA compliant

## Success Metrics

| Metric | Target |
|--------|--------|
| Voice-to-list conversion time | < 2 seconds |
| Categorization accuracy | > 95% |
| App uptime | > 99.5% |
| User retention (Day 30) | > 40% |

## Decision Framework

- **Frontend changes:** Focus on speed & UX
- **Backend changes:** Focus on reliability & cost
- **New features:** Must align with core principles

## Team Roles

- **Product Owner:** Decides priority
- **Frontend Dev:** Implements UI/UX
- **Backend Dev:** Implements APIs
- **QA:** Validates against constitution
```

6. Save it: **Ctrl + S**

---

### **Step 4: Initialize Git (Version Control)**

This keeps track of all your code changes.

1. **Open Command Prompt**
   - Press `Win + R`
   - Type `cmd`
   - Press Enter

2. **Navigate to your voicecart folder:**
```
   cd D:\Monomoy Strategies\Projects\voicecart
```

3. **Initialize Git:**
```
   git init
```

4. **Add all your files:**
```
   git add .
```

5. **Create your first commit:**
```
   git commit -m "Initial project setup for VoiceCart"
```

You should see messages like "3 files changed, 100 insertions..."

---

## **PHASE 2: INSTALL CLAUDE DESKTOP & CLAUDE CODE**

### **Step 5: Download Claude Desktop**

1. **Open your web browser** (Chrome, Edge, Firefox, etc.)

2. **Go to:** https://claude.ai/download

3. **Click "Download for Windows"**

4. Once downloaded, **double-click the installer file** (`Claude-Setup.exe` or similar)

5. **Click "Install"** and wait for it to finish

6. **Claude Desktop will open automatically** when done

---

### **Step 6: Install Claude Code (CLI Tool)**

Claude Code runs from your terminal. Let's set it up.

1. **Open Command Prompt** again (Win + R → type `cmd`)

2. **Install Claude Code via pip:**
```
   pip install claude-code
```

   Wait for it to finish installing.

3. **Verify it installed:**
```
   claude --version
```

   You should see a version number like `claude-code 1.x.x`

---

### **Step 7: Activate your Claude Code session**

This connects Claude Code to your Claude account.

1. **In Command Prompt, type:**
```
   claude auth login
```

2. **Your browser will open** asking you to sign in to Claude

3. **Sign in with your Claude account** (or create one at claude.ai)

4. **A code will appear** — copy it

5. **Go back to Command Prompt** and paste the code, then press Enter

You should see: "✓ Authentication successful!"

---

## **PHASE 3: CREATE YOUR GITHUB REPOSITORY**

### **Step 8: Create a GitHub account (if you don't have one)**

1. Go to https://github.com
2. Click "Sign up"
3. Follow the steps to create your account
4. **Verify your email**

---

### **Step 9: Create your VoiceCart repository on GitHub**

1. **On GitHub, click the "+" icon** in the top right corner

2. **Select "New repository"**

3. **Fill in:**
   - **Repository name:** `voicecart`
   - **Description:** "A voice-first shopping list app"
   - **Select:** "Public" (so I can help debug)
   - **Check:** "Add a README file" (uncheck, we already have one)
   - **Check:** "Add .gitignore" (uncheck, we already have one)

4. **Click "Create repository"**

---

### **Step 10: Connect your local folder to GitHub**

Now we link your computer's `voicecart` folder to GitHub.

1. **On GitHub, click the green "Code" button**

2. **Copy the HTTPS URL** (looks like `https://github.com/yourname/voicecart.git`)

3. **Go back to Command Prompt** (in your voicecart folder)

4. **Add GitHub as your remote:**
```
   git remote add origin https://github.com/YOURNAME/voicecart.git
```
   (Replace `YOURNAME` with your GitHub username)

5. **Rename your main branch:**
```
   git branch -M main
```

6. **Push your code to GitHub:**
```
   git push -u origin main
```

   This uploads your project files to GitHub!

---

## **PHASE 4: START CLAUDE CODE**

### **Step 11: Open Claude Code for your project**

1. **Open Command Prompt**

2. **Navigate to your voicecart folder:**
```
   cd D:\Monomoy Strategies\Projects\voicecart
```

3. **Start Claude Code:**
```
   claude code
```

   Your browser will open with a Claude Code interface connected to your project!

---

### **Step 12: Your first Claude Code task**

You should see a Claude Code window. Now we'll ask Claude to scaffold the frontend!

1. **In the chat box at the bottom, type:**
```
I want to build a voice-first shopping list app. 

Let's start with the frontend.

Create:
1. A React + TypeScript + Vite project in the frontend/ folder
2. A simple home page with a voice recording button
3. Basic styling with Tailwind CSS
4. A shopping list component that displays items

Make it clean, modern, and mobile-responsive. No authentication yet.

Start with the package.json and basic project structure.