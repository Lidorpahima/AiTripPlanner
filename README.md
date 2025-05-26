<div align="left">
    <img src="https://img.icons8.com/?size=512&id=55494&format=png" width="40%" align="left" style="margin-right: 15px"/>
    <div style="display: inline-block;">
        <h2 style="display: inline-block; vertical-align: middle; margin-top: 0;">AITRIPPLANNER</h2>
        <p>
	<em><code>AI-powered travel planning platform that creates personalized itineraries with real-time data and smart recommendations</code></em>
</p>
        <p>
	<img src="https://img.shields.io/github/license/Lidorpahima/AiTripPlanner?style=flat-square&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/Lidorpahima/AiTripPlanner?style=flat-square&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/Lidorpahima/AiTripPlanner?style=flat-square&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/Lidorpahima/AiTripPlanner?style=flat-square&color=0080ff" alt="repo-language-count">
</p>
        <p>Built with the tools and technologies:</p>
        <p>
	<img src="https://img.shields.io/badge/npm-CB3837.svg?style=flat-square&logo=npm&logoColor=white" alt="npm">
	<img src="https://img.shields.io/badge/Redis-DC382D.svg?style=flat-square&logo=Redis&logoColor=white" alt="Redis">
	<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=flat-square&logo=HTML5&logoColor=white" alt="HTML5">
	<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat-square&logo=JavaScript&logoColor=black" alt="JavaScript">
	<img src="https://img.shields.io/badge/Docker-2496ED.svg?style=flat-square&logo=Docker&logoColor=white" alt="Docker">
	<img src="https://img.shields.io/badge/Python-3776AB.svg?style=flat-square&logo=Python&logoColor=white" alt="Python">
	<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat-square&logo=TypeScript&logoColor=white" alt="TypeScript">
	<img src="https://img.shields.io/badge/Axios-5A29E4.svg?style=flat-square&logo=Axios&logoColor=white" alt="Axios">
</p>
    </div>
</div>
<br clear="left"/>

## 🔗 Quick Links

- [📍 Overview](#-overview)
- [👾 Features](#-features)
- [📁 Project Structure](#-project-structure)
  - [📂 Project Index](#-project-index)
- [🚀 Getting Started](#-getting-started)
  - [☑️ Prerequisites](#-prerequisites)
  - [⚙️ Installation](#-installation)
  - [🤖 Usage](#🤖-usage)
  - [🧪 Testing](#🧪-testing)
- [📌 Project Roadmap](#-project-roadmap)
- [🔰 Contributing](#-contributing)
- [🎗 License](#-license)
- [🙌 Acknowledgments](#-acknowledgments)

---

## 📍 Overview

AiTripPlanner is a smart travel companion designed to simplify your trip planning. Leveraging AI (powered by Gemini) and real-time data (from Google Places), it generates personalized itineraries including optimized routes, points of interest, and local events happening during your selected dates.

Simply choose your destination and dates, select your travel style and pace, and let AiTripPlanner craft a detailed plan for your next adventure. Save your trips, access details, and explore the world more intelligently.

---

## 👾 Features

- **AI-Powered Planning**: Generate personalized travel itineraries using Gemini AI
- **Real-Time Data**: Access up-to-date information from Google Places API
- **Smart Recommendations**: Get tailored suggestions based on your preferences
- **Interactive Itinerary**: View and modify your trip plan with an intuitive interface
- **Cost Estimates**: Get detailed cost breakdowns for accommodations, food, attractions, and transportation
- **Live Trip Mode**: Track your progress and manage activities during your trip
- **Place Details**: Access comprehensive information about attractions, including photos and reviews
- **Navigation Integration**: Get directions to your planned activities
- **Trip Sharing**: Share your itinerary with friends and family
- **Activity Notes**: Add personal notes and mark activities as completed
- **Multiple Trip Styles**: Choose from Relaxing, Adventurous, Cultural, or Romantic trip styles
- **Budget Management**: Get cost estimates and budget tips for your destination
- **Transportation Options**: View available transportation modes with cost ranges
- **Emergency Information**: Access important emergency contacts for your destination

## 🖼️ Preview

<img src="Screenshot 2025-04-11 161510.png" alt="Project Screenshot" width="600" />

## ⚙️ Technologies Used

- 🐍 <strong>Django</strong> + Django REST Framework (API)
- 🔐 <strong>JWT Authentication</strong>
- 💾 <strong>PostgreSQL</strong> (Database)
- 💻 <strong>Next.js</strong> 13+ (Frontend with App Router)
- 🎨 <strong>Tailwind CSS</strong> (Modern styling)
- 🪄 <strong>Lottie</strong> (for smooth animations)

## 🚀 Getting Started

### ☑️ Prerequisites

Before getting started with AiTripPlanner, ensure your runtime environment meets the following requirements:

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **Docker** (optional, for containerized deployment)
- **Redis** (for caching and session management)
- **Google Places API Key** (for location data)
- **Gemini API Key** (for AI-powered planning)

### ⚙️ Installation

Install AiTripPlanner using one of the following methods:

**Build from source:**

1. Clone the AiTripPlanner repository:
```sh
❯ git clone https://github.com/Lidorpahima/AiTripPlanner
```

2. Navigate to the project directory:
```sh
❯ cd AiTripPlanner
```

3. Install the project dependencies:

**Backend (Django)**
```sh
❯ cd backend
❯ python -m venv env
❯ source env/bin/activate  # On Windows: .\env\Scripts\activate
❯ pip install -r requirements.txt
❯ python manage.py migrate
```

**Frontend (Next.js)**
```sh
❯ cd frontend
❯ npm install
```

**Using Docker**
```sh
❯ docker-compose up --build
```

### 🤖 Usage

Run AiTripPlanner using the following commands:

**Backend (Django)**
```sh
❯ cd backend
❯ python manage.py runserver
```

**Frontend (Next.js)**
```sh
❯ cd frontend
❯ npm run dev
```

**Using Docker**
```sh
❯ docker-compose up
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

### 🧪 Testing

Run the test suite using the following commands:

**Backend Tests**
```sh
❯ cd backend
❯ python manage.py test
```

**Frontend Tests**
```sh
❯ cd frontend
❯ npm test
```

## 🧠 Project Vision

TripPlanner AI is designed to empower travelers to plan and manage their journeys easily, whether it's a weekend getaway or a world tour. The goal is to provide an intelligent and seamless experience using modern web technologies and AI integration.

## 👨‍💻 Developer

- <strong>lidorpahima28@gmail.com</strong>
- <a href="https://github.com/Lidorpahima" target="_blank">GitHub</a>
- <a href="https://linkedin.com/in/lidor-pahima" target="_blank">LinkedIn</a>

## 📌 Project Roadmap

- [X] **`Core Features`**: Implement basic trip planning functionality
  - [X] AI-powered itinerary generation
  - [X] Real-time place data integration
  - [X] Cost estimation system
  - [X] User authentication
- [X] **`Live Trip Mode`**: Add real-time trip management
  - [X] Activity tracking
  - [X] Progress monitoring
  - [X] Notes and modifications
- [ ] **`Enhanced Features`**: Future improvements
  - [ ] Multi-language support
  - [ ] Offline mode
  - [ ] Mobile app development
  - [ ] Social sharing features
  - [ ] Advanced analytics
  - [ ] Weather integration
  - [ ] Booking system integration

---

## 🔰 Contributing

We welcome contributions to AiTripPlanner! Here's how you can help:

- **💬 [Join the Discussions](https://github.com/Lidorpahima/AiTripPlanner/discussions)**: Share your insights, provide feedback, or ask questions.
- **🐛 [Report Issues](https://github.com/Lidorpahima/AiTripPlanner/issues)**: Submit bugs found or log feature requests.
- **💡 [Submit Pull Requests](https://github.com/Lidorpahima/AiTripPlanner/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.

<details>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your GitHub account.
2. **Clone Locally**: Clone the forked repository to your local machine.
   ```sh
   git clone https://github.com/Lidorpahima/AiTripPlanner
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b feature/your-feature-name
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Add new feature: description'
   ```
6. **Push to GitHub**: Push the changes to your forked repository.
   ```sh
   git push origin feature/your-feature-name
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch.

**Code Style Guidelines:**
- Follow the existing code style and formatting
- Write clear and descriptive commit messages
- Include tests for new features
- Update documentation as needed
- Keep PRs focused and manageable in size

</details>

<details>
<summary>Contributor Graph</summary>
<br>
<p align="left">
   <a href="https://github.com/Lidorpahima/AiTripPlanner/graphs/contributors">
      <img src="https://contrib.rocks/image?repo=Lidorpahima/AiTripPlanner">
   </a>
</p>
</details>

---

## 🎗 License

This project is protected under the [MIT License](https://choosealicense.com/licenses/mit/). For more details, refer to the [LICENSE](LICENSE) file.

---

## 🙌 Acknowledgments

- **Google Places API**: For providing comprehensive location data
- **Gemini AI**: For powering the intelligent trip planning features
- **Next.js Team**: For the amazing frontend framework
- **Django Team**: For the robust backend framework
- **All Contributors**: For their valuable contributions to the project

---

</body>
</html>
