<div align="left">
    <img src="https://img.icons8.com/?size=512&id=55494&format=png" width="40%" align="left" style="margin-right: 15px"/>
    <div style="display: inline-block;">
        <h2 style="display: inline-block; vertical-align: middle; margin-top: 0;">AITRIPPLANNER</h2>
        <p>
	<em><code>❯ REPLACE-ME</code></em>
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

<code>❯ REPLACE-ME</code>

---

## 👾 Features

<code>❯ REPLACE-ME</code>

---

## 📁 Project Structure

```sh
└── AiTripPlanner/
    ├── .github
    │   └── copilot-instructions.md
    ├── Procfile
    ├── README.md
    ├── backend
    │   ├── Dockerfile
    │   ├── api
    │   │   ├── chat_request.py
    │   │   ├── google_places_service.py
    │   │   ├── migrations
    │   │   │   ├── 0001_initial.py
    │   │   │   ├── 0002_visitedcountry.py
    │   │   │   ├── 0003_savedtrip.py
    │   │   │   ├── 0004_savedtrip_title.py
    │   │   │   ├── 0005_savedtrip_destination_image_urls.py
    │   │   │   ├── 0006_activitynote.py
    │   │   │   ├── 0007_activitynote_is_done.py
    │   │   │   └── __init__.py
    │   │   ├── models.py
    │   │   ├── serializers.py
    │   │   ├── urls.py
    │   │   ├── utils
    │   │   │   └── redis_client.py
    │   │   └── views.py
    │   ├── backend
    │   │   ├── __init__.py
    │   │   ├── asgi.py
    │   │   ├── settings.py
    │   │   ├── urls.py
    │   │   └── wsgi.py
    │   ├── manage.py
    │   ├── railway.json
    │   └── requirements.txt
    ├── docker-compose.yml
    ├── frontend
    │   ├── .dockerignore
    │   ├── .gitignore
    │   ├── .npmrc
    │   ├── Dockerfile
    │   ├── app
    │   │   ├── (auth)
    │   │   │   ├── components
    │   │   │   │   ├── AuthButton.tsx
    │   │   │   │   ├── AuthFooter.tsx
    │   │   │   │   ├── AuthFormDivider.tsx
    │   │   │   │   ├── AuthInput.tsx
    │   │   │   │   ├── AuthLayout.tsx
    │   │   │   │   ├── GoogleAuthButton.tsx
    │   │   │   │   ├── LoginForm.tsx
    │   │   │   │   ├── SigninForm.tsx
    │   │   │   │   └── SignupForm.tsx
    │   │   │   ├── context
    │   │   │   │   └── AuthContext.tsx
    │   │   │   ├── hooks
    │   │   │   │   └── useAuthForm.ts
    │   │   │   ├── layout.tsx
    │   │   │   ├── reset-password
    │   │   │   │   └── page.tsx
    │   │   │   ├── signin
    │   │   │   │   └── page.tsx
    │   │   │   ├── signup
    │   │   │   │   └── page.tsx
    │   │   │   └── utils
    │   │   │       └── authUtils.ts
    │   │   ├── (default)
    │   │   │   ├── about
    │   │   │   │   └── page.tsx
    │   │   │   ├── blog
    │   │   │   │   ├── [slug]
    │   │   │   │   └── page.tsx
    │   │   │   ├── layout.tsx
    │   │   │   ├── page.tsx
    │   │   │   ├── privacy
    │   │   │   │   └── page.tsx
    │   │   │   └── terms
    │   │   │       └── page.tsx
    │   │   ├── api
    │   │   │   └── auth
    │   │   │       └── google
    │   │   ├── css
    │   │   │   ├── additional-styles
    │   │   │   │   ├── custom-fonts.css
    │   │   │   │   ├── theme.css
    │   │   │   │   └── utility-patterns.css
    │   │   │   └── style.css
    │   │   ├── destinations
    │   │   │   └── page.tsx
    │   │   ├── fastplan
    │   │   │   ├── components
    │   │   │   │   └── steps
    │   │   │   ├── constants.ts
    │   │   │   ├── layout.tsx
    │   │   │   ├── page.tsx
    │   │   │   └── result
    │   │   │       ├── components
    │   │   │       └── page.tsx
    │   │   ├── globals.css
    │   │   ├── layout.tsx
    │   │   ├── mytrips
    │   │   │   ├── [tripId]
    │   │   │   │   └── live
    │   │   │   ├── layout.tsx
    │   │   │   └── page.tsx
    │   │   ├── not-found.tsx
    │   │   └── profile
    │   │       ├── layout.tsx
    │   │       └── page.tsx
    │   ├── assets
    │   │   └── globe-animation.json
    │   ├── components
    │   │   ├── AnimatedBlobs.tsx
    │   │   ├── CostBreakdownCard.tsx
    │   │   ├── CostsTab.tsx
    │   │   ├── DayCard.tsx
    │   │   ├── EffortlessPlanning.tsx
    │   │   ├── ErrorSection.tsx
    │   │   ├── ItineraryTab.tsx
    │   │   ├── LoadingSection.tsx
    │   │   ├── MapChart.tsx
    │   │   ├── Preview.tsx
    │   │   ├── TipsTab.tsx
    │   │   ├── TripDetailModal.tsx
    │   │   ├── accordion.tsx
    │   │   ├── all-destinations.tsx
    │   │   ├── call-to-action.tsx
    │   │   ├── features-planet.tsx
    │   │   ├── hero-home.tsx
    │   │   ├── how-it-works.tsx
    │   │   ├── popular-destinations.tsx
    │   │   └── ui
    │   │       ├── AnimatedSection.tsx
    │   │       ├── MacbookFrame.tsx
    │   │       ├── PageTransition.tsx
    │   │       ├── SectionBlob.tsx
    │   │       ├── footer.tsx
    │   │       ├── header.tsx
    │   │       └── logo.tsx
    │   ├── constants
    │   │   ├── landing.ts
    │   │   └── planTypes.ts
    │   ├── middleware.ts
    │   ├── next.config.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── pnpm-lock.yaml
    │   ├── postcss.config.js
    │   ├── public
    │   │   ├── data
    │   │   │   └── world-110m.json
    │   │   ├── desktop
    │   │   │   ├── 1696388255210.gif
    │   │   │   ├── 60.webp
    │   │   │   ├── 61.webp
    │   │   │   ├── 62.webp
    │   │   │   ├── cca5022c86f67861746d7cf2eb486de8.gif
    │   │   │   └── w.webp
    │   │   ├── favicon.ico
    │   │   ├── images
    │   │   │   ├── 404.png
    │   │   │   ├── 921j.gif
    │   │   │   ├── Homepage.png
    │   │   │   ├── Showcase.png
    │   │   │   ├── ShowcaseMobile1.webp
    │   │   │   ├── ShowcaseMobile2.webp
    │   │   │   ├── ShowcaseMobile3.webp
    │   │   │   ├── ShowcaseMobile4.webp
    │   │   │   ├── ShowcaseMobile5.webp
    │   │   │   ├── auth-bg.svg
    │   │   │   ├── back.jpg
    │   │   │   ├── default-avatar.png
    │   │   │   ├── destinations
    │   │   │   │   ├── bangkok.jpg
    │   │   │   │   ├── bangkok.webp
    │   │   │   │   ├── lhero.jpg
    │   │   │   │   ├── lhero.webp
    │   │   │   │   ├── mHero.png
    │   │   │   │   ├── mHero.webp
    │   │   │   │   ├── mykonos.jpg
    │   │   │   │   ├── mykonos.webp
    │   │   │   │   ├── new-york.jpg
    │   │   │   │   ├── new-york.webp
    │   │   │   │   ├── paris.jpg
    │   │   │   │   ├── paris.webp
    │   │   │   │   ├── parisHero.jpg
    │   │   │   │   ├── parisHero.webp
    │   │   │   │   ├── rhome.jpg
    │   │   │   │   ├── rhome.webp
    │   │   │   │   ├── rome.jpg
    │   │   │   │   ├── rome.webp
    │   │   │   │   ├── tokyo.jpg
    │   │   │   │   └── tokyo.webp
    │   │   │   ├── earth.png
    │   │   │   ├── globe-traveler.svg
    │   │   │   ├── loading.gif
    │   │   │   ├── logo.png
    │   │   │   ├── long-bg-desktop.webp
    │   │   │   └── long-bg-mobile.webp
    │   │   ├── index.html
    │   │   └── mobile
    │   │       ├── 60.webp
    │   │       ├── 61.webp
    │   │       ├── 62.webp
    │   │       ├── 63.webp
    │   │       ├── cca5022c86f67861746d7cf2eb486de8.gif
    │   │       └── w.webp
    │   ├── railway.json
    │   ├── server.js
    │   ├── styles
    │   │   └── globals.css
    │   ├── tailwind.config.js
    │   └── tsconfig.json
    ├── list_structure.py
    ├── logo.svg
    ├── package-lock.json
    ├── package.json
    ├── project_structure.txt
    └── trip_output.json
```


### 📂 Project Index
<details open>
	<summary><b><code>AITRIPPLANNER/</code></b></summary>
	<details> <!-- __root__ Submodule -->
		<summary><b>__root__</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/package-lock.json'>package-lock.json</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/trip_output.json'>trip_output.json</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/project_structure.txt'>project_structure.txt</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/list_structure.py'>list_structure.py</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/Procfile'>Procfile</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/package.json'>package.json</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/docker-compose.yml'>docker-compose.yml</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			</table>
		</blockquote>
	</details>
	<details> <!-- backend Submodule -->
		<summary><b>backend</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/backend/manage.py'>manage.py</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/backend/requirements.txt'>requirements.txt</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/backend/railway.json'>railway.json</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/backend/Dockerfile'>Dockerfile</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			</table>
			<details>
				<summary><b>backend</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/backend/backend/settings.py'>settings.py</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/backend/backend/urls.py'>urls.py</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/backend/backend/asgi.py'>asgi.py</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/backend/backend/wsgi.py'>wsgi.py</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>api</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/backend/api/chat_request.py'>chat_request.py</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/backend/api/views.py'>views.py</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/backend/api/google_places_service.py'>google_places_service.py</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/backend/api/urls.py'>urls.py</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/backend/api/serializers.py'>serializers.py</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/backend/api/models.py'>models.py</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
					<details>
						<summary><b>migrations</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/backend/api/migrations/0005_savedtrip_destination_image_urls.py'>0005_savedtrip_destination_image_urls.py</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/backend/api/migrations/0007_activitynote_is_done.py'>0007_activitynote_is_done.py</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/backend/api/migrations/0006_activitynote.py'>0006_activitynote.py</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/backend/api/migrations/0001_initial.py'>0001_initial.py</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/backend/api/migrations/0004_savedtrip_title.py'>0004_savedtrip_title.py</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/backend/api/migrations/0002_visitedcountry.py'>0002_visitedcountry.py</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/backend/api/migrations/0003_savedtrip.py'>0003_savedtrip.py</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>utils</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/backend/api/utils/redis_client.py'>redis_client.py</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
				</blockquote>
			</details>
		</blockquote>
	</details>
	<details> <!-- frontend Submodule -->
		<summary><b>frontend</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/postcss.config.js'>postcss.config.js</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/pnpm-lock.yaml'>pnpm-lock.yaml</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/package-lock.json'>package-lock.json</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/tsconfig.json'>tsconfig.json</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/tailwind.config.js'>tailwind.config.js</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/middleware.ts'>middleware.ts</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/.npmrc'>.npmrc</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/next.config.js'>next.config.js</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/package.json'>package.json</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/server.js'>server.js</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/railway.json'>railway.json</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/Dockerfile'>Dockerfile</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			</table>
			<details>
				<summary><b>styles</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/styles/globals.css'>globals.css</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>components</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/ErrorSection.tsx'>ErrorSection.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/accordion.tsx'>accordion.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/call-to-action.tsx'>call-to-action.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/MapChart.tsx'>MapChart.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/ItineraryTab.tsx'>ItineraryTab.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/CostsTab.tsx'>CostsTab.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/TipsTab.tsx'>TipsTab.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/all-destinations.tsx'>all-destinations.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/TripDetailModal.tsx'>TripDetailModal.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/popular-destinations.tsx'>popular-destinations.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/DayCard.tsx'>DayCard.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/features-planet.tsx'>features-planet.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/Preview.tsx'>Preview.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/CostBreakdownCard.tsx'>CostBreakdownCard.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/AnimatedBlobs.tsx'>AnimatedBlobs.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/LoadingSection.tsx'>LoadingSection.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/hero-home.tsx'>hero-home.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/EffortlessPlanning.tsx'>EffortlessPlanning.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/how-it-works.tsx'>how-it-works.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
					<details>
						<summary><b>ui</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/ui/PageTransition.tsx'>PageTransition.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/ui/footer.tsx'>footer.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/ui/AnimatedSection.tsx'>AnimatedSection.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/ui/SectionBlob.tsx'>SectionBlob.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/ui/MacbookFrame.tsx'>MacbookFrame.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/ui/logo.tsx'>logo.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/components/ui/header.tsx'>header.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
				</blockquote>
			</details>
			<details>
				<summary><b>constants</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/constants/planTypes.ts'>planTypes.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/constants/landing.ts'>landing.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>public</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/public/index.html'>index.html</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>app</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/layout.tsx'>layout.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/globals.css'>globals.css</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/not-found.tsx'>not-found.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
					<details>
						<summary><b>css</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/css/style.css'>style.css</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
							<details>
								<summary><b>additional-styles</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/css/additional-styles/custom-fonts.css'>custom-fonts.css</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/css/additional-styles/utility-patterns.css'>utility-patterns.css</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/css/additional-styles/theme.css'>theme.css</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>profile</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/profile/layout.tsx'>layout.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/profile/page.tsx'>page.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>fastplan</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/layout.tsx'>layout.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/page.tsx'>page.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/constants.ts'>constants.ts</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
							<details>
								<summary><b>components</b></summary>
								<blockquote>
									<details>
										<summary><b>steps</b></summary>
										<blockquote>
											<table>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/components/steps/Step3_TripStyleAndTravelWith.tsx'>Step3_TripStyleAndTravelWith.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/components/steps/Step4_Interests.tsx'>Step4_Interests.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/components/steps/Step7_SearchMode.tsx'>Step7_SearchMode.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/components/steps/Step5_PaceBudgetTransport.tsx'>Step5_PaceBudgetTransport.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/components/steps/Step2_TravelDates.tsx'>Step2_TravelDates.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/components/steps/Step1_Destination.tsx'>Step1_Destination.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/components/steps/Step6_FinalTouches.tsx'>Step6_FinalTouches.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											</table>
										</blockquote>
									</details>
								</blockquote>
							</details>
							<details>
								<summary><b>result</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/result/page.tsx'>page.tsx</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
									<details>
										<summary><b>components</b></summary>
										<blockquote>
											<table>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/result/components/ChatMessageItem.tsx'>ChatMessageItem.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/result/components/HeroSection.tsx'>HeroSection.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/result/components/ItineraryTab.tsx'>ItineraryTab.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/result/components/NavigationTabs.tsx'>NavigationTabs.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/result/components/CostsTab.tsx'>CostsTab.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/result/components/TripStats.tsx'>TripStats.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/result/components/SideChatPanel.tsx'>SideChatPanel.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/result/components/ActivityCard.tsx'>ActivityCard.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/result/components/DayCard.tsx'>DayCard.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/result/components/CostBreakdownCard.tsx'>CostBreakdownCard.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/result/components/PlaceDetailsPopup.tsx'>PlaceDetailsPopup.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/result/components/ShareButton.tsx'>ShareButton.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/result/components/ChatBubble.tsx'>ChatBubble.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/result/components/ErrorDisplay.tsx'>ErrorDisplay.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/result/components/Tripltinerary.tsx'>Tripltinerary.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/fastplan/result/components/LoadingDisplay.tsx'>LoadingDisplay.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											</table>
										</blockquote>
									</details>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>(auth)</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(auth)/layout.tsx'>layout.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
							<details>
								<summary><b>components</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(auth)/components/AuthLayout.tsx'>AuthLayout.tsx</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(auth)/components/AuthButton.tsx'>AuthButton.tsx</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(auth)/components/SigninForm.tsx'>SigninForm.tsx</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(auth)/components/LoginForm.tsx'>LoginForm.tsx</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(auth)/components/AuthFooter.tsx'>AuthFooter.tsx</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(auth)/components/SignupForm.tsx'>SignupForm.tsx</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(auth)/components/AuthFormDivider.tsx'>AuthFormDivider.tsx</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(auth)/components/AuthInput.tsx'>AuthInput.tsx</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(auth)/components/GoogleAuthButton.tsx'>GoogleAuthButton.tsx</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>hooks</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(auth)/hooks/useAuthForm.ts'>useAuthForm.ts</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>context</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(auth)/context/AuthContext.tsx'>AuthContext.tsx</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>signup</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(auth)/signup/page.tsx'>page.tsx</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>signin</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(auth)/signin/page.tsx'>page.tsx</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>reset-password</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(auth)/reset-password/page.tsx'>page.tsx</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>utils</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(auth)/utils/authUtils.ts'>authUtils.ts</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>mytrips</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/mytrips/layout.tsx'>layout.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/mytrips/page.tsx'>page.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
							<details>
								<summary><b>[tripId]</b></summary>
								<blockquote>
									<details>
										<summary><b>live</b></summary>
										<blockquote>
											<table>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/mytrips/[tripId]/live/liveTypes.ts'>liveTypes.ts</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/mytrips/[tripId]/live/page.tsx'>page.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											</table>
											<details>
												<summary><b>components</b></summary>
												<blockquote>
													<table>
													<tr>
														<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/mytrips/[tripId]/live/components/DailyProgressBar.tsx'>DailyProgressBar.tsx</a></b></td>
														<td><code>❯ REPLACE-ME</code></td>
													</tr>
													<tr>
														<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/mytrips/[tripId]/live/components/LiveTripHeader.tsx'>LiveTripHeader.tsx</a></b></td>
														<td><code>❯ REPLACE-ME</code></td>
													</tr>
													<tr>
														<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/mytrips/[tripId]/live/components/LiveDayDetails.tsx'>LiveDayDetails.tsx</a></b></td>
														<td><code>❯ REPLACE-ME</code></td>
													</tr>
													<tr>
														<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/mytrips/[tripId]/live/components/ErrorStateDisplay.tsx'>ErrorStateDisplay.tsx</a></b></td>
														<td><code>❯ REPLACE-ME</code></td>
													</tr>
													<tr>
														<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/mytrips/[tripId]/live/components/LoadingStateDisplay.tsx'>LoadingStateDisplay.tsx</a></b></td>
														<td><code>❯ REPLACE-ME</code></td>
													</tr>
													<tr>
														<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/mytrips/[tripId]/live/components/saveNote.ts'>saveNote.ts</a></b></td>
														<td><code>❯ REPLACE-ME</code></td>
													</tr>
													<tr>
														<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/mytrips/[tripId]/live/components/ActivitiesList.tsx'>ActivitiesList.tsx</a></b></td>
														<td><code>❯ REPLACE-ME</code></td>
													</tr>
													<tr>
														<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/mytrips/[tripId]/live/components/SwipeableActivities.tsx'>SwipeableActivities.tsx</a></b></td>
														<td><code>❯ REPLACE-ME</code></td>
													</tr>
													<tr>
														<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/mytrips/[tripId]/live/components/NoteModal.tsx'>NoteModal.tsx</a></b></td>
														<td><code>❯ REPLACE-ME</code></td>
													</tr>
													<tr>
														<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/mytrips/[tripId]/live/components/ActivityItem.tsx'>ActivityItem.tsx</a></b></td>
														<td><code>❯ REPLACE-ME</code></td>
													</tr>
													</table>
												</blockquote>
											</details>
											<details>
												<summary><b>hooks</b></summary>
												<blockquote>
													<table>
													<tr>
														<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/mytrips/[tripId]/live/hooks/useActivityNotes.ts'>useActivityNotes.ts</a></b></td>
														<td><code>❯ REPLACE-ME</code></td>
													</tr>
													<tr>
														<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/mytrips/[tripId]/live/hooks/saveNote.ts'>saveNote.ts</a></b></td>
														<td><code>❯ REPLACE-ME</code></td>
													</tr>
													<tr>
														<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/mytrips/[tripId]/live/hooks/useSideChat.ts'>useSideChat.ts</a></b></td>
														<td><code>❯ REPLACE-ME</code></td>
													</tr>
													</table>
												</blockquote>
											</details>
										</blockquote>
									</details>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>(default)</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(default)/layout.tsx'>layout.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(default)/page.tsx'>page.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
							<details>
								<summary><b>about</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(default)/about/page.tsx'>page.tsx</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>privacy</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(default)/privacy/page.tsx'>page.tsx</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>terms</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(default)/terms/page.tsx'>page.tsx</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
							<details>
								<summary><b>blog</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(default)/blog/page.tsx'>page.tsx</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
									<details>
										<summary><b>[slug]</b></summary>
										<blockquote>
											<table>
											<tr>
												<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/(default)/blog/[slug]/page.tsx'>page.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											</table>
										</blockquote>
									</details>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>api</b></summary>
						<blockquote>
							<details>
								<summary><b>auth</b></summary>
								<blockquote>
									<details>
										<summary><b>google</b></summary>
										<blockquote>
											<details>
												<summary><b>callback</b></summary>
												<blockquote>
													<table>
													<tr>
														<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/api/auth/google/callback/page.tsx'>page.tsx</a></b></td>
														<td><code>❯ REPLACE-ME</code></td>
													</tr>
													</table>
												</blockquote>
											</details>
										</blockquote>
									</details>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>destinations</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/Lidorpahima/AiTripPlanner/blob/master/frontend/app/destinations/page.tsx'>page.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
				</blockquote>
			</details>
		</blockquote>
	</details>
</details>

---
## 🚀 Getting Started

### ☑️ Prerequisites

Before getting started with AiTripPlanner, ensure your runtime environment meets the following requirements:

- **Programming Language:** TypeScript
- **Package Manager:** Npm, Pip
- **Container Runtime:** Docker


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


**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm install
```


**Using `pip`** &nbsp; [<img align="center" src="" />]()

```sh
❯ echo 'INSERT-INSTALL-COMMAND-HERE'
```


**Using `docker`** &nbsp; [<img align="center" src="https://img.shields.io/badge/Docker-2CA5E0.svg?style={badge_style}&logo=docker&logoColor=white" />](https://www.docker.com/)

```sh
❯ docker build -t Lidorpahima/AiTripPlanner .
```




### 🤖 Usage
Run AiTripPlanner using the following command:
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm start
```


**Using `pip`** &nbsp; [<img align="center" src="" />]()

```sh
❯ echo 'INSERT-RUN-COMMAND-HERE'
```


**Using `docker`** &nbsp; [<img align="center" src="https://img.shields.io/badge/Docker-2CA5E0.svg?style={badge_style}&logo=docker&logoColor=white" />](https://www.docker.com/)

```sh
❯ docker run -it {image_name}
```


### 🧪 Testing
Run the test suite using the following command:
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm test
```


**Using `pip`** &nbsp; [<img align="center" src="" />]()

```sh
❯ echo 'INSERT-TEST-COMMAND-HERE'
```


---
## 📌 Project Roadmap

- [X] **`Task 1`**: <strike>Implement feature one.</strike>
- [ ] **`Task 2`**: Implement feature two.
- [ ] **`Task 3`**: Implement feature three.

---

## 🔰 Contributing

- **💬 [Join the Discussions](https://github.com/Lidorpahima/AiTripPlanner/discussions)**: Share your insights, provide feedback, or ask questions.
- **🐛 [Report Issues](https://github.com/Lidorpahima/AiTripPlanner/issues)**: Submit bugs found or log feature requests for the `AiTripPlanner` project.
- **💡 [Submit Pull Requests](https://github.com/Lidorpahima/AiTripPlanner/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/Lidorpahima/AiTripPlanner
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="left">
   <a href="https://github.com{/Lidorpahima/AiTripPlanner/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=Lidorpahima/AiTripPlanner">
   </a>
</p>
</details>

---

## 🎗 License

This project is protected under the [SELECT-A-LICENSE](https://choosealicense.com/licenses) License. For more details, refer to the [LICENSE](https://choosealicense.com/licenses/) file.

---

## 🙌 Acknowledgments

- List any resources, contributors, inspiration, etc. here.

---