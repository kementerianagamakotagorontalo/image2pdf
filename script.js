let img = new Image();
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let zoomLevel = 1;
let imgX = 0;
let imgY = 0;
let imgWidth = 0;
let imgHeight = 0;

document.getElementById('image-upload').addEventListener('change', function(event) {
    let file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

img.onload = function() {
    imgWidth = img.width;
    imgHeight = img.height;
    const maxPreviewWidth = 600; // Lebar maksimal untuk preview
    const maxPreviewHeight = 400; // Tinggi maksimal untuk preview
    const scaleFactor = Math.min(maxPreviewWidth / imgWidth, maxPreviewHeight / imgHeight);

    canvas.width = imgWidth * scaleFactor;
    canvas.height = imgHeight * scaleFactor;

    drawImage();
};

function drawImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, imgX, imgY, imgWidth * zoomLevel, imgHeight * zoomLevel, 0, 0, canvas.width, canvas.height);
}

document.getElementById('zoom-in').addEventListener('click', function() {
    zoomLevel += 0.1;
    drawImage();
});

document.getElementById('zoom-out').addEventListener('click', function() {
    zoomLevel = Math.max(0.1, zoomLevel - 0.1);
    drawImage();
});

document.getElementById('save-pdf').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    let pdf = new jsPDF();

    const orientation = document.getElementById('orientation').value;

    let imgWidthInPDF = imgWidth * zoomLevel * 0.264583;  // Menghitung ukuran dalam mm (1px = 0.264583mm)
    let imgHeightInPDF = imgHeight * zoomLevel * 0.264583;

    // Menyesuaikan orientasi PDF sesuai pilihan pengguna
    if (orientation === 'landscape') {
        pdf = new jsPDF('l', 'mm', [imgWidthInPDF, imgHeightInPDF]);
    } else {
        pdf = new jsPDF('p', 'mm', [imgWidthInPDF, imgHeightInPDF]);
    }

    // Menambahkan gambar ke PDF
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidthInPDF, imgHeightInPDF);

    // Menyimpan PDF dengan nama file yang diinginkan
    pdf.save('converted-image.pdf');
});

// Tombol New Convert untuk menghapus gambar dan mengatur ulang UI
document.getElementById('new-convert').addEventListener('click', function() {
    document.getElementById('image-upload').value = ''; // Menghapus input file
    canvas.width = 0;
    canvas.height = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    zoomLevel = 1;
});
