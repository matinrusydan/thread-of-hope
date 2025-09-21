document.addEventListener('DOMContentLoaded', () => {
    // Daftar kata-kata mutiara
    const quotes = [
        "Setiap langkah kecil dalam perjalanan pemulihanmu adalah kemenangan besar. Teruslah berjuang, kamu lebih kuat dari yang kamu kira.",
        "Tidak apa-apa untuk tidak baik-baik saja. Izinkan dirimu merasakan, lalu bangkit kembali saat kamu siap.",
        "Badaimu mungkin terasa berat, tapi ingatlah, pelangi terindah muncul setelah hujan terlebat. Kamu akan melewatinya.",
        "Kamu adalah penulis dari ceritamu sendiri. Jangan biarkan bab yang sulit menghentikanmu menulis akhir yang bahagia.",
        "Beranilah meminta bantuan. Itu bukan tanda kelemahan, melainkan bukti kekuatan dan keberanian untuk pulih."
    ];

    // Memasukkan quotes ke dalam HTML
    const slider = document.querySelector('.quote-slider');
    quotes.forEach(quote => {
        const card = document.createElement('div');
        card.className = 'quote-card';
        card.innerHTML = `<p>"${quote}"</p>`;
        slider.appendChild(card);
    });

    const quoteFab = document.getElementById('quote-fab');
    const quoteModal = document.getElementById('quote-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const quoteCards = document.querySelectorAll('.quote-card');
    const prevBtn = document.getElementById('prev-quote-btn');
    const nextBtn = document.getElementById('next-quote-btn');

    let currentIndex = 0;

    function showQuote(index) {
        slider.style.transform = `translateX(-${index * 100}%)`;
    }

    // Event Listeners
    quoteFab.addEventListener('click', () => {
        quoteModal.classList.add('visible');
    });

    closeModalBtn.addEventListener('click', () => {
        quoteModal.classList.remove('visible');
    });

    quoteModal.addEventListener('click', (e) => {
        // Menutup modal jika klik di area overlay (latar belakang)
        if (e.target === quoteModal) {
            quoteModal.classList.remove('visible');
        }
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : quoteCards.length - 1;
        showQuote(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex < quoteCards.length - 1) ? currentIndex + 1 : 0;
        showQuote(currentIndex);
    });
});
