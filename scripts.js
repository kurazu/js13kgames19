function onFileLoad(evt) {
    const array = new Float32Array(this.result);
    console.log(array);
}

function onDrop(evt) {
    evt.preventDefault();
    const files = evt.dataTransfer.files;
    for (const file of files) {
        const reader = new FileReader();
        reader.addEventListener('load', onFileLoad);
        reader.readAsArrayBuffer(file);
        }
}


function onDragOver(evt) {
    evt.preventDefault();
}

document.body.addEventListener('drop', onDrop, false);
document.body.addEventListener('dragover', onDragOver, false);
