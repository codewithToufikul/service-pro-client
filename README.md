# Service Pro - Client Side

Service Pro is a modern, full-featured service booking and management platform. It offers a seamless experience for users to discover, book, and manage services while providing service providers and admins with robust tools for management and real-time communication.

## 🚀 Key Features

- **User Authentication**: Secure login, registration, password recovery, and email verification.
- **Service Catalog**: Browse detailed service listings with categorized views.
- **Booking & Payments**: Integrated payment gateway using **SSLCommerz** for secure transactions.
- **Real-time Chat**: Direct communication between users and providers/admins via **Socket.io**.
- **Interactive Dashboard**: Personal dashboards for users to track orders and payment history.
- **CMS Content**: Dynamic blogs, FAQs, and latest work showcases.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views.
- **PDF Invoices**: Generate and download service booking receipts using `jsPDF`.

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [DaisyUI 5](https://daisyui.com/), [Material UI (MUI)](https://mui.com/)
- ** State Management & Data Fetching**: [TanStack React Query](https://tanstack.com/query/latest), [Axios](https://axios-http.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Authentication**: [Firebase](https://firebase.google.com/) (integration) & JWT (Backend sync)
- **Real-time**: [Socket.io Client](https://socket.io/)
- **Editors**: TinyMCE & React Quill for rich content creation.
- **Notifications**: SweetAlert2 & React Hot Toast.

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd service-pro-client
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   bun install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in the root directory and add:

   ```env
   VITE_API_BASE_URL=http://localhost:3000
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   # Add other Firebase/API variables as needed
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `src/AuthProvider/`: Authentication context and logic.
- `src/Component/`: Reusable UI components.
- `src/Firebase/`: Firebase configuration.
- `src/Pages/`: individual page components and routing logic.
- `src/assets/`: Static assets like images and global styles.

## 📄 License

This project is licensed under the ISC License.
