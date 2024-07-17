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
    code.textContent = selectedText.textContent;
    code.classList.add('language-javascript'); // İstediğiniz dil sınıfını ekleyin
    codeBlock.appendChild(code);

    // Kopyala butonu oluşturun
    var copyButton = document.createElement('button');
    copyButton.textContent = 'Kopyala';
    copyButton.classList.add('copy-code-button');
    copyButton.onclick = function() {
        copyCodeToClipboard(codeBlock, copyButton);
    };

    codeBlock.appendChild(copyButton);

    hljs.highlightElement(code);

    range.deleteContents();
    range.insertNode(codeBlock);

    // Boş bir satır ekleyerek kod bloğu altından yazmaya devam edilmesini sağla
    var emptyParagraph = document.createElement('p');
    emptyParagraph.innerHTML = '<br>';
    codeBlock.parentNode.insertBefore(emptyParagraph, codeBlock.nextSibling);
}

function copyCodeToClipboard(codeBlock, button) {
    button.style.display = 'none';

    var range = document.createRange();
    range.selectNode(codeBlock);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');

    button.style.display = 'block';

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
