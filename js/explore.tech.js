



document.addEventListener('DOMContentLoaded', function() {
  // Tab functionality
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Hide all tab contents
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Show corresponding tab content
      const targetId = tab.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active');
      
      // Animate cards
      animateCards(targetId);
    });
  });
  
  // Search functionality
  const searchInput = document.getElementById('searchInput');
  
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
      const title = card.querySelector('.title').textContent.toLowerCase();
      const description = card.querySelector('.description').textContent.toLowerCase();
      const price = card.querySelector('.price').textContent.toLowerCase();
      
      if (title.includes(query) || description.includes(query) || price.includes(query)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
  
  // Card hover animations
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'scale(1.05)';
      card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'scale(1)';
      card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    });
  });
  
  // Function to animate cards with staggered effect
  function animateCards(tabId) {
    const cards = document.querySelectorAll(`#${tabId} .card`);
    
    cards.forEach((card, index) => {
      // Reset state
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      // Animate with delay
      setTimeout(() => {
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 50 * index);
    });
  }
  
  // Initialize first tab with animation
  animateCards('warmup-coding');
});