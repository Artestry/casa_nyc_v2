# CASA NYC v2

**Affordable Housing, Simplified.**

CASA NYC v2 is a modern, AI-powered web application designed to help New Yorkers navigate the complex affordable housing lottery system (Housing Connect). It matches users with real-world housing opportunities based on income, household size, and location preferences.

## ✨ Key Features

*   **Intelligent Intake Wizard**: A user-friendly 4-step form that captures financial profiles, voucher status (Section 8/CityFHEPS), and accessibility needs.
*   **Real-Time Dashboard**: Visualizes the user's income against 2024 NYC AMI (Area Median Income) bands using interactive charts.
*   **Smart Matching**: Automatically filters a curated list of active NYC developments (e.g., Bronx Point, 595 Dean St) based on eligibility.
*   **AI Assistant**: Always-on chat support powered by **Google Gemini 2.5 Flash** to explain complex housing terms and eligibility rules.
*   **Dynamic Imagery**: Fetches real-time Street View images of listing addresses using Google Maps integration.

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS
*   **Routing**: React Router DOM (HashRouter)
*   **Visualization**: Recharts
*   **AI**: Google GenAI SDK (Gemini 2.5 Flash)
*   **Icons**: Lucide React
*   **Data Simulation**: Custom Mock API via `apiFetch`

## 🚀 Getting Started

### Prerequisites

*   A **Google Gemini API Key** (for the AI Assistant).
*   (Optional) A **Google Maps API Key** (for Street View images).

### Environment Setup

The application expects API keys to be available in the environment variables.

```env
process.env.API_KEY = "YOUR_GEMINI_API_KEY"
```

*Note: In the current demo environment, this is injected automatically. If running locally, you may need to configure your build tool (Vite/Webpack) to expose these variables.*

### Installation & Running

1.  **Install Dependencies** (if running locally):
    ```bash
    npm install
    ```

2.  **Start the Application**:
    ```bash
    npm start
    ```

3.  **Usage Flow**:
    *   **Step 1**: Complete the intake form with your details (income, household size).
    *   **Step 2**: View your personalized Dashboard.
    *   **Step 3**: Use the "Filter" button to toggle boroughs.
    *   **Step 4**: Click the chat icon (bottom right) to ask the AI assistant questions like "What is 80% AMI?".

## 🧩 Architecture Highlights

*   **Mock API**: The app does not require a backend server. It uses `services/mockApi.ts` to intercept requests and return data from a local constant file, simulating network latency and server-side filtering logic.
*   **Real Data**: While the backend is mocked, the data (`constants.ts`) represents **actual** recent housing lotteries and developments in NYC, not "lorem ipsum" text.
*   **Robustness**: The app includes comprehensive error handling, retry logic for failed "network" requests, and graceful fallbacks for missing API keys or images.

---
© 2024 CASA NYC. Not affiliated with NYC Housing Connect or HPD.