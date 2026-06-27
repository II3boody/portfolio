// ====================== GitHub Configuration ======================
const GITHUB_USERNAME = "II3boody";

const EXCLUDE_REPOS = ["II3boody", "portfolio", "portfolio-template"];

// ====================== Global Variables ======================
let allProjects = [];
let currentProjectIndex = 0;
let swiperInstance = null;

// ====================== DOM Elements ======================
const swiperSlides = document.querySelector(".swiper-wrapper");

const overlay = document.createElement("div");
overlay.classList.add("overlay", "position-fixed", "top-0", "popUp", "transition");

const popupContent = document.createElement("div");
popupContent.classList.add("popup-content", "white-bg", "p-4", "shadow", "mx-3", "mx-md-0", "position-relative");
overlay.appendChild(popupContent);
document.body.prepend(overlay);

const scriptURL = "https://script.google.com/macros/s/AKfycby3V6LAeuoCzAamCm4kacFDZisI1M5BQW5w09ji7Zblk5n3gDVaUeaMNW-lhSD_ZV08/exec";
const form = document.querySelector(".contact-form");
const toast = document.getElementById("Toast");

// ====================== Fetch Projects from GitHub ======================
async function fetchGitHubProjects() {
    const CACHE_KEY = "github_projects";
    const CACHE_TIME_KEY = "github_projects_timestamp";
    const CACHE_DURATION = 1000 * 60 * 60 * 2; // ساعتين

    try {
        // استخدام الكاش أولاً
        const cache = localStorage.getItem(CACHE_KEY);
        const cacheTime = localStorage.getItem(CACHE_TIME_KEY);
        const now = Date.now();

        if (cache && cacheTime && (now - parseInt(cacheTime) < CACHE_DURATION)) {
            return JSON.parse(cache);
        }

        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
        );

        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

        let repos = await response.json();

        repos = repos.filter(repo =>
            !EXCLUDE_REPOS.includes(repo.name) &&
            !repo.fork &&
            !repo.private
        );

        const projects = repos.map(repo => ({
            name: repo.name.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
            description: repo.description || "A modern web project built with passion.",
            tech: repo.topics?.length ? repo.topics : ["HTML", "CSS", "JavaScript"],
            link: repo.html_url,
            img: `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo.name}/main/screenshot.png`,

            fallbackImg: `https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${repo.name}`,
            soon: repo.topics?.some(t => ["soon", "wip", "coming-soon"].includes(t.toLowerCase()))
        }));

        localStorage.setItem(CACHE_KEY, JSON.stringify(projects));
        localStorage.setItem(CACHE_TIME_KEY, now.toString());

        return projects;

    } catch (error) {
        console.error("❌ GitHub fetch error:", error);

        const fallbackCache = localStorage.getItem(CACHE_KEY);
        if (fallbackCache) return JSON.parse(fallbackCache);

        return [];
    }
}
// ====================== Load Projects ======================
async function loadProjects() {
    if (!swiperSlides) return;

    swiperSlides.innerHTML = `
        <div class="swiper-slide d-flex justify-content-center align-items-center">
            <div class="text-center p-5">
                <div class="spinner-border text-primary mb-3"></div>
                <p>Loading projects...</p>
            </div>
        </div>
    `;

    allProjects = await fetchGitHubProjects();

    swiperSlides.innerHTML = "";

    if (!allProjects.length) {
        swiperSlides.innerHTML = `
            <div class="swiper-slide">
                <p class="text-center p-5">No projects found</p>
            </div>
        `;
        initSwiper();
        return;
    }

    allProjects.forEach((project, index) => {
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");

        const img = document.createElement("img");
        img.alt = project.name;
        img.loading = "lazy";

        img.src = project.img;

        img.onerror = () => {
            console.warn(`Failed to load image for: ${project.name}`);

            img.src = `https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${project.name.replace(/\s+/g, '-')}`;

            img.onerror = () => {
                slide.innerHTML = `
                <div style="width:100%; height:720px; background: linear-gradient(135deg, #1a1a1a, #333); 
                           display:flex; align-items:center; justify-content:center; color:white; 
                           font-size:1.2rem; text-align:center; padding:20px; border-radius:12px;">
                    <div>
                        <h3 style="margin-bottom:10px;">${project.name}</h3>
                        <p style="opacity:0.7; font-size:0.95rem;">Project Preview</p>
                    </div>
                </div>
            `;
            };
        };

        slide.appendChild(img);
        swiperSlides.appendChild(slide);

        slide.addEventListener("click", () => {
            currentProjectIndex = index;
            showPopup(index);
        });
    });

    initSwiper();
}
function initSwiper() {
    if (swiperInstance) swiperInstance.destroy(true, true);

    const enableLoop = allProjects.length > 3;

    swiperInstance = new Swiper(".mySwiper", {
        pagination: {
            el: ".swiper-pagination",
            clickable: true
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        },
        autoplay: allProjects.length > 1 ? {
            delay: 4000,
            disableOnInteraction: true,
            pauseOnMouseEnter: true
        } : false,
        loop: enableLoop,
        keyboard: { enabled: true },
        observer: true,
        observeParents: true,
        watchSlidesProgress: true,
        breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 10 },
            768: { slidesPerView: 1.2, spaceBetween: 20 },
            1024: { slidesPerView: 1, spaceBetween: 30 }
        }
    });
}
// ====================== Popup Function ======================
function showPopup(index) {
    document.body.style.overflow = "hidden";
    popupContent.innerHTML = "";

    const project = allProjects[index];

    const closeBtn = document.createElement("i");
    closeBtn.classList.add("fa-solid", "fa-circle-xmark", "close-btn");
    closeBtn.setAttribute("aria-label", "Close");

    const info = document.createElement("div");
    info.classList.add("info", "d-flex", "gap-3");

    const imgDiv = document.createElement("div");
    imgDiv.classList.add("project-img");
    const projectImg = document.createElement("img");
    projectImg.src = project.img;
    projectImg.alt = `${project.name} screenshot`;
    projectImg.loading = "lazy";
    imgDiv.appendChild(projectImg);

    const details = document.createElement("div");
    details.classList.add("details", "d-flex", "flex-column");

    const title = document.createElement("h2");
    title.innerHTML = `Project: <span>${project.name}</span>`;
    title.classList.add("my-3", "text-capitalize");

    const description = document.createElement("p");
    description.textContent = project.description;

    const techTitle = document.createElement("h3");
    techTitle.textContent = "Technologies";

    const techs = document.createElement("p");
    techs.classList.add("tech");
    techs.textContent = project.tech.join(", ");

    details.append(title, description, techTitle, techs);

    if (project.soon) {
        const soonMsg = document.createElement("p");
        soonMsg.innerHTML = `<strong>🚧 Coming Soon!</strong><br>This project is currently under development.`;
        soonMsg.style.color = "#ef4444";
        details.appendChild(soonMsg);
    } else if (project.link) {
        const projectLink = document.createElement("a");
        projectLink.href = project.link;
        projectLink.textContent = "Visit Project";
        projectLink.classList.add("project-link");
        projectLink.setAttribute("target", "_blank");
        projectLink.setAttribute("rel", "noopener");
        details.appendChild(projectLink);
    }

    info.append(imgDiv, details);
    popupContent.append(closeBtn, info);

    const prevBtn = document.createElement("button");
    prevBtn.classList.add("popup-prev");
    prevBtn.innerHTML = "<i class='fa-solid fa-chevron-left'></i>";

    const nextBtn = document.createElement("button");
    nextBtn.classList.add("popup-next");
    nextBtn.innerHTML = "<i class='fa-solid fa-chevron-right'></i>";

    popupContent.append(prevBtn, nextBtn);
    overlay.classList.add("active");

    closeBtn.onclick = closePopup;

    prevBtn.onclick = (e) => {
        e.stopPropagation();
        currentProjectIndex = (currentProjectIndex - 1 + allProjects.length) % allProjects.length;
        showPopup(currentProjectIndex);
    };

    nextBtn.onclick = (e) => {
        e.stopPropagation();
        currentProjectIndex = (currentProjectIndex + 1) % allProjects.length;
        showPopup(currentProjectIndex);
    };
}

function closePopup() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
}

// Overlay & Keyboard
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePopup();
});

document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("active")) return;
    if (e.key === "Escape") closePopup();
    if (e.key === "ArrowLeft") {
        currentProjectIndex = (currentProjectIndex - 1 + allProjects.length) % allProjects.length;
        showPopup(currentProjectIndex);
    }
    if (e.key === "ArrowRight") {
        currentProjectIndex = (currentProjectIndex + 1) % allProjects.length;
        showPopup(currentProjectIndex);
    }
});

// ====================== Form ======================
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 4000);

        try {
            await fetch(scriptURL, { method: "POST", body: new FormData(form) });
            setTimeout(() => window.location.reload(), 1200);
        } catch (error) {
            console.error("Error!", error);
            alert("There was an error sending your message. Please try again later.");
        }
    });
}

// ====================== Navigation ======================
function toggleNav() {
    const linksNav = document.getElementById("myNavLinks");
    if (linksNav.classList.contains("d-flex")) {
        linksNav.classList.toggle("close-animation");
        setTimeout(() => {
            linksNav.classList.toggle("close-animation");
            linksNav.classList.toggle("d-flex");
        }, 400);
    } else {
        linksNav.classList.toggle("open-animation");
        linksNav.classList.toggle("d-flex");
        setTimeout(() => linksNav.classList.toggle("open-animation"), 500);
    }
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 767) {
        document.getElementById("myNavLinks").classList.remove('d-flex', 'open-animation', 'close-animation');
    }
});

// ====================== Dark Mode ======================
const toggleDarkMode = document.querySelector(".dark-mode");
const logo = document.getElementById("nav-logo");
const arrow = document.querySelector(".arrow");


toggleDarkMode.addEventListener("click", function () {
    this.classList.toggle("active");
    document.body.classList.toggle("dark");
    updateTheme();
});

function updateTheme() {
    if (document.body.classList.contains("dark")) {
        logo.src = "imgs/ak-logo-white.webp";
        arrow.src = "imgs/arrow-inverted.webp";
        localStorage.setItem("theme", "dark");
    } else {
        logo.src = "imgs/ak-logo-black.webp";
        arrow.src = "imgs/arrow.webp";
        localStorage.setItem("theme", "light");
    }
}


// ====================== Scroll Spy ======================
window.addEventListener("scroll", () => {
    const nav = document.getElementById("myTopnav");
    if (window.scrollY > 120) {
        nav.classList.add("slidedown");
        document.body.style.paddingTop = "98px";
    } else {
        nav.classList.remove("slidedown");
        document.body.style.paddingTop = "0px";
    }

    let current = "";
    document.querySelectorAll("section").forEach(section => {
        if (scrollY >= section.offsetTop - section.offsetHeight / 2) {
            current = section.getAttribute("id");
        }
    });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });
});

// ====================== Animations ======================

function initAnimeAnimations() {
    const ml7 = document.querySelector('.ml7');
    if (ml7) {
        const textWrapper = ml7.querySelector('.letters');
        if (textWrapper) {
            textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
        }
        anime.timeline({ loop: false })
            .add({
                targets: '.ml7 .letter',
                translateY: ["1.1em", 0],
                translateX: ["0.55em", 0],
                translateZ: 0,
                rotateZ: [180, 0],
                duration: 750,
                easing: "easeOutExpo",
                delay: (el, i) => 50 * i
            });
    }

    const ml6 = document.querySelector('.ml6');
    if (ml6) {
        const textWrapper = ml6.querySelector('.letters');
        if (textWrapper) {
            textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
        }
        anime.timeline({ loop: true })
            .add({
                targets: '.ml6 .letter',
                translateY: ["1.1em", 0],
                translateZ: 0,
                duration: 750,
                delay: (el, i) => 50 * i
            })
            .add({
                targets: '.ml6',
                opacity: 0,
                duration: 1000,
                easing: "easeOutExpo",
                delay: 1500
            });
    }

    const ml2 = document.querySelector('.ml2');
    if (ml2) {
        ml2.innerHTML = ml2.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
        anime.timeline({ loop: true })
            .add({
                targets: '.ml2 .letter',
                scale: [4, 1],
                opacity: [0, 1],
                translateZ: 0,
                easing: "easeOutExpo",
                duration: 950,
                delay: (el, i) => 70 * i
            })
            .add({
                targets: '.ml2',
                opacity: 0,
                duration: 1000,
                easing: "easeOutExpo",
                delay: 1200
            });
    }
}

// ====================== Counting & Preloader ======================
function counting() {
    const counter = document.querySelector(".projects-num");
    if (!counter) return;

    let initialCount = 0;
    const finalCount = parseInt(counter.dataset.count || 15);

    const interval = setInterval(() => {
        initialCount++;
        counter.innerHTML = initialCount < 10 ? `0${initialCount}` : initialCount;
        if (initialCount >= finalCount) clearInterval(interval);
    }, 150);
}

function revealPreloader() {
    const ring = document.getElementById('ring');
    const logoImg = document.getElementById('preloader-logo');
    const tag = document.getElementById('tag');
    if (ring) ring.classList.add('done');
    if (logoImg) logoImg.classList.add('loaded');
    if (tag) tag.classList.add('show');
    setTimeout(() => document.getElementById('preloader').classList.add('hide'), 1000);
}

// ====================== Load Theme & Init ======================
window.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        if (toggleDarkMode) toggleDarkMode.classList.add("active");
    }
    updateTheme();

    loadProjects().finally(() => {
        setTimeout(revealPreloader, 500);
    });

    counting();
    initAnimeAnimations();
});

window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader && !preloader.classList.contains('hide')) {
            revealPreloader();
        }
    }, 5000);
});