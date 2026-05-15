document.addEventListener('DOMContentLoaded', () => {
    console.log("Welcome to World Charity Day!");

    const balloon = document.getElementById('heart-balloon');

    // Interaction: Clicking the balloon releases tiny floating hearts
    if (balloon) {
        balloon.addEventListener('click', (e) => {
            // Add a little bounce effect to the balloon
            balloon.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            balloon.style.transform = 'translateY(-10px) scale(1.05)';
            
            setTimeout(() => {
                balloon.style.transition = ''; // Let CSS animation take back control
                balloon.style.transform = '';
            }, 300);

            // Create floating hearts
            for(let i = 0; i < 5; i++) {
                createFloatingHeart(e.clientX, e.clientY);
            }
        });
    }

    function createFloatingHeart(x, y) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.className = 'floating-heart';
        
        // Randomize starting position slightly around the click
        const offsetX = (Math.random() - 0.5) * 60;
        const offsetY = (Math.random() - 0.5) * 40;
        
        heart.style.left = `${x + offsetX}px`;
        heart.style.top = `${y + offsetY}px`;
        
        // Randomize size
        const size = 16 + Math.random() * 16;
        heart.style.fontSize = `${size}px`;
        
        document.body.appendChild(heart);
        
        // Remove element after animation completes (2s)
        setTimeout(() => {
            heart.remove();
        }, 2000);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
