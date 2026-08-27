/*
  NAUTERA - Our Harvest Page Interactions
  - Education Size Selector System (Dynamic Image Slots)
  - Product Variant View Switcher (Multi-Angle Dynamic Image Slots)
*/

document.addEventListener('DOMContentLoaded', () => {
  initSizeSelector();
  initVariantSwitcher();
});

/* Helper to check image load status for dynamic slots */
function checkSlotImage(slot, img) {
  if (!slot || !img) return;
  const markLoaded = () => {
    slot.classList.remove('img-error');
    slot.classList.add('loaded');
  };
  const markError = () => {
    slot.classList.remove('loaded');
    slot.classList.add('img-error');
  };

  if (img.complete) {
    img.naturalWidth > 0 ? markLoaded() : markError();
  } else {
    img.onload = markLoaded;
    img.onerror = markError;
  }
}

/* Education Size Selector Data */
const sizeData = {
  "10-20": {
    title: "Size 10-20",
    weight: "50 - 100 g/pc",
    count: "10 - 20 pcs/kg",
    category: "Ekstra Rendah (Premium)",
    recommendation: "Sangat cocok untuk hidangan mewah restoran bintang lima, panggangan besar (barbeque), dan ekspor premium.",
    imgFile: "10-20.png",
    altFiles: ["10-20.png", "size-10-20.png", "size-10-20.webp", "size-10-20.jpg"],
    note: "Data resmi bersumber dari audit operasional Nautera Farm."
  },
  "20-30": {
    title: "Size 20-30",
    weight: "33 - 50 g/pc",
    count: "20 - 30 pcs/kg",
    category: "Rendah (Super Premium)",
    recommendation: "Sangat baik untuk hidangan panggangan besar, sate udang mewah, dan menu premium restoran.",
    imgFile: "20-30.png",
    altFiles: ["20-30.png", "size-20-30.png", "size-20-30.webp", "size-20-30.jpg"],
    note: "*Estimasi edukasi sementara. Data resmi akan diperbarui."
  },
  "30-40": {
    title: "Size 30-40",
    weight: "25 - 33 g/pc",
    count: "30 - 40 pcs/kg",
    category: "Sedang-Rendah (Large)",
    recommendation: "Cocok untuk tempura, udang bakar madu, dan olahan restoran seafood.",
    imgFile: "30-40.png",
    altFiles: ["30-40.png", "size-30-40.png", "size-30-40.webp", "size-30-40.jpg"],
    note: "*Estimasi edukasi sementara. Data resmi akan diperbarui."
  },
  "40-50": {
    title: "Size 40-50",
    weight: "20 - 25 g/pc",
    count: "40 - 50 pcs/kg",
    category: "Sedang (Medium Large)",
    recommendation: "Cocok untuk garlic butter shrimp, asam manis, dan masakan katering berkualitas.",
    imgFile: "40-50.png",
    altFiles: ["40-50.png", "size-40-50.png", "size-40-50.webp", "size-40-50.jpg"],
    note: "*Estimasi edukasi sementara. Data resmi akan diperbarui."
  },
  "50-60": {
    title: "Size 50-60",
    weight: "16 - 20 g/pc",
    count: "50 - 60 pcs/kg",
    category: "Sedang (Medium)",
    recommendation: "Sangat pas untuk tumisan, nasi goreng seafood, dan masakan rumahan premium.",
    imgFile: "50-60.png",
    altFiles: ["50-60.png", "size-50-60.png", "size-50-60.webp", "size-50-60.jpg"],
    note: "*Estimasi edukasi sementara. Data resmi akan diperbarui."
  },
  "60-70": {
    title: "Size 60-70",
    weight: "14 - 16 g/pc",
    count: "60 - 70 pcs/kg",
    category: "Sedang-Tinggi (Medium Small)",
    recommendation: "Ideal untuk isi dimsum, pangsit udang, dan katering massal.",
    imgFile: "60-70.png",
    altFiles: ["60-70.png", "size-60-70.png", "size-60-70.webp", "size-60-70.jpg"],
    note: "*Estimasi edukasi sementara. Data resmi akan diperbarui."
  },
  "70-80": {
    title: "Size 70-80",
    weight: "12 - 14 g/pc",
    count: "70 - 80 pcs/kg",
    category: "Tinggi (Small)",
    recommendation: "Biasa digunakan untuk campuran mie goreng, bakso udang, dan sambal goreng udang.",
    imgFile: "70-80.png",
    altFiles: ["70-80.png", "size-70-80.png", "size-70-80.webp", "size-70-80.jpg"],
    note: "*Estimasi edukasi sementara. Data resmi akan diperbarui."
  },
  "80-90": {
    title: "Size 80-90",
    weight: "11 - 12 g/pc",
    count: "80 - 90 pcs/kg",
    category: "Sangat Tinggi (Extra Small)",
    recommendation: "Pas untuk rempeyek udang, pelengkap masakan, dan abon udang.",
    imgFile: "80-90.png",
    altFiles: ["80-90.png", "size-80-90.png", "size-80-90.webp", "size-80-90.jpg"],
    note: "*Estimasi edukasi sementara. Data resmi akan diperbarui."
  },
  "90-100": {
    title: "Size 90-100",
    weight: "10 - 11 g/pc",
    count: "90 - 100 pcs/kg",
    category: "Sangat Tinggi (Tiny)",
    recommendation: "Sangat cocok untuk bahan dasar kerupuk udang, siomay, dan sambal terasi udang.",
    imgFile: "90-100.png",
    altFiles: ["90-100.png", "size-90-100.png", "size-90-100.webp", "size-90-100.jpg"],
    note: "*Estimasi edukasi sementara. Data resmi akan diperbarui."
  }
};

function initSizeSelector() {
  const tiles = document.querySelectorAll('.calendar-tile, .size-btn, .size-menu-btn');
  const selectDropdown = document.getElementById('size-select-option');
  const title = document.getElementById('detail-size-title');
  const category = document.getElementById('detail-size-category');
  const weight = document.getElementById('detail-size-weight');
  const count = document.getElementById('detail-size-count');
  const recommendation = document.getElementById('detail-size-recommendation');
  const slot = document.getElementById('detail-size-slot');
  const img = document.getElementById('detail-size-img');
  const imgName = document.getElementById('detail-size-img-name');
  const note = document.getElementById('detail-size-note');

  if (!tiles.length && !selectDropdown) return;

  // Initialize initial image state
  if (slot && img) {
    checkSlotImage(slot, img);
  }

  const updateSizeDisplay = (sizeKey) => {
    // Update active class on pills/tiles
    tiles.forEach(t => t.classList.remove('active'));
    document.querySelectorAll(`[data-size="${sizeKey}"]`).forEach(t => t.classList.add('active'));

    // Sync dropdown select if needed
    if (selectDropdown && selectDropdown.value !== sizeKey) {
      selectDropdown.value = sizeKey;
    }

    const data = sizeData[sizeKey];

    if (data && (title || weight || count || recommendation)) {
      const elementsToAnimate = [title, category, weight, count, recommendation, slot, note].filter(Boolean);
      elementsToAnimate.forEach(el => {
        el.style.opacity = '0.3';
        el.style.transform = 'translateY(6px) scale(0.98)';
        el.style.transition = 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
      });

      setTimeout(() => {
        if (title) title.textContent = data.title;
        if (category && data.category) category.textContent = data.category;
        if (weight) weight.textContent = data.weight;
        if (count) count.textContent = data.count;
        if (recommendation) recommendation.textContent = data.recommendation;
        if (note) note.textContent = data.note;

        if (img && slot) {
          slot.classList.remove('loaded', 'img-error');
          const fileName = data.imgFile || `${sizeKey}.png`;
          img.src = `assets/images/${fileName}`;
          img.alt = data.title;
          if (imgName) imgName.textContent = fileName;
          checkSlotImage(slot, img);
        }

        elementsToAnimate.forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) scale(1)';
        });
      }, 160);
    }
  };

  tiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const sizeKey = tile.getAttribute('data-size');
      if (sizeKey) updateSizeDisplay(sizeKey);
    });
  });

  if (selectDropdown) {
    selectDropdown.addEventListener('change', (e) => {
      updateSizeDisplay(e.target.value);
    });
  }
}

/* Product Variant Cards Interaction */
function initVariantSwitcher() {
  const cards = document.querySelectorAll('.variant-card');
  if (!cards.length) return;

  // Initialize circular image slots in variant cards
  cards.forEach(card => {
    const slot = card.querySelector('.img-slot');
    const img = card.querySelector('.img-slot img');
    if (slot && img) {
      checkSlotImage(slot, img);
    }

    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
}
