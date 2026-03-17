# Firebase Studio - CareerPilot AI

This is a Next.js starter project for CareerPilot AI, built with Firebase Studio.
 
## Getting Started

To get the application running locally, follow these steps:

1.  **Install Dependencies**:
    If you haven't already, install the project dependencies.
    ```bash
    npm install
    ```

2.  **Set Environment Variables**:
    -   Rename the `.env.example` file to `.env`.
    -   Open the `.env` file and add your Gemini API key. You can get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    ```
    GEMINI_API_KEY="YOUR_API_KEY_HERE"
    ```

3.  **Run the Development Server**:
    This command starts the Next.js frontend application.
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

4.  **Run the Genkit Developer UI (Optional)**:
    To inspect and test your AI flows, you can run the Genkit developer UI in a separate terminal.
    ```bash
    npm run genkit:watch
    ```
    The Genkit UI will be available at `http://localhost:4000`.

## Deployment

This application is configured for deployment on **Firebase App Hosting**.

1.  **Prerequisites**:
    -   Ensure you have the [Firebase CLI](https://firebase.google.com/docs/cli) installed and you are logged in (`firebase login`).
    -   Make sure your `GEMINI_API_KEY` is set as a secret in your Google Cloud project. You can do this by running:
        ```bash
        gcloud secrets create GEMINI_API_KEY
        gcloud secrets versions add GEMINI_API_KEY --data-file=- # Then paste your key and press Ctrl+D
        ```
        You will also need to grant your App Hosting service account access to this secret.

2.  **Deploy**:
    To deploy your application, simply run the following command from your project root:
    ```bash
    firebase deploy --only hosting
    ```
    The Firebase CLI will build your Next.js application and deploy it to Firebase App Hosting.
