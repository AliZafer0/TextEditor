function downloadHTML() {
    var content = document.querySelector('.text-editor').innerHTML;

    var css = `
body {
    background-color: #f0f0f0;
}
.editor-container {
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 20px;
}
.text-editor {
    min-height: 300px;
    border-radius: 5px;
    background-color: #272727;
    color: #fff;
    white-space: pre-wrap;
}
a {
    position: relative;
    color: #fff;
    text-decoration: none;
}
.btn {
    background-color: #272727;
    color: #fff;
    border: 1px solid #fff;
    height: 40px;
}
.btn:hover {
    color: #fff;
    background-color: #707070;
}
a:hover::after {
    content: attr(href);
    position: absolute;
    background-color: #fff;
    border: 1px solid #ccc;
    padding: 5px;
    top: 100%;
    left: 0;
    white-space: nowrap;
    z-index: 1;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
img {
    display: block;
    max-width: 50%;
    height: auto;
    margin: 10px 0;
}
.selected-image {
    border: 2px solid #007bff;
}
.image-left {
    display: block;
    margin-right: auto;
    margin-left: 0;
}
.image-right {
    display: block;
    margin-left: auto;
    margin-right: 0;
}
.image-center {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
pre code {
    background-color: #efc862 !important;
    color: #000;
    display: block;
    padding: 20px;
    border-radius: 5px;
    position: relative;
    white-space: pre-wrap;
}
.copy-code-button {
    position: absolute;
    background-color: #272727;
    color: #fff;
    border: none;
    padding: 5px;
    cursor: pointer;
    border-radius: 5px;
    z-index: 10;
}
.copy-code-button:hover {
    background-color: #007bff;
}
`;

    var htmlTemplate = `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Metin Editörü İçeriği</title>
    <style>${css}</style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/default.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/highlight.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', (event) => {
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightBlock(block);
            });
        });
    </script>
</head>
<body>
    <div class="container mt-5">
        <div class="editor-container">
            <div class="text-editor border p-3">${content}</div>
        </div>
    </div>
</body>
</html>
`;

    var blob = new Blob([htmlTemplate], { type: 'text/html' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'metin_editoru_icerik.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function formatText(command) {
    document.execCommand(command, false, null);
}

function promptLink() {
    var url = prompt("Lütfen URL'yi girin:");
    if (url) {
        document.execCommand('createLink', false, url);
    }
}

function insertImage(event) {
    var file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = "100%";
            img.style.height = "auto";
            img.classList.add('editable-image');
            document.querySelector('.text-editor').appendChild(img);

            // Ölçekleme çubuğunu göster
            var scaleRange = document.getElementById('scaleRange');
            scaleRange.classList.remove('d-none');
            scaleRange.value = 1;

            // Resme tıklanıldığında seçili olarak işaretle
            img.addEventListener('click', function() {
                var selectedImage = document.querySelector('.selected-image');
                if (selectedImage) {
                    selectedImage.classList.remove('selected-image');
                }
                img.classList.add('selected-image');
            });
        }
        reader.readAsDataURL(file);
    }
}

function scaleImage(event) {
    var scaleRange = event.target;
    var img = document.querySelector('.selected-image');
    if (img) {
        var newScale = scaleRange.value;
        img.style.width = `${newScale * 100}%`;
        img.style.height = "auto";
    }
}

function changeFont(select) {
    document.execCommand('fontName', false, select.value);
}

function changeFontSize(select) {
    var size = select.value;
    document.execCommand('fontSize', false, '7');
    var fontElements = document.getElementsByTagName("font");
    for (var i = 0, len = fontElements.length; i < len; ++i) {
        if (fontElements[i].size == "7") {
            fontElements[i].removeAttribute("size");
            fontElements[i].style.fontSize = size;
        }
    }
}

function changeColor(color) {
    document.execCommand('foreColor', false, color);
}

function alignSelectedElement(command) {
    var selectedImage = document.querySelector('.selected-image');
    var selection = window.getSelection();
    var selectedText = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    if (selectedImage) {
        selectedImage.classList.remove('image-left', 'image-center', 'image-right');

        if (command === 'justifyLeft') {
            selectedImage.classList.add('image-left');
        } else if (command === 'justifyCenter') {
            selectedImage.classList.add('image-center');
        } else if (command === 'justifyRight') {
            selectedImage.classList.add('image-right');
        }
    } else if (selectedText && !selectedText.collapsed) {
        document.execCommand(command, false, null);
    }
}

function clearImageSelection() {
    var selectedImage = document.querySelector('.selected-image');
    if (selectedImage) {
        selectedImage.classList.remove('selected-image');
    }
}

function deleteSelectedImage(event) {
    if (event.key === 'Delete') {
        var selectedImage = document.querySelector('.selected-image');
        if (selectedImage) {
            selectedImage.remove();
        }
    }
}

function handlePaste(event) {
    event.preventDefault();
    var clipboardData = event.clipboardData || window.clipboardData;
    var text = clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
}

function highlightCode() {
    var selection = window.getSelection();
    if (selection.rangeCount === 0 || selection.isCollapsed) {
        alert('Lütfen renklendirmek için bir metin seçin.');
        return;
    }

    var range = selection.getRangeAt(0);
    var selectedText = range.cloneContents();

    // Seçili alanın zaten renklendirilmiş olup olmadığını kontrol edin
    if (selectedText.querySelector('pre code')) {
        alert('Bu alan zaten renklendirilmiş.');
        return;
    }

    // Yeni kod bloğu oluşturun ve içine seçili metni ekleyin
    var codeBlock = document.createElement('pre');
    var code = document.createElement('code');
    var codeText = selectedText.textContent.replace(/([{};])/g, '$1\n');
    code.textContent = codeText;
    code.classList.add('language-javascript'); // İstediğiniz dil sınıfını ekleyin

    // Kopyala butonunu kod bloğunun içine yerleştirin
    var copyButton = document.createElement('button');
    copyButton.textContent = 'Kopyala';
    copyButton.classList.add('copy-code-button');

    codeBlock.appendChild(code);
    codeBlock.appendChild(copyButton);

    hljs.highlightElement(code);

    range.deleteContents();
    range.insertNode(codeBlock);

    // Boş bir satır ekleyerek kod bloğu altından yazmaya devam edilmesini sağla
    var emptyParagraph = document.createElement('p');
    emptyParagraph.innerHTML = '<br>';
    codeBlock.parentNode.insertBefore(emptyParagraph, codeBlock.nextSibling);

    // Kopyala butonuna tıklama olayını ekleyin
    copyButton.addEventListener('click', function() {
        copyCodeToClipboard(code);
    });
}

function copyCodeToClipboard(code) {
    var range = document.createRange();
    range.selectNodeContents(code);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    alert('Kod kopyalandı!');
}


document.addEventListener('click', function(e) {
    if (!e.target.classList.contains('editable-image')) {
        clearImageSelection();
    }
});

document.addEventListener('keydown', deleteSelectedImage);

document.querySelector('.text-editor').addEventListener('paste', handlePaste);

document.querySelector('.text-editor').addEventListener('input', function() {
    var links = this.querySelectorAll('a');
    links.forEach(function(link) {
        link.setAttribute('title', link.getAttribute('href'));
    });
});

window.addEventListener('beforeunload', function (e) {
    var confirmationMessage = 'Sayfayı yenilemek veya ayrılmak istediğinizden emin misiniz?';
    (e || window.event).returnValue = confirmationMessage; // Standart dışı Chrome ve IE kullanımı
    return confirmationMessage; // Standart
});
