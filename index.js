// Sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function toggleSidebar() {
      sidebar.classList.toggle('open');
      sidebarOverlay.classList.toggle('show');
      document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
    }

    function closeSidebar() {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('show');
      document.body.style.overflow = '';
    }

    sidebarToggle?.addEventListener('click', toggleSidebar);
    sidebarOverlay?.addEventListener('click', closeSidebar);

    // Close sidebar on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        closeSidebar();
      }
    });

    // Close sidebar when clicking close button
    const sidebarClose = document.getElementById('sidebarClose');
    if (sidebarClose) {
      sidebarClose.addEventListener('click', closeSidebar);
    }

    // Close sidebar when clicking any sidebar link (mobile)
    const sidebarLinks = document.querySelectorAll('#sidebar a');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeSidebar();
      });
    });

      // Close sidebar on escape key
      document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
              closeSidebar();
          }
      });

const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.trim().toLowerCase();
    removeHighlights();

    if (keyword === "") return;

    searchAndHighlight(keyword);
  });

  // (opsional) tekan ENTER langsung scroll
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const highlighted = document.querySelector(".highlighted");
      if (highlighted) {
        highlighted.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });
}
      
 fetch('stat/api/get_umkm.php')
  .then(response => response.json())
  .then(data => {
    const total = data.length;

      // simpan data UMKM
      const umkmDataGlobal = data;





function tampilkanUMKM(data, keyword = "") {
  const umkmList = document.getElementById("umkmList");
  const wrapper = document.getElementById("umkmWrapper");

  if (!umkmList || !wrapper) return;

  // Saat belum ada input pencarian → sembunyikan
  if (keyword.trim() === "") {
    wrapper.classList.add("hidden");
    umkmList.innerHTML = "";
    return;
  }

  // Tampilkan wrapper karena pencarian dilakukan
  wrapper.classList.remove("hidden");

  // Tidak ada hasil
  if (data.length === 0) {
    umkmList.innerHTML = `
      <li class="col-span-3 text-center text-gray-500 italic">Tidak ditemukan hasil.</li>
    `;
    return;
  }

  // Ada hasil
  umkmList.innerHTML = data.map(umkm => `
    <li class="bg-white border border-gray-200 rounded-lg p-4 shadow">
      <h4 class="text-lg font-bold text-[#7b603b]">${umkm.nama_usaha}</h4>
      <p class="text-sm text-gray-600">${umkm.alamat ?? '-'}</p>
      <p class="text-xs text-gray-500 italic">${umkm.kategori ?? ''}</p>
    </li>
  `).join('');
}






    const memiliki = data.filter(d => d.status_nib?.toLowerCase().trim() === "sudah memiliki").length;
    const belum = total - memiliki;

    const pelatihan_sudah = data.filter(d =>
  d.status_plt?.toString().trim().toLowerCase() === "pernah"
).length;

    const pelatihan_belum = total - pelatihan_sudah;

    // === PIE CHART UMKM UNGGULAN ===
    const pieLabels = ['Belum Memiliki SKU', 'Sudah Memiliki SKU'];
    const pieData = [belum, memiliki];
    const pieBackgroundColor = ['#D7C0A6', '#A67C52'];

    const ctxPie = document.getElementById('pieChart')?.getContext('2d');
    if (ctxPie) {
      new Chart(ctxPie, {
        type: 'pie',
        data: {
          labels: pieLabels,
          datasets: [{
            data: pieData,
            backgroundColor: pieBackgroundColor,
            borderColor: ['#ffffff', '#ffffff'],
            borderWidth: 0
          }]
        },
        options: pieOptions,
        plugins: [pieLabelsPlugin]
      });
    }

// === DOUGHNUT CHART PELATIHAN ===
const ctxDoughnut = document.getElementById('doughnutChart')?.getContext('2d');
if (ctxDoughnut) {
  new Chart(ctxDoughnut, {
    type: 'doughnut',
    data: {
      labels: ['Sudah Pelatihan', 'Belum Pelatihan'],
      datasets: [{
        data: [pelatihan_sudah, pelatihan_belum], // ✅ ini sudah dari database
        backgroundColor: ['#A67C52', '#D7C0A6'],
        borderWidth: 0
      }]
    },
    options: doughnutOptions,
    plugins: [doughnutLabelsPlugin]
    
  });
} 



  })
  .catch(error => {
    console.error('Gagal mengambil data:', error);
  });



        const pieOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 20,
                        font: {
                            size: 14,
                            weight: 600
                        },
                        color: '#4b3924'
                    }
                },
                tooltip: {
                callbacks: {
                    label: function (context) {
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const value = context.parsed;
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${context.label}: ${value} UMKM (${percentage}%)`;
                    }
                }
                }

            }
        };

        // Plugin untuk label di pie chart
        const pieLabelsPlugin = {
            id: 'labelOnPie',
            afterDatasetDraw(chart) {
                const { ctx } = chart;
                const dataset = chart.data.datasets[0];
                const meta = chart.getDatasetMeta(0);
                const total = dataset.data.reduce((a, b) => a + b, 0);
                
                ctx.save();
                ctx.font = 'bold 14px Arial';
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                ctx.shadowBlur = 2;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                
                meta.data.forEach((arc, i) => {
                    const angle = (arc.startAngle + arc.endAngle) / 2;
                    const r = (arc.outerRadius + arc.innerRadius) / 2;
                    const x = chart.width / 2 + r * Math.cos(angle);
                    const y = chart.height / 2 + r * Math.sin(angle);
                    const value = dataset.data[i];
                    const percent = Math.round((value / total) * 100);
                    
                    // Only show label if percentage is >= 3%
                    if (percent >= 3) {
                        ctx.fillText(`${value}`, x, y - 7);
                        ctx.fillText(`(${percent}%)`, x, y + 7);
                    }
                });
                ctx.restore();
            }
        };

        // === PIE CHART UMKM UNGGULAN END ===

        // === DOUGHNUT CHART PELATIHAN UMKM START ===

        const doughnutData = {
            labels: ['Sudah Pelatihan', 'Belum Pelatihan'],
            datasets: [{
                data: [158, 674], // 158 sudah pelatihan, 674 belum pelatihan
                backgroundColor: ['#A67C52', '#D7C0A6'],
                borderWidth: 0
            }]
        };

        const doughnutOptions = {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '50%',
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 20,
                        font: {
                            size: 14,
                            weight: 600
                        },
                        color: '#4b3924'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + ' UMKM';
                        }
                    }
                }
            }
        };

        // Plugin untuk label di donut chart
        const doughnutLabelsPlugin = {
            id: 'labelInsideSlice',
            afterDatasetDraw(chart) {
                const { ctx } = chart;
                const dataset = chart.data.datasets[0];
                const meta = chart.getDatasetMeta(0);
                const total = dataset.data.reduce((a, b) => a + b, 0);

                ctx.save();
                ctx.font = 'bold 14px Arial';
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                ctx.shadowBlur = 2;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;

                meta.data.forEach((arc, i) => {
                    const angle = (arc.startAngle + arc.endAngle) / 2;
                    const radius = arc.innerRadius + (arc.outerRadius - arc.innerRadius) * 0.5;
                    const x = chart.chartArea.left + (chart.chartArea.width / 2) + radius * Math.cos(angle);
                    const y = chart.chartArea.top + (chart.chartArea.height / 2) + radius * Math.sin(angle);

                    const value = dataset.data[i];
                    const percent = Math.round((value / total) * 100);

                    if (percent >= 3) {
                        ctx.fillText(`${value}`, x, y - 7);
                        ctx.fillText(`(${percent}%)`, x, y + 7);
                    }
                });

                ctx.restore();
            }
        };


    // Add click event listeners to navbar and sidebar to navigate to statistik.html
   const el = document.getElementById("some-id");
  if (el) {
    el.addEventListener("click", function() {
      // aksi
    });
  }

    document.getElementById('sidebar').addEventListener('click', function() {
      window.location.href = 'statistik.html';
    });


function searchAndHighlight(keyword) {
  const mainContent = document.body;
  const walker = document.createTreeWalker(mainContent, NodeFilter.SHOW_TEXT, null, false);
  let found = false;
  let firstMatch = null;

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.nodeValue;
    const index = text.toLowerCase().indexOf(keyword);

    if (index !== -1) {
      const span = document.createElement("span");
      span.className = "highlighted";
      span.textContent = text.substring(index, index + keyword.length);

      const before = document.createTextNode(text.substring(0, index));
      const after = document.createTextNode(text.substring(index + keyword.length));

      const parent = node.parentNode;
      parent.replaceChild(after, node);
      parent.insertBefore(span, after);
      parent.insertBefore(before, span);

      if (!firstMatch) firstMatch = span;
      found = true;
    }
  }

  if (firstMatch) {
    firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function removeHighlights() {
  const highlighted = document.querySelectorAll(".highlighted");
  highlighted.forEach(el => {
    const parent = el.parentNode;
    parent.replaceChild(document.createTextNode(el.textContent), el);
    parent.normalize();
  });
}
