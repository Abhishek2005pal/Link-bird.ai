# Linkbird.ai Platform Replication

This project is a full-stack application built for the Kandid Full-Stack internship assignment. It replicates core features of the **Linkbird.ai** platform, focusing on lead and campaign management. The goal was to build a polished, responsive, and functional web application using a modern tech stack centered around Next.js.

## 🚀 Live Demo & Video Walkthrough

* **Vercel Deployed Link:** **[https://link-bird-ai.vercel.app/](https://link-bird-ai.vercel.app/)**
* **Video Showcase (Google Drive):** **[https://drive.google.com/file/d/1RVNxfe0Vv6CecWZHlbVtJwjDU_mSxKNd/view](https://drive.google.com/file/d/1RVNxfe0Vv6CecWZHlbVtJwjDU_mSxKNd/view?usp=drive_link)**

## ✨ Features Implemented

* **Authentication:** Secure user sign-in via a pop-up dialog, with support for Google OAuth.
* **Responsive Sidebar Navigation:** A collapsible sidebar for easy and intuitive navigation between the different sections of the application (Leads, Campaigns, Settings).
* **Leads Management:** A dedicated page to view all leads in a clean, scrollable table. Users can add new leads through a modal form.
* **Campaigns Management:** A section to display all marketing campaigns, their status, and key performance metrics. Users can also create new campaigns.
* **User Profile Settings:** A basic page for viewing user profile information.
* **Polished UI:** A clean and modern user interface built to closely match the design of the original Linkbird.ai platform.

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
* **Database ORM:** [Drizzle ORM](https://orm.drizzle.team/)
* **Database:** [PostgreSQL](https://www.postgresql.org/)
* **Data Fetching & State:** [TanStack Query](https://tanstack.com/query/latest) & [Zustand](https://zustand-demo.pmnd.rs/)
* **Deployment:** [Vercel](https://vercel.com/)

## ⚙️ Getting Started Locally

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or later)
* npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Abhishek2005pal/Link-bird.ai.git](https://github.com/Abhishek2005pal/Link-bird.ai.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd Link-bird.ai
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```
4.  **Set up environment variables:**
    Create a file named `.env.local` in the root of your project and add the necessary environment variables.
    ```env
    # .env.local
    DATABASE_URL="your_postgresql_connection_string"
    GOOGLE_CLIENT_ID="your_google_client_id"
    GOOGLE_CLIENT_SECRET="your_google_client_secret"
    NEXTAUTH_SECRET="generate_a_random_secret_string"
    NEXTAUTH_URL="http://localhost:3000"
    ```
5.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚀 Deploy on Vercel

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
