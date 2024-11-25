# CookieMonster 🥠

**CookieMonster** is an open-source tool designed to automate the process of fetching valid cookies and analyzing additional network requests for websites protected by services like Cloudflare. By using a headful Chrome browser and Playwright, it helps users replicate browser-like behavior in their scraping scripts.

---

## 🚀 Features

- **Built-in Headful Chrome:** Chrome is included in the Docker image and automatically started when the container runs—no external browser setup required.
- **Playwright Automation:** Captures network requests and cookies programmatically.
- **Cookie Harvesting:** Extracts valid cookies that can be used for authenticated scraping.
- **Header Analysis:** Logs details of additional network requests (e.g., `xhr`, `fetch`) including URL, HTTP methods, and headers.
- **Optional VNC Debugging:** Observe the browser in real-time by exposing a VNC server on port `3000`.

---

## 🛠️ How It Works

1. **Start the Browser:** The container launches a headful Chrome browser, configured automatically.
2. **Capture Requests:** As the target URL is loaded, the script intercepts network requests of type `xhr` or `fetch`.
3. **Extract Data:**
   - **Cookies:** Collects valid cookies set during browsing.
   - **Request Details:** Logs the URL, HTTP method, POST data (if applicable), and headers for additional requests sent by the browser.
4. **Save Results:** Outputs all gathered data as a structured JSON file (`/tmp/result.json`).

---

## 📦 Installation

### Prerequisites

- [Docker](https://www.docker.com/) (Chrome and Playwright are bundled in the image).

### Clone the Repository

```bash
git clone https://github.com/stephankaag/cookie-monster.git
cd cookie-monster
```

### Build the Docker Image

```bash
docker build -t cookiemonster .
```

## 🚦 Usage

### Run the CookieMonster Container

Replace <TARGET_URL> with the desired URL:

```bash
docker run -e URL="<TARGET_URL>" cookiemonster
```

### Optional: Debugging with VNC

```bash
docker run -e URL=<TARGET_URL> -p 3000:3000 cookiemonster
```

Access the VNC server via localhost:3000 in a VNC viewer.

### Example Script for Running & Extracting Results

```bash
docker run -e URL=https://www.imdb.com/calendar -p 3000:3000 cookiemonster
CONTAINER_ID=$(docker ps -alq)
docker cp $CONTAINER_ID:/tmp/result.json .
```

This script runs the container, extracts the result file, and saves it to your local machine.

---

## 🔧 Environment Variables
- `URL`: The target URL to load and fetch cookies from.
- `DEBUG`: (Optional) Set to 1 to enable detailed logs in the console.

---

## 🛡️ Disclaimer

**CookieMonster** is a tool intended for ethical purposes only. Ensure you have permission to access and scrape the websites you target. The maintainers are not responsible for misuse.

---

## 🙌 Contributions

Contributions, issues, and feature requests are welcome!
Feel free to open an issue or create a pull request.

---

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## ❤️ Acknowledgments

- [Playwright](https://playwright.dev) for powerful browser automation.
- [KasmVNC Base Images from LinuxServer](https://github.com/linuxserver/docker-baseimage-kasmvnc) for a full featured web native Linux desktop experience
