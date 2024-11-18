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

    // Mengatur ukuran canvas berdasarkan gambar asli tanpa mengubah skala
    canvas.width = imgWidth;
    canvas.height = imgHeight;

    // Menggambar gambar dengan ukuran aslinya
    drawImage();
};

function drawImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Menggambar gambar asli tanpa perubahan ukuran atau skala
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

    // Menghitung ukuran gambar yang sesuai dengan PDF
    let imgWidthInPDF = imgWidth * zoomLevel * 0.264583;  
    let imgHeightInPDF = imgHeight * zoomLevel * 0.264583;

    // Menyesuaikan orientasi PDF
    if (orientation === 'landscape') {
        pdf = new jsPDF('l', 'mm', [imgWidthInPDF, imgHeightInPDF]);
    } else {
        pdf = new jsPDF('p', 'mm', [imgWidthInPDF, imgHeightInPDF]);
    }

    // Menyimpan gambar dengan kualitas tinggi ke PDF
    const imgData = canvas.toDataURL('image/png', 1.0); // 1.0 untuk kualitas maksimal

    // Menambahkan gambar ke PDF dengan kualitas yang tinggi
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidthInPDF, imgHeightInPDF);

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
