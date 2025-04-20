function initCarousel() {
  
  const carousel = document.querySelector('.carousel__inner');

  const arrowRight = document.querySelector('.carousel__arrow_right');
  
  const arrowLeft = document.querySelector('.carousel__arrow_left');
  
  const slideWidth = carousel.offsetWidth; 
  let currentSlide = 0; 
  
  
  arrowLeft.style.display = 'none';
  
  arrowRight.addEventListener('click', () => {
    currentSlide++;
    
    carousel.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    
    
    if (currentSlide === 3) { 
      arrowRight.style.display = 'none';
    }
    arrowLeft.style.display = ''; 
  });

  arrowLeft.addEventListener('click', () => {
    currentSlide--;
    
    carousel.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    
    
    if (currentSlide === 0) { 
      arrowLeft.style.display = 'none';
    }
    arrowRight.style.display = ''; 
  });
}