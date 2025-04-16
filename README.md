![Image](https://github.com/PlanoraTech/other-important-files/blob/9f8744e572874a421c6820d62750ddc49fd4d72a/planora-logo-white-github.png)
# Planora
This repository contains the web front of **Planora**, a comprehensive all-in-one institution management system.

# Setup

## Prerequisites

- **Node.js** (version 22 or higher): Ensure that Node.js and npm are installed on your machine. You can download them [here](https://nodejs.org/).

## Steps to Run the App

### 1. Clone the Repository
Clone the project repository to your local machine:
```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install Dependencies
Install the required dependencies:
```bash
npm i
```

### 3. Configure Environment Variables (.env)
Create a .env file in the root directory of the project with the following content:
```.env
VITE_BASE_URL=https://example.com/institutions
VITE_AUTH_URL=https://example.com
```
Variable descriptions:
- VITE_BASE_URL: Base URL for institution-related API calls.
- VITE_AUTH_URL: Base URL for authentication-related API calls.


### 4. Run the Frontend in Development Mode
Finally, to start the backend in development mode, use the following command:
```bash
npm run dev
```
