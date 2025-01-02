document.getElementById("extract-text").addEventListener("click", () => {
    const fileInput = document.getElementById("pdf-upload");
    const output = document.getElementById("output");

    // Clear previous output
    output.value = "";

    if (fileInput.files.length === 0) {
        alert("Please upload a PDF file.");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function() {
        const pdfData = new Uint8Array(this.result);

        // Load PDF.js from the CDN
        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
        loadingTask.promise
            .then((pdf) => {
                let textPromises = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    textPromises.push(
                        pdf.getPage(i).then((page) =>
                            page.getTextContent().then((textContent) => {
                                return textContent.items.map((item) => item.str).join(" ");
                            })
                        )
                    );
                }
                return Promise.all(textPromises);
            })
            .then((pages) => {
                output.value = pages.join("\n\n");
            })
            .catch((error) => {
                console.error("Error extracting text:", error);
                alert("Failed to extract text. Ensure the file is not encrypted.");
            });
    };

    reader.readAsArrayBuffer(file);
});