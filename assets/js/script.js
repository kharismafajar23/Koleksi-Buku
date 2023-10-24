const daftarBuku = [];
const RENDER_EVENT = 'render-daftar-buku';
const SAVED_EVENT = 'simpan-buku';
const STORAGE_KEY = 'KOLEKSI_BUKU';

document.addEventListener(RENDER_EVENT, function () {
  const daftarBukuBelumDibaca = document.getElementById('buku_belum_dibaca');
  daftarBukuBelumDibaca.innerHTML = '';

  const daftarBukuSudahDibaca = document.getElementById('buku_sudah_dibaca');
  daftarBukuSudahDibaca.innerHTML = '';

  for (const buku of daftarBuku) {
    const bukuElement = buatElementBuku(buku);
    if (buku.isDibaca) {
      daftarBukuSudahDibaca.append(bukuElement);
    } else {
      daftarBukuBelumDibaca.append(bukuElement);
    }
  }
});

function isStorageExist() {
  if (typeof Storage === 'undefined') {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function loadDataBukuLokal() {
  const dataBukuLocal = localStorage.getItem(STORAGE_KEY);
  let dataBuku = JSON.parse(dataBukuLocal);

  if (dataBuku !== null) {
    for (const buku of dataBuku) {
      daftarBuku.push(buku);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
  return +new Date();
}

function generateObjectBuku(id, judul, penulis, tahun, isDibaca) {
  return {
    id,
    judul,
    penulis,
    tahun,
    isDibaca,
  };
}

document.addEventListener('DOMContentLoaded', function () {
  const formTambahBuku = document.getElementById('form_input_buku');
  formTambahBuku.addEventListener('submit', function (event) {
    event.preventDefault();
    tambahBuku();
  });

  if (isStorageExist()) {
    loadDataBukuLokal();
  }
});

const showFormBtn = document.getElementById('btn_form');
const formInputArea = document.getElementById('form_add_book');
const btnCancel = document.getElementById('btn_cancel');

showFormBtn.addEventListener('click', function () {
  showFormBtn.style.display = 'none';
  formInputArea.style.display = 'block';
});

btnCancel.addEventListener('click', function () {
  showFormBtn.style.display = 'block';
  formInputArea.style.display = 'none';
});

function tambahBuku() {
  const generateID = generateId();
  const judulBuku = document.getElementById('input_judul').value;
  const penulis = document.getElementById('input_penulis').value;
  const tahun = document.getElementById('input_tahun').valueAsNumber;
  const isDibaca = document.getElementById('check_dibaca').checked;

  const konfirmasiTambahBuku = confirm(`Ingin menambahkan buku "${judulBuku}" ?`);
  if (konfirmasiTambahBuku) {
    const objectBuku = generateObjectBuku(generateID, judulBuku, penulis, tahun, isDibaca);
    daftarBuku.push(objectBuku);

    document.dispatchEvent(new Event(RENDER_EVENT));
    simpanBuku();
  }
}

function buatElementBuku(objectBuku) {
  const teksJudul = document.createElement('h3');
  teksJudul.classList.add('judul_buku');
  teksJudul.innerText = objectBuku.judul;

  const teksPenulis = document.createElement('p');
  teksPenulis.classList.add('penulis_buku');
  teksPenulis.innerHTML = 'penulis : ' + `<span class='nama_penulis'>${objectBuku.penulis}</span>`;

  const teksTahun = document.createElement('span');
  teksTahun.classList.add('tahun_buku');
  teksTahun.innerHTML = 'tahun : ' + `<span class='tahun_terbit'>${objectBuku.tahun}</span>`;

  const detailBuku = document.createElement('div');
  detailBuku.classList.add('detail_buku');
  detailBuku.append(teksJudul, teksPenulis, teksTahun);

  const cardBuku = document.createElement('div');
  cardBuku.classList.add('card_buku');
  cardBuku.append(detailBuku);
  cardBuku.setAttribute('id', `buku-${objectBuku.id}`);

  if (!objectBuku.isDibaca) {
    const actionBtn = document.createElement('div');

    const readBtn = document.createElement('button');
    readBtn.className = 'bx bxs-book-add read_button';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'bx bx-trash delete_button';

    actionBtn.append(readBtn, deleteBtn);
    cardBuku.append(actionBtn);

    readBtn.addEventListener('click', function () {
      bukuSudahDibaca(objectBuku.id);
    });

    deleteBtn.addEventListener('click', function () {
      hapusBuku(objectBuku.id);
    });
  } else {
    const actionBtn = document.createElement('div');

    const unReadBtn = document.createElement('button');
    unReadBtn.className = 'bx bxs-bookmark-alt-minus unread_button';

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('bx');
    deleteBtn.classList.add('bx-trash');
    deleteBtn.classList.add('delete_button');

    actionBtn.append(unReadBtn, deleteBtn);
    cardBuku.append(actionBtn);

    unReadBtn.addEventListener('click', function () {
      bukuBelumDibaca(objectBuku.id);
    });
    deleteBtn.addEventListener('click', function () {
      hapusBuku(objectBuku.id);
    });
  }

  return cardBuku;
}

function simpanBuku() {
  if (isStorageExist()) {
    const data = JSON.stringify(daftarBuku);
    localStorage.setItem(STORAGE_KEY, data);
  }
}

function cariIndexBuku(idBuku) {
  for (const index of daftarBuku) {
    if (daftarBuku[index].id === idBuku) {
      return index;
    }
  }
  return -1;
}

function cariBuku(idBuku) {
  for (const buku of daftarBuku) {
    if (buku.id === idBuku) {
      return buku;
    }
  }
  return null;
}

function bukuSudahDibaca(idBuku) {
  const targetBuku = cariBuku(idBuku);
  if (targetBuku == null) return;
  targetBuku.isDibaca = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  simpanBuku();
}

function bukuBelumDibaca(idBuku) {
  const targetBuku = cariBuku(idBuku);
  if (targetBuku == null) return;
  targetBuku.isDibaca = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  simpanBuku();
}

function hapusBuku(idBuku) {
  daftarBuku.forEach((buku, index) => {
    if (buku.id === idBuku) {
      const konfirmasiHapus = confirm(`Apakah kamu ingin menghapus buku "${buku.judul}" ?`);
      if (konfirmasiHapus) {
        daftarBuku.splice(index, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        simpanBuku();
      }
    }
  });
}

const searchBtn = document.getElementById('btn_search');
searchBtn.addEventListener('click', function () {
  cariNamaBuku();
});

const inputNamaBuku = document.getElementById('search_input');
inputNamaBuku.addEventListener('keyup', function () {
  cariNamaBuku();
});

function cariNamaBuku() {
  const inputJudul = document.getElementById('search_input').value;
  let cardBuku = document.querySelectorAll('.card_buku');
  let daftarBuku = document.querySelectorAll('.judul_buku');

  daftarBuku.forEach((buku, index) => {
    const judulBuku = buku.textContent.toLowerCase();
    if (judulBuku.indexOf(inputJudul) != -1) {
      cardBuku[index].style.display = 'flex';
    } else {
      cardBuku[index].style.display = 'none';
    }
  });
}
