const carousels = {};

function showSlide(carouselId, index) {
    const carousel = carousels[carouselId];
    const images = carousel.querySelectorAll('.carousel-image');
    const totalImages = images.length;
    if (index >= totalImages) {
        carousel.currentIndex = 0;
    } else if (index < 0) {
        carousel.currentIndex = totalImages - 1;
    } else {
        carousel.currentIndex = index;
    }
    const offset = -carousel.currentIndex * 100;
    const carouselImages = carousel.querySelector('.carousel-images');
    carouselImages.style.transform = `translateX(${offset}%)`;
}

function nextSlide(carouselId) {
    const carousel = carousels[carouselId];
    showSlide(carouselId, carousel.currentIndex + 1);
}

function prevSlide(carouselId) {
    const carousel = carousels[carouselId];
    showSlide(carouselId, carousel.currentIndex - 1);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.carousel').forEach(carousel => {
        const carouselId = carousel.id;
        carousels[carouselId] = carousel;
        carousels[carouselId].currentIndex = 0;
        showSlide(carouselId, 0);
    });
});
