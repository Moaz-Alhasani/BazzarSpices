/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close');

/* Menu show */
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

/* Menu hidden */
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLinks = document.querySelectorAll('.nav__link');

const linkAction = () => {
    const navMenu = document.getElementById('nav-menu');
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu');
}

navLinks.forEach(link => link.addEventListener('click', linkAction));

/*=============== CHANGE BACKGROUND HEADER ===============*/
const bgHeader = () => {
    const header = document.getElementById('header');
    // Add class when scrolled beyond 50px, remove otherwise
    window.scrollY >= 50 ? header.classList.add('bg-header') : header.classList.remove('bg-header');
};

window.addEventListener('scroll', bgHeader);
// Initialize on page load
bgHeader();

/*=============== SWIPER SERVICES ===============*/
const swiperServices = new Swiper('.services__swiper', {
    loop: false,
    grabCursor: true,
    spaceBetween: 24,
    slidesPerView: 1.5,
    navigation: {
        nextEl: '.services__container .swiper-button-next',
        prevEl: '.services__container .swiper-button-prev',
    },
});



/*=============== SHOW SCROLL UP ===============*/
const scrollUp = () => {
    const scrollUp = document.getElementById('scroll-up')
    // When the scroll is higher than 350 viewport height, add the
    this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
        : scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp);
/*
-When the page loads, the user might already be scrolled down. Without calling scrollUp() immediately, the button won't appear until the user starts scrolling.
-Ensures the button's visibility matches the scroll position right from page load, rather than waiting for the first scroll event.
-If you refresh the page while scrolled down, the "scroll to top" button will appear immediately instead of disappearing until you move the scroll position.
*/
scrollUp();
/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/

const sections = document.querySelectorAll('section[id]');

const scrollActive = () => {
    const scrollY = window.scrollY;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 58;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav__menu a[href*="${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink.classList.add('active-link');
        } else {
            navLink.classList.remove('active-link');
        }
    });
};
// Run once on page load
scrollActive();

// Run on scroll
window.addEventListener('scroll', scrollActive);
/*=============== SCROLL REVEAL ANIMATION ===============*/

const sr = ScrollReveal({
    origin: 'top',
    distance: '100px',
    duration: 2500,
    delay: 100,
    // reset: true, // Animations repeat
});

sr.reveal('.home__content, .services__data, .services__swiper, .footer__container');
sr.reveal('.home__images', { origin: 'bottom', delay: 500 });
sr.reveal('.about__images, .contact__img', { origin: 'left' });
sr.reveal('.about__data, .contact__data, .contact__card', { origin: 'right' });
sr.reveal('.products__card', { interval: 100 });



// pop up 

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('productsContainer');

    try {
        const res = await fetch('http://localhost:3000/api/v1/admin/getAllProduct');
        if (!res.ok) throw new Error('Failed to fetch products');

        const response = await res.json();
        const categories = response.data;

        // العنوان العام
        const headerData = document.createElement('div');
        headerData.className = 'products__data';
        headerData.innerHTML = `
            <div>
                <span class="section__subtitle">OUR Products</span>
            </div>
        `;
        container.appendChild(headerData);

        categories.forEach(category => {
            if (!category.products || category.products.length === 0) return;

            // عنوان الفئة
            const categoryTitle = document.createElement('h2');
            categoryTitle.className = 'section__title';
            categoryTitle.style.color = 'var(--second-color)';
            categoryTitle.textContent = category.name;
            container.appendChild(categoryTitle);

            // حاوية المنتجات
            const productsSwiper = document.createElement('div');
            productsSwiper.className = 'products__swiper';

            category.products.forEach(product => {
                const fileName = product.imageUrl.split(/[/\\]/).pop();
                const imagePath = `/upload/${fileName}`;

                const card = document.createElement('article');
                card.className = 'products__card';

                card.innerHTML = `
                    <div>
                        <img src="${imagePath}" alt="${product.name}" class="products__img">
                    </div>
                    <div class="products__data">
                        <button class="products__show-details" data-id="${product.id}">Show Details</button>
                    </div>
                `;

                productsSwiper.appendChild(card);
            });

            container.appendChild(productsSwiper);
        });

    } catch (error) {
        console.error('Error loading products:', error);
        container.innerHTML += `<p class="error-message">Failed to load products. Please try again later.</p>`;
    }
});




document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('products__show-details')) {
        const productId = event.target.dataset.id;

        try {
            const res = await fetch(`http://localhost:3000/api/v1/admin/product/${productId}`);
            if (!res.ok) throw new Error('Failed to fetch product details');

            const product = (await res.json()).data;

            // تحديث نافذة التفاصيل
            document.getElementById('popupProjectName').textContent = product.name;
            document.querySelector('.project-description p').textContent = product.description || '';

            const galleryPhotos = document.querySelectorAll('.gallery-photo');

            // الصورة الرئيسية
            const mainFile = product.imageUrl.split(/[/\\]/).pop();
            galleryPhotos[0].src = `/upload/${mainFile}`;

            // الصور الفرعية
            for (let i = 0; i < 2; i++) {
                if (product.subImageUrls && product.subImageUrls[i]) {
                    const subFile = product.subImageUrls[i].split(/[/\\]/).pop();
                    galleryPhotos[i + 1].src = `/upload/${subFile}`;
                } else {
                    galleryPhotos[i + 1].src = '';
                }
            }

            document.getElementById('projectDetailsPopup').style.display = 'flex';

        } catch (error) {
            console.error('Error fetching product details:', error);
            alert('Failed to load product details');
        }
    }
});