const navBtns = document.querySelectorAll('.nav-btn');
  const indicator = document.querySelector('.indicator');
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // pas load halaman -> langsung posisikan indicator (tanpa animasi)
  navBtns.forEach((btn, index) => {
    if (btn.getAttribute("href") === currentPage) {
      indicator.style.transition = "none"; // matiin animasi dulu
      indicator.style.transform = `translateX(${index * 152}px)`;
      // 132px width + 20px gap = 152px
      setTimeout(() => {
        indicator.style.transition = "transform 0.4s ease"; // aktifin lagi
      }, 50);
    }

    // saat klik tombol -> animasi geser, lalu pindah page
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = btn.getAttribute("href");
      indicator.style.transform = `translateX(${index * 152}px)`;
      setTimeout(() => {
        window.location.href = target;
      }, 400); // sama dengan durasi animasi
    });
  });


document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const navbar = document.querySelector('.navbar');

  if (hamburgerBtn && mobileNav && navbar) {
    hamburgerBtn.addEventListener('click', () => {
      // Toggle kelas 'active' untuk mengubah ikon dan menampilkan menu
      navbar.classList.toggle('nav-active');
    });
  }
});
