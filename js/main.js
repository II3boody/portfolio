const projects = [
    {
        name: "Elzero Dashboard UI",
        description: "A clean and modern dashboard interface built to manage settings, projects, users, and statistics. It features a responsive layout, informative panels, navigation menu, and widgets to visualize data clearly and interactively.",
        tech: ["HTML", "CSS"],
        link: "https://ii3boody.github.io/Elzero-Fourth-Design/",
        img: "imgs/wrap1.webp",
    },
    {
        name: "Elzero Template V3",
        description: "A multi-section marketing & portfolio template built to display articles, features, gallery, team members, services, and more. It offers responsive layouts, modular sections, and modern UI components to create a complete website framework.",
        tech: ["HTML", "CSS"],
        link: "https://ii3boody.github.io/Elzero-Templete-V3/",
        img: "imgs/wrap2.webp",
    },
    {
        name: "Kasper Template Challenge",
        description: "A creative multi-section template showcasing services, portfolio, team, pricing, and contact sections with modern and clean design. Responsive layout, visual effects, and modular components that adapt to different screen sizes.",
        tech: ["HTML", "CSS"],
        link: "https://ii3boody.github.io/Kasper-Template-challange/",
        img: "imgs/wrap3.webp"
    },
    {
        name: "Bealthy life style (In Progress)",
        description: "Bealthy for Healthy LifeA comprehensive health and fitness platform designed to promote a healthy lifestyle through a weekly home workout plan and a tailored diet plan. The project features a bilingual (Arabic and English) interface with detailed exercise routines, including images and instructional videos for each workout. It also includes a practical diet plan optimized for weight gain and muscle building, with portion sizes based on local dietary habits (e.g., using 'baladi bread' as a measure). The platform is responsive, user-friendly, and includes options to save or print plans as PDFs, making it accessible for users aiming to improve their fitness and nutrition at home.",
        tech: ["HTML", "CSS", "JavaScript"],
        link: "",
        img: "imgs/wrap4.webp",
        soon: true
    },
    {
        name: "MOODS Restaurant & Cafe (In Progress)",
        description: "A restaurant & cafe concept currently under development. This project aims to offer menu displays, categories (sandwiches, meals, desserts, juices), promotional sections, and customer reviews. The design emphasizes appetizing visuals, clean layout, and a modern feel — stay tuned for more!",
        tech: ["HTML", "CSS", "JavaScript"],
        link: "",
        img: "imgs/wrap5.webp",
        soon: true
    }
];

const swiperSlides = document.querySelector(".swiper-wrapper");

let overlay = document.createElement("div");
overlay.classList.add("overlay", "position-fixed", "top-0", "popUp", "transition");

let popupContent = document.createElement("div");
popupContent.classList.add("popup-content", "white-bg", "p-4", "rounded", "shadow", "mx-3", "mx-md-0", "position-relative");

overlay.append(popupContent);
document.body.prepend(overlay);

if (swiperSlides) {
    projects.forEach(project => {
        let mainDiv = document.createElement("div");
        mainDiv.classList.add("swiper-slide", "w-100");

        let theImg = document.createElement("img");
        theImg.src = project.img;
        theImg.alt = `${project.name} screenshot`;
        mainDiv.append(theImg);

        if (project.soon) {
            mainDiv.classList.add("soon");
            theImg.classList.add("blur");
        }

        swiperSlides.append(mainDiv);

        //  Popup
        mainDiv.onclick = () => {
            popupContent.innerHTML = "";

            let closeBtn = document.createElement("i");
            closeBtn.classList.add("fa-solid", "fa-circle-xmark", "close-btn");

            let info = document.createElement("div");
            info.classList.add("info", "d-flex", "gap-3");

            let imgDiv = document.createElement("div");
            imgDiv.classList.add("project-img");
            let projectImg = document.createElement("img");
            projectImg.src = project.img;
            projectImg.alt = `${project.name} screenshot`;
            imgDiv.appendChild(projectImg);

            let details = document.createElement("div");
            details.classList.add("details", "d-flex", "flex-column");

            let title = document.createElement("h2");
            title.innerHTML = `Project: <span>${project.name}</span>`;
            title.classList.add("my-2", "text-capitalize");

            let description = document.createElement("p");
            description.textContent = project.description;
            description.classList.add("my-2");

            let techTitle = document.createElement("h3");
            techTitle.textContent = "Technologies";

            let techs = document.createElement("p");
            techs.classList.add("tech");
            techs.textContent = project.tech.join(", ");

            let projectLink;
            if (project.link) {
                projectLink = document.createElement("a");
                projectLink.href = project.link;
                projectLink.textContent = "Visit Project";
                projectLink.classList.add("project-link");
                projectLink.setAttribute("target", "_blank");
            }

            details.append(title, description, techTitle, techs);
            if (projectLink) details.append(projectLink);
            info.append(imgDiv, details);
            popupContent.append(closeBtn, info);

            overlay.classList.add("active");

            closeBtn.onclick = () => {
                overlay.classList.remove("active");
            };
        };
    });

    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.classList.remove("active");
        }
    };
} else {
    console.error("Swiper wrapper not found!");
}

// Swiper
var swiper = new Swiper(".mySwiper", {
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    autoplay: {
        delay: 2500,
    }
});

function ToggleActive(element) {
    element.classList.toggle("active");
}

let linksNav = document.getElementById("myNavLinks");
var nav = document.getElementById("myTopnav");

function toggleNav() {
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
        linksNav.classList.remove('d-flex', 'open-animation', 'close-animation');
    }
});

const scriptURL = "https://script.google.com/macros/s/AKfycbwnpe3ttaF4KsTZlswcTtQl5fBulKmqFUb2AfZTHoYlWJeq3oVG70uMHg5s5ZgyUhib/exec";

let form = document.querySelector(".contact-form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const toast = document.getElementById("Toast");
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
    fetch(scriptURL, {
        method: "POST",
        body: new FormData(form),
    })
        .then((response) => {
            setTimeout(() => {
                window.location.reload();
            }, 1);
        })
        .catch((error) => console.error("Error!", error.message));
});

// M12 ###
var textWrapper = document.querySelector('.ml2');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
anime.timeline({ loop: true })
    .add({
        targets: '.ml2 .letter',
        scale: [4, 1],
        opacity: [0, 1],
        translateZ: 0,
        easing: "easeOutExpo",
        duration: 950,
        delay: (el, i) => 70 * i
    }).add({
        targets: '.ml2',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
    });

// M16 ###
var m16 = document.querySelector('.ml6 .letters');
m16.innerHTML = m16.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
anime.timeline({ loop: true })
    .add({
        targets: '.ml6 .letter',
        translateY: ["1.1em", 0],
        translateZ: 0,
        duration: 750,
        delay: (el, i) => 50 * i
    }).add({
        targets: '.ml6',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
    });

// M17 ###
var m17 = document.querySelector('.ml7 .letters');
m17.innerHTML = m17.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
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

let sections = document.querySelectorAll("section");
let navLink = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", function () {
    if (this.scrollY > 150) {
        nav.classList.add("slidedown");
    } else {
        nav.classList.remove("slidedown");
    }

    let currnt = "";
    sections.forEach(section => {
        let sectionTop = section.offsetTop;
        let sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop - sectionHeight / 2) {
            currnt = section.getAttribute("id");
        }
    });

    navLink.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + currnt) {
            link.classList.add("active");
        }
    });
});

let toggleDarkMode = document.querySelector(".dark-mode");
let logo = document.getElementById("logo");
let arrow = document.querySelector(".arrow");

toggleDarkMode.addEventListener("click", function () {
    this.classList.toggle("active");
    document.body.classList.toggle("dark");
    DarkMode();
});

function DarkMode() {
    if (document.body.classList.contains("dark")) {
        logo.srcset = "imgs/ak-logo-white.webp";
        arrow.srcset = "imgs/arrow-inverted.webp";
        localStorage.setItem("theme", "dark");
    } else {
        logo.srcset = "imgs/ak-logo-black.webp";
        arrow.srcset = "imgs/arrow.webp";
        localStorage.setItem("theme", "light");
    }
}

window.addEventListener("DOMContentLoaded", function () {
    if (this.scrollY > 150) {
        nav.classList.add("slidedown");
    } else {
        nav.classList.remove("slidedown");
    }
    if (this.localStorage.getItem("theme")) {
        let theme = this.localStorage.getItem("theme");
        if (theme == "dark") {
            document.body.classList.toggle("dark");
            DarkMode();
        }
    }
});