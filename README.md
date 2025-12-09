# Bicycle Web - Admin Dashboard (Frontend)

![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-ISC-green?style=for-the-badge)

A powerful, modern, and responsive **Admin Dashboard** for the Bicycle Management System. Built with **Next.js 15**, **Tailwind CSS**, and **TypeScript**, this application provides a comprehensive interface for administrators to manage inventory, sales, customers, and reports.

## 🚀 Features

- **📊 Interactive Dashboard**: Real-time sales overview, revenue charts (ApexCharts/Chart.js), and key performance indicators.
- **📦 Inventory Management**: Complete CRUD operations for products, categories, and stock adjustment via CSV import/export.
- **🛒 Order Management**: Track and process customer orders, view status, and manage shipping details.
- **👥 User Management**: Admin and customer account management with role-based access control.
- **📅 Visual Utilities**: Integrated Calendar (FullCalendar) and Kanban board for task/process management.
- **📝 Reporting System**: Generate and export detailed reports (CSV/PDF) for inventory, sales, and revenue.
- **🌙 Dark Mode**: Fully supported dark/light mode toggle for better user experience.
- **📱 Responsive Design**: Optimized for desktops, tablets, and mobile devices.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Directory)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Charts**: ApexCharts, Chart.js, Recharts
- **State Management**: React Hooks & Context
- **Utilities**:
  - `axios`: API requests
  - `react-dnd`: Drag and drop functionality
  - `fullcalendar`: Event management
  - `@react-jvectormap`: Interactive maps
  - `flatpickr`: Date point picking

## 📂 Project Structure

```bash
bicycle-web-FE/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable UI components (Tables, Charts, Forms)
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Helper functions
│   └── styles/           # Global styles & Tailwind config
├── public/               # Static assets (images, icons)
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

## ⚙️ Installation & Usage

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/phuongloannn/bicycle-web-FE.git
cd bicycle-web-FE
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and configure your API endpoint:

**Backend Server Info:**
- Public IP: `47.129.172.108`
- Instance: `bike-shop-backend` (i-0200cdaf258f1f0aa)

**Cho Local Development:**
```env
# Backend API base URL (without trailing slash)
NEXT_PUBLIC_API_BASE_URL=http://47.129.172.108:3000
```

**Lưu ý:**
- Thay `3000` bằng port thực tế mà backend đang chạy (nếu khác)
- Không thêm trailing slash (`/`) ở cuối URL
- Cho production trên Vercel, cần HTTPS và domain name (xem `ENV_GUIDE.md`)

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## 🏗️ Build for Production

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the **ISC License**.

---

**Developed for ThuhongBicycle Project**
