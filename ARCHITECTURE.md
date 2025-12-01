# CASA NYC v2 - System Architecture

## 1. System Overview

CASA NYC v2 is a client-side Single Page Application (SPA) designed to streamline the affordable housing search process for NYC residents. It replaces traditional backend dependencies with a robust "Mock API" service architecture for demonstration and development purposes, while integrating real-time AI capabilities via the Google Gemini API.

### High-Level Architecture

```mermaid
graph TD
    User[User] --> UI[React Frontend]
    
    subgraph "Presentation Layer"
        UI --> Router[App Router]
        Router --> Intake[Intake Form]
        Router --> Dash[Dashboard]
        Router --> Chat[AI Assistant]
    end
    
    subgraph "Service Layer"
        Dash --> MockAPI[Mock API Service]
        Chat --> Gemini[Gemini Service]
        ListingCard --> GMaps[Google Maps Static API]
    end
    
    subgraph "Data Layer"
        MockAPI --> Constants[Static Data (Real-world Listings)]
        MockAPI --> Filtering[In-Memory Filtering Engine]
    end
    
    Gemini --> GoogleCloud[Google Cloud Vertex AI / Studio]
```

## 2. Core Layers

### A. Presentation Layer (React)
The UI is built with **React 19** and **Tailwind CSS**. It follows a component-based architecture:

*   **`App.tsx`**: Acts as the layout shell and global state manager. It holds the `UserPreferences` state, determining whether to show the `IntakeForm` or the `Dashboard`.
*   **`IntakeForm.tsx`**: A 4-step wizard pattern utilizing local state for form validation before lifting state up to `App`.
*   **`Dashboard.tsx`**: The main view for authenticated users. It manages data fetching states (`loading`, `error`, `data`) and local UI state (filters).
*   **`AiAssistant.tsx`**: A floating, always-on chat interface that manages an ephemeral chat session and streaming responses.

### B. Service Layer
The application decouples UI from data fetching using dedicated service modules:

1.  **Mock API Service (`services/mockApi.ts`)**:
    *   **Purpose**: Simulates a RESTful backend without requiring a server.
    *   **Implementation**: Exports an `apiFetch` utility that mimics the signature of the native `fetch` API.
    *   **Behavior**: Intercepts requests to `/api/listings`, parses query parameters (borough, income, rent), filters static data, and returns a standard `Response` object after a simulated network delay.
    
2.  **Gemini Service (`services/geminiService.ts`)**:
    *   **Purpose**: Manages communication with Google's Gemini 2.5 Flash model.
    *   **Implementation**: Uses the `@google/genai` SDK.
    *   **Features**: Maintains chat history/context and handles response streaming via async generators.

3.  **Listing Service (`services/listingService.ts`)**:
    *   *Deprecated/Legacy*: Originally used for direct function calls. The app now prefers the `apiFetch` pattern to simulate real HTTP requests closer to the network boundary.

### C. Data Layer
*   **Static Data (`constants.ts`)**: Contains a curated dataset of real-world NYC affordable housing developments (e.g., Gotham Point, TFC properties). This replaces a database for this specific architectural iteration.
*   **Types (`types.ts`)**: Strict TypeScript interfaces (`Listing`, `UserPreferences`) ensure type safety across the application.

## 3. Key Design Decisions

### Mock API vs. Monkey Patching
*   **Decision**: We use a dedicated `apiFetch` utility instead of overwriting `window.fetch`.
*   **Reasoning**: Modern browser environments and security contexts often make `window` properties read-only. `apiFetch` provides a safer, portable way to mock endpoints without polluting the global scope or causing runtime errors in strict environments.

### Real-time Filtering
*   **Mechanism**: Filtering happens "Server-side" (simulated within `apiFetch`).
*   **Logic**: 
    *   **Borough**: Case-insensitive exact match.
    *   **Income**: Filters out listings where the user's income is significantly below the minimum requirement (lenient 70% threshold).
    *   **Rent**: Filters units exceeding the user's maximum budget.

### Dynamic Imagery
*   **Implementation**: Listing images are generated dynamically using the **Google Maps Street View Static API**.
*   **Fallback**: If no API key is present or the image fails to load, the UI gracefully degrades to a stylized placeholder to prevent broken user experiences.

## 4. Directory Structure

```
/
├── components/         # UI Components
│   ├── AiAssistant.tsx # Chat Widget
│   ├── Dashboard.tsx   # Main Listing View
│   ├── IntakeForm.tsx  # Wizard Form
│   └── ListingCard.tsx # Individual Item Display
├── services/           # Business Logic & API
│   ├── geminiService.ts # AI Integration
│   ├── mockApi.ts      # Backend Simulation
│   └── listingService.ts
├── constants.ts        # Static Data & Config
├── types.ts            # TypeScript Definitions
├── App.tsx             # Root Component
├── index.tsx           # Entry Point
└── metadata.json       # Permission Config
```