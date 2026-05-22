document.addEventListener('DOMContentLoaded', () => {
    console.log("Welcome to World Charity Day!");

    const balloon = document.getElementById('heart-balloon');

    // Modal & Donate elements
    const donateModal = document.getElementById('donate-modal');
    const openDonateBtn = document.getElementById('open-donate');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.getElementById('modal-overlay');
    const donateForm = document.getElementById('donate-form');
    const donateThanks = document.getElementById('donate-thanks');

    // Share buttons
    const shareFb = document.getElementById('share-facebook');
    const shareTw = document.getElementById('share-twitter');
    const shareLine = document.getElementById('share-line');
    const copyLink = document.getElementById('copy-link');

    // Footer share buttons
    const shareFooterFb = document.getElementById('share-footer-facebook');
    const shareFooterTw = document.getElementById('share-footer-twitter');
    const shareFooterLine = document.getElementById('share-footer-line');
    const shareFooterCopy = document.getElementById('share-footer-copy');

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

    // --- Modal behavior (a11y friendly) ---
    function openModal() {
        if (!donateModal) return;
        donateModal.hidden = false;
        donateModal.classList.add('open');
        // set initial focus
        const firstField = donateModal.querySelector('input, textarea, button');
        if(firstField) firstField.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!donateModal) return;
        donateModal.hidden = true;
        donateModal.classList.remove('open');
        document.body.style.overflow = '';
        donateThanks.hidden = true;
        donateForm.hidden = false;
        openDonateBtn.focus();
    }

    if (openDonateBtn) openDonateBtn.addEventListener('click', openModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    if (document) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && donateModal && !donateModal.hidden) {
                closeModal();
            }
        });
    }

    // Donate form handling (simulate backend)
    if (donateForm) {
        donateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('donation-amount').value || 0);
            if (!amount || amount < 1) {
                alert('請輸入有效的捐款金額（至少 1 元）。');
                return;
            }

            const payload = {
                name: document.getElementById('donor-name').value || '匿名',
                amount,
                message: document.getElementById('donor-message').value || ''
            };

            // Try calling a local mock server endpoint; if not available, try localhost:3000, then fallback to simulated network
            fetch('/donate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(res => res.json()).then(result => {
                showThanks(result.message || '感謝您的捐款！');
            }).catch(() => {
                // try explicit localhost:3000 (mock-server.js default) for cross-origin mock
                fetch('http://localhost:3000/donate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }).then(r=>r.json()).then(result=>{
                    showThanks(result.message || '感謝您的捐款！');
                }).catch(()=>{
                    // final fallback simulated response
                    setTimeout(() => showThanks('感謝您的捐款（模擬回應）！'), 700);
                });
            });
        });
    }

    function showThanks(msg) {
        if (donateForm) donateForm.hidden = true;
        donateThanks.hidden = false;
        donateThanks.querySelector('p').textContent = msg || donateThanks.querySelector('p').textContent;
        // small celebration animation: create few hearts
        for (let i=0;i<8;i++) {
            const h = document.createElement('div');
            h.className = 'floating-heart';
            h.innerText = '💖';
            h.style.left = (50 + Math.random()*200) + 'px';
            h.style.top = (window.innerHeight/2 + Math.random()*100) + 'px';
            h.style.fontSize = (12 + Math.random()*20) + 'px';
            document.body.appendChild(h);
            setTimeout(()=>h.remove(),2000);
        }
        // auto-close after a short delay
        setTimeout(closeModal, 2200);
    }

    // --- Sharing helpers ---
    function shareTo(provider) {
        const url = encodeURIComponent(location.href);
        const text = encodeURIComponent(document.title + ' — 一起響應世界公益日');
        let shareUrl = '';
        if (provider === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        if (provider === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        if (provider === 'line') shareUrl = `https://social-plugins.line.me/lineit/share?url=${url}`;
        if (shareUrl) window.open(shareUrl, '_blank', 'noopener');
    }

    function copyCurrentLink() {
        navigator.clipboard?.writeText(location.href).then(()=>{
            alert('連結已複製');
        }).catch(()=>{
            // fallback
            const tmp = document.createElement('input');
            tmp.value = location.href;
            document.body.appendChild(tmp);
            tmp.select();
            document.execCommand('copy');
            tmp.remove();
            alert('連結已複製');
        });
    }

    if (shareFb) shareFb.addEventListener('click', ()=>shareTo('facebook'));
    if (shareTw) shareTw.addEventListener('click', ()=>shareTo('twitter'));
    if (shareLine) shareLine.addEventListener('click', ()=>shareTo('line'));
    if (copyLink) copyLink.addEventListener('click', copyCurrentLink);

    if (shareFooterFb) shareFooterFb.addEventListener('click', ()=>shareTo('facebook'));
    if (shareFooterTw) shareFooterTw.addEventListener('click', ()=>shareTo('twitter'));
    if (shareFooterLine) shareFooterLine.addEventListener('click', ()=>shareTo('line'));
    if (shareFooterCopy) shareFooterCopy.addEventListener('click', copyCurrentLink);
});
