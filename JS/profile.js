const swiperWrapper = document.querySelector('.swiper-wrapper');
const slides = document.querySelectorAll('.swiper-slide');
const slideWidth = slides[0].clientWidth;
let currentIndex = 0;

function goToSlide(index){
    if(index >= slides.length || index < 0)
    {
        index = 0;
    }

    console.log(slides.length )
    
    currentIndex = index;
    const offset = -slideWidth * currentIndex;
    console.log(offset)
    swiperWrapper.style.setProperty('transform', `translateX(${offset}px)`);
}

function nextSlide(){
    goToSlide(currentIndex + 1);console.log(currentIndex)
}

function prevSlide(){
    goToSlide(currentIndex - 1);
}

setInterval(nextSlide, 3000);