




document.addEventListener('DOMContentLoaded', function() {
    const sliderWrapper = document.getElementById('sliderWrapper');
    const sliderContainer = document.querySelector('.slider-container');
    const cards = document.querySelectorAll('.slider-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.getElementById('indicators');
    
    let cardWidth = 0;
    let cardMargin = 0;
    let cardGap = 0;
    let currentIndex = 0;
    let maxIndex = 0;
    let scrollPosition = 0;
    let autoSlideInterval;
    let isTouching = false;
    let lastWheelTime = 0;
    let wheelDelta = 0;
    
    // Calculate card width and other dimensions
    function updateSliderDimensions() {
        // Get the first card
        if (!cards.length) return;
        
        const firstCard = cards[0];
        const cardStyle = window.getComputedStyle(firstCard);
        
        // Calculate the full width including margins and padding
        const marginLeft = parseFloat(cardStyle.marginLeft) || 0;
        const marginRight = parseFloat(cardStyle.marginRight) || 0;
        const paddingLeft = parseFloat(cardStyle.paddingLeft) || 0;
        const paddingRight = parseFloat(cardStyle.paddingRight) || 0;
        
        // Set the cardWidth to the actual width of the card including padding
        cardWidth = firstCard.offsetWidth;
        cardMargin = marginLeft + marginRight;
        cardGap = cardMargin;
        
        // Determine visible cards based on viewport width
        let visibleCards = 1;
        if (window.innerWidth >= 1024) {
            visibleCards = 3;
        } else if (window.innerWidth >= 768) {
            visibleCards = 2;
        }
        
        // Adjust max index based on visible cards
        maxIndex = Math.max(0, cards.length - visibleCards);
        
        // Ensure current index is still valid after resize
        currentIndex = Math.min(currentIndex, maxIndex);
        
        // Update slider position
        updateSliderPosition(false);
        
        // Recreate indicators based on new maxIndex
        createIndicators();
    }
    
    // Create indicators based on maxIndex
    function createIndicators() {
        indicators.innerHTML = '';
        for (let i = 0; i <= maxIndex; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === currentIndex) {
                indicator.classList.add('active');
            }
            indicator.addEventListener('click', () => {
                currentIndex = i;
                updateSliderPosition();
                updateIndicators();
                resetAutoSlide();
            });
            indicators.appendChild(indicator);
        }
    }
    
    // Update indicators based on current index
    function updateIndicators() {
        const indicatorDots = document.querySelectorAll('.indicator');
        indicatorDots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Update slider position
    function updateSliderPosition(animate = true) {
        if (!sliderWrapper) return;
        
        if (animate) {
            sliderWrapper.style.transition = 'transform 0.3s ease-out';
        } else {
            sliderWrapper.style.transition = 'none';
        }
        
        // Calculate position based on current index, card width and gap
        scrollPosition = -currentIndex * (cardWidth + cardGap/2);
        
        // Apply transform with translateX
        sliderWrapper.style.transform = `translateX(${scrollPosition}px)`;
    }
    
    // Start auto sliding functionality
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            if (!isTouching) {
                if (currentIndex < maxIndex) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateSliderPosition();
                updateIndicators();
            }
        }, 5000);
    }
    
    // Stop auto sliding
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Reset auto slide (stop and restart)
    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }
    
    // Initialize slider
    function initSlider() {
        // Ensure elements exist
        if (!sliderWrapper || !cards.length) {
            console.error('Slider elements not found');
            return;
        }
        
        // Set initial dimensions
        updateSliderDimensions();
        
        // Create indicators
        createIndicators();
        
        // Start auto sliding
        startAutoSlide();
        
        // Event listeners for navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSliderPosition();
                    updateIndicators();
                    resetAutoSlide();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateSliderPosition();
                    updateIndicators();
                    resetAutoSlide();
                }
            });
        }
        
        // Variables for drag/touch functionality
        let isDragging = false;
        let startX, startScrollPosition;
        let lastTouchTime = 0;
        let touchMoved = false;
        
        // Touch start / Mouse down
        function handleDragStart(e) {
            isDragging = true;
            isTouching = true;
            touchMoved = false;
            lastTouchTime = new Date().getTime();
            
            // Get start position
            startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            startScrollPosition = scrollPosition;
            
            // Disable transition for responsive dragging
            sliderWrapper.style.transition = 'none';
            
            // Stop auto sliding during interaction
            stopAutoSlide();
            
            // Don't prevent default here to allow other touch interactions
        }
        
        // Touch move / Mouse move
        function handleDragMove(e) {
            if (!isDragging) return;
            
            // Get current position
            const x = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            const diffX = x - startX;
            
            // Only handle horizontal movement if significant
            if (Math.abs(diffX) > 5) {
                touchMoved = true;
                // Calculate new position with resistance at edges
                let newPosition = startScrollPosition + diffX;
                
                // Add resistance at edges
                const minScroll = -maxIndex * (cardWidth + cardGap/2);
                if (newPosition > 0) {
                    newPosition = newPosition / 3; // Resistance at start
                } else if (newPosition < minScroll) {
                    const overScroll = newPosition - minScroll;
                    newPosition = minScroll + (overScroll / 3); // Resistance at end
                }
                
                // Apply new position
                scrollPosition = newPosition;
                sliderWrapper.style.transform = `translateX(${scrollPosition}px)`;
                
                // Prevent default to avoid page scrolling while dragging horizontally
                if (Math.abs(diffX) > 10) {
                    e.preventDefault();
                }
            }
        }
        
        // Touch end / Mouse up
        function handleDragEnd(e) {
            if (!isDragging) return;
            isDragging = false;
            
            // Re-enable transitions
            sliderWrapper.style.transition = 'transform 0.3s ease-out';
            
            // Only process if touch actually moved
            if (touchMoved) {
                // Calculate drag distance
                const diff = scrollPosition - startScrollPosition;
                
                // Determine if we should change slides based on drag distance
                if (Math.abs(diff) > cardWidth / 4) {
                    if (diff > 0) {
                        // Dragged right
                        currentIndex = Math.max(0, currentIndex - 1);
                    } else {
                        // Dragged left
                        currentIndex = Math.min(maxIndex, currentIndex + 1);
                    }
                }
            }
            
            // Snap to nearest slide
            updateSliderPosition();
            updateIndicators();
            
            // Set flag for touch ended
            setTimeout(() => {
                isTouching = false;
                startAutoSlide();
            }, 100);
        }
        
        // Add event listeners for touch/mouse events
        sliderWrapper.addEventListener('mousedown', handleDragStart);
        sliderWrapper.addEventListener('touchstart', handleDragStart, { passive: true });
        
        // Use passive: false for touchmove to allow preventDefault
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('touchmove', handleDragMove, { passive: false });
        
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchend', handleDragEnd);
        
        // Make sure dragging ends if mouse leaves the window
        document.addEventListener('mouseleave', handleDragEnd);
        
        // Handle keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSliderPosition();
                    updateIndicators();
                    resetAutoSlide();
                }
            } else if (e.key === 'ArrowRight') {
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateSliderPosition();
                    updateIndicators();
                    resetAutoSlide();
                }
            }
        });
        
    // Handle horizontal trackpad scrolling or trackpad pinch-zoom horizontal movement
    sliderContainer.addEventListener('wheel', function(e) {
        // If we detect horizontal scrolling (deltaX) or shift+wheel (which is often horizontal scrolling)
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
            e.preventDefault(); // Prevent page scrolling

            // Accumulate wheel delta for smoother scrolling
            wheelDelta += e.deltaX;
            
            // Throttle wheel events to avoid too rapid changes
            const now = new Date().getTime();
            if (now - lastWheelTime > 50) { // 50ms throttle
                lastWheelTime = now;
                
                // If significant horizontal scroll detected
                if (Math.abs(wheelDelta) > 50) {
                    if (wheelDelta > 0) {
                        // Scrolled right (positive deltaX)
                        if (currentIndex < maxIndex) {
                            currentIndex++;
                            updateSliderPosition();
                            updateIndicators();
                            resetAutoSlide();
                        }
                    } else {
                        // Scrolled left (negative deltaX)
                        if (currentIndex > 0) {
                            currentIndex--;
                            updateSliderPosition();
                            updateIndicators();
                            resetAutoSlide();
                        }
                    }
                    wheelDelta = 0; // Reset accumulated delta
                }
            }
        }
    }, { passive: false });
        
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            // Debounce resize event to prevent multiple recalculations
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                updateSliderDimensions();
            }, 250);
        });
        
        // Handle orientation change
        window.addEventListener('orientationchange', function() {
            // Recalculate dimensions after orientation change
            setTimeout(updateSliderDimensions, 500);
        });
    }
    
    // Initialize the slider
    initSlider();
});