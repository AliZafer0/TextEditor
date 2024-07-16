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
            img.id = 'editable-image';
            document.querySelector('.text-editor').appendChild(img);

            // Ölçekleme çubuğunu göster
            var scaleRange = document.getElementById('scaleRange');
            scaleRange.classList.remove('d-none');
        }
        reader.readAsDataURL(file);
    }
}

function scaleImage(event) {
    var scaleRange = event.target;
    var img = document.getElementById('editable-image');
    if (img) {
      // En yüksek ölçeklemeyi %90 olarak sınırlayın
      var maximumScale = 0.9;
      var newScale = Math.min(maximumScale, scaleRange.value);
      img.style.transform = `scale(${newScale})`;
    }
  }
  

document.querySelector('.text-editor').addEventListener('input', function() {
    var links = this.querySelectorAll('a');
    links.forEach(function(link) {
        link.setAttribute('title', link.getAttribute('href'));
    });
});
