# CareerPilot AI: Architecture & Build Plan

This document outlines the architecture, database schema, security rules, and implementation plan for the CareerPilot AI application, designed for a solo founder leveraging Next.js and Firebase.

## 1. Final Architecture Decisions

-   **Frontend Stack**: **Next.js with App Router & React Server Components**.
    -   *Why*: Excellent performance (SSR/RSC), strong ecosystem, integrated routing, and easy deployment on Firebase App Hosting. It's a productive choice for a solo developer.
-   **Styling**: **Tailwind CSS with ShadCN UI components**.
    -   *Why*: Rapid, consistent UI development with pre-built, accessible components. Low maintenance and highly customizable.
-   **Mobile Stack**: **Progressive Web App (PWA) initially**. A dedicated mobile app is deferred post-MVP.
    -   *Why*: A responsive web app serves most mobile needs initially, avoiding the overhead of separate native app development (Swift/Kotlin). This is cost-effective and faster to market.
-   **Extension Stack**: **Standard Web Extension APIs (Manifest V3)** with Preact/TS.
    -   *Why*: Preact is a lightweight React alternative, perfect for a performant extension. TypeScript ensures type safety. Using standard APIs ensures cross-browser compatibility (Chrome, Firefox).
-   **Firebase Services**:
    -   **Firebase Authentication**: For user sign-up/sign-in (Google & Email/Password).
    -   **Firestore**: NoSQL database for all application data.
    -   **Firebase App Hosting**: To host the Next.js web app.
    -   **Cloud Functions for Firebase**: For background tasks or future webhook integrations (post-MVP).
    -   **Cloud Storage for Firebase**: To store user-uploaded PDF/DOCX resumes.
    -   *Why*: A fully-managed, serverless backend that scales automatically. The generous free tier is ideal for a solo founder, minimizing initial costs and operational overhead.
-   **AI Stack**: **Genkit with Firebase AI Logic**. The `google-genai` plugin for Gemini models will be used.
    -   *Why*: Genkit provides a structured, TypeScript-native way to define and manage AI flows. It simplifies calling LLMs, handling inputs/outputs with Zod schemas, and managing prompts. It integrates seamlessly into the Next.js server environment (`'use server'`).

## 2. Complete Folder Structure

```
/careerpilot-ai
├── /app-extension            # Browser Extension
│   ├── /src
│   │   ├── content.ts        # Content script to inject into pages
│   │   ├── background.ts     # Service worker
│   │   └── popup/            # Popup UI (Preact/TS)
│   └── manifest.json
├── /web-app                  # Next.js Application (Main project root)
│   ├── /src
│   │   ├── /app              # Next.js App Router
│   │   │   ├── /(app)        # Authenticated routes
│   │   │   │   ├── /dashboard
│   │   │   │   ├── /jobs
│   │   │   │   └── ... (layout.tsx, page.tsx)
│   │   │   ├── /(marketing)  # Public routes
│   │   │   │   └── ... (layout.tsx, page.tsx)
│   │   │   ├── /api          # API routes (if needed beyond Server Actions)
│   │   │   ├── /login
│   │   │   └── /signup
│   │   ├── /ai               # Genkit flows and AI logic
│   │   │   └── /flows
│   │   ├── /components       # React components (ShadCN UI)
│   │   ├── /firebase         # Firebase config and hooks
│   │   ├── /lib              # Utility functions
│   │   └── /hooks            # Custom React hooks
│   ├── /docs
│   │   └── backend.json      # Data structure definition for Firebase
│   ├── firestore.rules       # Firestore security rules
│   └── package.json
└── README.md
```
*(Note: The main project root `src` directory acts as the `/web-app` directory in this structure)*

## 3. Firestore Database Schema

-   **Primary Rule**: Data is user-centric. All top-level collections containing user data will use `userId` as the document ID where appropriate, or documents will contain a `userId` field.
-   **Collections**:
    -   `/users/{userId}`
        -   **Description**: Stores private user authentication info. Created by Firebase Auth.
        -   **Fields**: `email`, `createdAt`.
    -   `/profiles/{userId}`
        -   **Description**: Public-facing profile information for a user.
        -   **Fields**: `fullName`, `headline`, `keySkills: array`, `yearsOfExperience: number`.
    -   `/resumes/{resumeId}`
        -   **Description**: Metadata for uploaded resumes. The actual file is in Cloud Storage.
        -   **Fields**: `userId`, `fileName`, `storagePath`, `isPrimary: boolean`, `uploadedAt: timestamp`.
        -   **Subcollections**:
            -   `/resumes/{resumeId}/parsedData/{parseId}`
                -   **Description**: Structured data extracted from the resume by the AI.
                -   **Fields**: `name`, `summary`, `skills: array`, `experience: array`, `education: array`, `extractedAt: timestamp`.
    -   `/jobs/{jobId}`
        -   **Description**: A central collection of all unique jobs saved by any user. This de-duplicates job data.
        -   **Fields**: `jobUrl` (unique key), `title`, `company`, `location`, `description`, `firstSavedBy`, `createdAt`.
    -   `/userSavedJobs/{userJobId}`
        -   **Description**: A user's personal tracking record for a job. This links a user to a job in the `/jobs` collection.
        -   **Fields**: `userId`, `jobId` (maps to `/jobs/{jobId}`), `status: string` (e.g., 'Saved', 'Applied'), `notes: string`, `reminderDate: timestamp`, `createdAt: timestamp`.
    -   `/jobAnalyses/{analysisId}`
        -   **Description**: Stores the AI-generated analysis of a job against a user's profile.
        -   **Fields**: `userId`, `jobId`, `resumeId`, `matchScore: number`, `strengths: array`, `gaps: array`, `recommendationSummary: string`, `createdAt: timestamp`.
    -   `/coverLetters/{letterId}`
        -   **Description**: Stores AI-generated cover letters.
        -   **Fields**: `userId`, `jobId`, `coverLetterText: string`, `tone: string`, `createdAt: timestamp`.
    -   `/interviewPreps/{prepId}`
        -   **Description**: Stores AI-generated interview preparation materials.
        -   **Fields**: `userId`, `jobId`, `behavioralQuestions: array`, `technicalQuestions: array`, `answerGuidance: array`, `createdAt: timestamp`.
    -   `/chatSessions/{sessionId}`
        -   **Description**: Stores the history of a chat with the AI Career Assistant.
        -   **Fields**: `userId`, `createdAt: timestamp`, `lastMessage: string`.
        -   **Subcollections**:
            -   `/chatSessions/{sessionId}/messages/{messageId}`: `role: string` ('user' or 'model'), `content: string`, `timestamp`.

*(Note: `resumeOptimizations`, `reminders`, `learningRecommendations`, `notifications`, `featureFlags`, `auditLogs` are deferred for post-MVP simplicity or are integrated into other documents, e.g., `reminderDate` in `userSavedJobs`)*

## 4. Firestore Security Rules Plan

-   **Default**: Deny all reads/writes.
-   **User-Owned Data**:
    -   `match /profiles/{userId}`, `match /resumes/{resumeId}`, `match /userSavedJobs/{userJobId}`, etc.
    -   **Rule**: `allow read, write: if request.auth.uid == userId;` (for documents with `userId` in the path) or `allow read, write: if request.auth.uid == resource.data.userId;` (for documents with a `userId` field).
-   **Extension-Triggered Writes**:
    -   **Strategy**: Writes from the extension will happen via the authenticated user session in the main web app. The extension will open a tab in the web app to perform the action. This ensures all writes are still subject to user-owned data rules. No special rules needed.
-   **Admin-Only Access**:
    -   **Strategy**: Post-MVP. Would involve a custom claim on the user's Auth token (e.g., `request.auth.token.isAdmin == true`). This can be used to protect collections like `featureFlags` or `auditLogs`. Not needed for MVP.
-   **Uploaded Resumes (Cloud Storage)**:
    -   **Rule**: `allow read, write: if request.auth.uid == resource.metadata.userId;`
    -   A `userId` will be added to the storage object's metadata upon upload.
-   **AI-Generated Records**:
    -   **Rule**: Same as user-owned data. `jobAnalyses`, `coverLetters`, etc., are created on behalf of the user and should only be accessible by them. The `userId` field will be used for enforcement.

## 5. API / Backend Function Plan

All functions will be implemented as **Next.js Server Actions** via **Genkit flows** in `/src/ai/flows`. This eliminates the need for separate API routes. All are `async`.

| Function Name (Genkit Flow) | Purpose                                                | Input                   | Output                  | Auth Required |
| --------------------------- | ------------------------------------------------------ | ----------------------- | ----------------------- | ------------- |
| `parseResume`               | Extracts structured data from a resume file.           | `{ resumeDataUri }`     | `{ StructuredResume }`  | Yes           |
| `analyzeJob`                | Scores a job against a user's profile/resume.          | `{ UserProfile, ... }`  | `{ JobAnalysis }`       | Yes           |
| `generateCoverLetter`       | Creates a personalized cover letter.                   | `{ UserProfile, ... }`  | `{ CoverLetter }`       | Yes           |
| `prepareForInterview`       | Generates interview questions and guidance.            | `{ Job, UserProfile }`  | `{ InterviewPrep }`     | Yes           |
| `chatCareerAssistant`       | Responds to a user query in the chat interface.        | `{ userQuestion, ... }` | `{ AIMessage }`         | Yes           |

## 6. AI Flow Design

All flows are defined using **Genkit** and **Zod** for schema validation.

-   **General Strategy**:
    -   **Caching**: Not implemented for MVP to reduce complexity. Can be added later using Firestore to store flow outputs.
    -   **Failure Handling**: All flow calls in the UI will be wrapped in `try/catch` blocks. Errors will be shown to the user via a Toast component.
    -   **Prompt Strategy**: System prompts will be detailed, instructing the model to act as an expert (e.g., "You are an expert resume parser"). User data will be injected into the prompt using JSON stringification to provide context. Output schemas will be provided to the model for structured JSON output.

-   **Workflows**:
    -   **`parseResume`**:
        -   **Input**: `{ resumeDataUri: string }`
        -   **Output**: `ParseResumeOutputSchema`
        -   **Called**: When a user uploads a new resume.
    -   **`analyzeJob` (was `match score`)**:
        -   **Input**: `{ userProfile, structuredResume, structuredJob }`
        -   **Output**: `AnalyzeJobOutputSchema` (includes score, gaps, etc.)
        -   **Called**: When a user clicks "Analyze Job" for a saved job.
    -   **`optimizeResumeForJob`**:
        -   **Input**: `{ structuredResume, structuredJob }`
        -   **Output**: `OptimizeResumeForJobOutputSchema`
        -   **Called**: From the Job Analysis page.
    -   **`generateCoverLetter`**:
        -   **Input**: `{ userProfile, resumeSummary, jobJSON, tone }`
        -   **Output**: `GenerateCoverLetterOutputSchema`
        -   **Called**: From the Cover Letter generator page.
    -   **`prepareForInterview`**:
        -   **Input**: `{ jobJson, userProfile }`
        -   **Output**: `InterviewPrepOutputSchema`
        -   **Called**: From the Interview Prep page for a specific job.
    -   **`chatCareerAssistant`**:
        -   **Input**: `{ userQuestion, userProfile, userResume, savedJobsContext }`
        -   **Output**: `string` (the AI's text response)
        -   **Called**: On every message sent in the AI assistant chat.

## 7. Extension Architecture

-   **Content Script (`content.ts`)**: Injected into job board pages (e.g., LinkedIn, Indeed). Responsible for detecting if the page is a job listing and extracting the job description content from the DOM.
-   **Background/Service Worker (`background.ts`)**: Listens for messages from the content script. When it receives job content, it opens a new tab in the main web app, passing the extracted content via URL parameters.
-   **Popup UI (`popup/`)**: Minimalist UI. Shows the extension status (e.g., "On a job page" vs. "Not a job page"). Has a button to manually trigger extraction or go to the web app dashboard.
-   **Auth/Session Handling**: The extension does **not** handle authentication directly. It relies on the user being logged into the main web app in their browser. All authenticated actions are delegated to the web app.
-   **Extraction Strategy**:
    -   **Generic**: The content script will look for common microdata formats (`JobPosting` schema.org) or DOM structures (elements with `id` or `class` like "description", "job-details").
    -   **Site Adapters**: Post-MVP. If generic extraction is unreliable, specific parsers (e.g., `linkedin-adapter.ts`) can be written for popular sites. A factory in the content script would choose the correct adapter based on `window.location.hostname`.

## 8. Step-by-Step Build Plan

-   **Phase 1: Core Web App & Foundation (MVP)**
    -   Set up Next.js project with Firebase App Hosting.
    -   Implement Firebase Authentication (Email/Google).
    -   Build the main app shell (sidebar, header) and auth pages (`/login`, `/signup`).
    -   Create the core feature pages (UI only, no data): Dashboard, Job Tracker, Resume Management.
    -   Set up Firestore and basic security rules for user-owned data.
    -   Implement basic CRUD for `userSavedJobs`.

-   **Phase 2: Backend and AI Flows (MVP)**
    -   Integrate Genkit into the Next.js app.
    -   Implement the `parseResume` flow and connect it to the resume upload UI.
    -   Implement `analyzeJob` flow and display results.
    -   Implement `generateCoverLetter` and `prepareForInterview` flows.
    -   Build the AI Career Assistant chat interface and implement the `chatCareerAssistant` flow.

-   **Phase 3: Browser Extension (MVP)**
    -   Develop the content script for generic job data extraction.
    -   Build the background script to communicate with the web app.
    -   Create the simple popup UI.
    -   Test on 2-3 major job boards.

-   **Phase 4: Polish & Launch**
    -   Refine UI/UX based on self-testing.
    -   Ensure responsiveness and PWA compatibility.
    -   Deploy and prepare for launch.

-   **Phase 5: Post-MVP Enhancements**
    -   Build a dedicated mobile companion app (if user feedback demands it).
    -   Implement notifications and reminders.
    -   Add site-specific adapters to the browser extension for better reliability.
    -   Expand AI features (e.g., skill recommendations).
