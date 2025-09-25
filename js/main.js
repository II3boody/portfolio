var swiper = new Swiper(".mySwiper", {
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    autoplay: {
        delay: 2500,
    }
});

let linksNav = document.getElementById("myNavLinks")
var nav = document.getElementById("myTopnav");

function toggleNav() {
    if (linksNav.classList.contains("d-flex")) {
        linksNav.classList.toggle("close-animation")
        setTimeout(() => {
            linksNav.classList.toggle("close-animation")
            linksNav.classList.toggle("d-flex")
        }, 400)
    } else {
        linksNav.classList.toggle("open-animation")
        linksNav.classList.toggle("d-flex")
        setTimeout(() => linksNav.classList.toggle("open-animation"), 500)
    }
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 767) {
        linksNav.classList.remove('d-flex');
        linksNav.classList.remove('open-animation');
        linksNav.classList.remove('close-animation');
    }
});



const scriptURL = "https://script.google.com/macros/s/AKfycbwnpe3ttaF4KsTZlswcTtQl5fBulKmqFUb2AfZTHoYlWJeq3oVG70uMHg5s5ZgyUhib/exec"

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
                window.location.reload()
            }, 1)
        })
        .catch((error) => console.error("error!", error.message))
})

// M12 ###
// Wrap every letter in a span
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
    })

