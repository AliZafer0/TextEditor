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

            var scaleRange = document.getElementById('scaleRange');
            scaleRange.classList.remove('d-none');
            scaleRange.value = 1;

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

function changeFontColor(color) {
    document.execCommand('foreColor', false, color);
}

function changeBackgroundColor(color) {
    document.execCommand('backColor', false, color);
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

    if (selectedText.querySelector('pre code')) {
        alert('Bu alan zaten renklendirilmiş.');
        return;
    }

    var codeBlock = document.createElement('pre');
    var code = document.createElement('code');
    var codeText = selectedText.textContent.replace(/([{};])/g, '$1\n');
    code.textContent = codeText;
    code.classList.add('language-javascript');

    var copyButton = document.createElement('button');
    copyButton.textContent = 'Kopyala';
    copyButton.classList.add('copy-code-button');
    copyButton.onclick = function() {
        navigator.clipboard.writeText(codeText);
    }

    codeBlock.appendChild(code);
    codeBlock.appendChild(copyButton);
    range.deleteContents();
    range.insertNode(codeBlock);
}

function showFindReplace() {
    $('#findReplaceModal').modal('show');
}

function findAndReplace() {
    var findText = document.getElementById('findInput').value;
    var replaceText = document.getElementById('replaceInput').value;

    var content = document.querySelector('.text-editor').innerHTML;
    var regex = new RegExp(findText, 'g');
    content = content.replace(regex, replaceText);

    document.querySelector('.text-editor').innerHTML = content;
    $('#findReplaceModal').modal('hide');
}

function showTemplates() {
    $('#templatesModal').modal('show');
}

function insertTemplate(template) {
    var templateContent = '';

    if (template === 'template1') {
        templateContent = '<h1>Şablon 1 Başlık</h1><p>Bu şablon 1 içeriğidir.</p>';
    } else if (template === 'template2') {
        templateContent = '<h2>Şablon 2 Başlık</h2><ul><li>Öğe 1</li><li>Öğe 2</li></ul>';
    }

    document.querySelector('.text-editor').innerHTML += templateContent;
    $('#templatesModal').modal('hide');
}

function insertTable() {
    var table = '<table class="table table-bordered"><thead><tr><th>Başlık 1</th><th>Başlık 2</th></tr></thead><tbody><tr><td>Veri 1</td><td>Veri 2</td></tr></tbody></table>';
    document.querySelector('.text-editor').innerHTML += table;
}

function undo() {
    document.execCommand('undo', false, null);
}

function redo() {
    document.execCommand('redo', false, null);
}
function insertTemplate(templateId) {
    var content;
    switch (templateId) {
        case 'template1':
            content = '<h1>Şablon 1 Başlığı</h1><p>Bu, şablon 1 içeridir. Bu şablon başlık ve kısa açıklama içerir.</p>';
            break;
        case 'template2':
            content = '<h2>Şablon 2 Başlığı</h2><ul><li>Liste öğesi 1</li><li>Liste öğesi 2</li></ul>';
            break;
        case 'template3':
            content = '<h3>Şablon 3 Başlığı</h3><blockquote><p>Bu, bir alıntıdır.</p></blockquote>';
            break;
        case 'template4':
            content = '<h1>Şablon 4 Başlığı</h1><p>Bir paragraf ve <a href="#">bağlantı</a> içeren şablon.</p>';
            break;
        case 'template5':
            content = '<h1>Şablon 5 Başlığı</h1><p>Bu şablon bir tablo içerir:</p><table border="1" style="width:100%"><tr><td>1</td><td>2</td></tr><tr><td>3</td><td>4</td></tr></table>';
            break;
        case 'template6':
            content = '<h1>Şablon 6 Başlığı</h1><p>Bir görsel ve açıklama içeren şablon.</p><img src="images/sablon-6.png" alt="Görsel" style="max-width:100%; height:auto;">';
            break;
        // Diğer şablonlar burada tanımlanabilir
        default:
            content = '<p>Şablon seçilmedi.</p>';
    }
    document.querySelector('.text-editor').innerHTML += content;
    $('#templatesModal').modal('hide');
}
const dropZone = document.getElementById('dropZone');

dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('dragover');
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        insertImage({ target: { files } });
    }
});
// Yardım butonuna tıklama olayını yönetme
document.getElementById('helpButton').addEventListener('click', () => {
    $('#helpModal').modal('show');
});
function createTable() {
    const rows = prompt('Satır sayısını girin:');
    const cols = prompt('Sütun sayısını girin:');
    const caption = document.getElementById('caption').value;
    if (rows && cols) {
        let tableHtml = '<table border="1" style="width:100%">';
        for (let i = 0; i < rows; i++) {
            tableHtml += '<tr>';
            for (let j = 0; j < cols; j++) {
                tableHtml += '<td>&nbsp;</td>';
            }
            tableHtml += '</tr>';
        }
        tableHtml += '</table>';
        if (caption) {
            tableHtml = `<caption>${caption}</caption>` + tableHtml;
        }
        document.execCommand('insertHTML', false, tableHtml);
    }
}
