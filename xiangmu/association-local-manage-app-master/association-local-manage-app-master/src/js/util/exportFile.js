export function exportExcel(resp) {
    let fileName = resp.headers.filename;
    let link = document.createElement('a');
    let blob = new Blob([resp.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    link.style.display = 'none';
    let blobURL = window.URL.createObjectURL(blob);
    link.href = blobURL;
    link.setAttribute('download', decodeURIComponent(fileName));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobURL);
}
