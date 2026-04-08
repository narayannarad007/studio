---
description: Step-by-step workflow to install dependencies and build the Career Pilot AI Project.
---

# Build Project

Follow these steps to prepare the project for production.

1. **Verify Environment**
   Ensure Node.js (>= 20) and Git are installed and available in your PATH.

2. **Install Dependencies**
   Run the following command to install all required npm packages.
   ```bash
   npm install
   ```

3. **Install Build Utilities (Windows Only)**
   If you are on Windows, ensure `cross-env` is installed to support the build scripts.
   ```bash
   npm install -D cross-env
   ```

4. **Typecheck Code**
   Verify TypeScript integrity.
   ```bash
   npm run typecheck
   ```

5. **Build Application**
   Compile the Next.js application for production.
   ```bash
   npm run build
   ```
