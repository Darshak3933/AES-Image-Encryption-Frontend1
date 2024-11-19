const backendUrl = "https://aes-image-encryption-backend1.onrender.com";

// Event listener for the Encrypt button
document.getElementById('encrypt-btn').addEventListener('click', async function () {
    const formData = new FormData();
    formData.append('key', document.getElementById('key').value);
    formData.append('image', document.getElementById('image').files[0]);

    try {
        const response = await fetch(`${backendUrl}/encrypt`, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            document.getElementById('output-message').textContent = "Encryption Successful!";
            document.getElementById('output-image').src = `data:image/png;base64,${result.encrypted_image}`;
            document.getElementById('output-image').style.display = "block";

            const downloadBtn = document.getElementById('download-btn');
            downloadBtn.style.display = "block";
            downloadBtn.onclick = function () {
                const link = document.createElement('a');
                link.href = document.getElementById('output-image').src;
                link.download = "encrypted_image.png";
                link.click();
            };
        } else {
            const errorData = await response.json();
            document.getElementById('output-message').textContent = errorData.error || "Encryption failed.";
        }
    } catch (error) {
        console.log("Error:", error);
        document.getElementById('output-message').textContent = "Error encrypting image.";
    }
});

document.getElementById('decrypt-btn').addEventListener('click', async function () {
    const formData = new FormData();
    formData.append('key', document.getElementById('key').value);
    formData.append('encrypted_image', document.getElementById('image').files[0]);

    try {
        const response = await fetch(`${backendUrl}/decrypt`, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            document.getElementById('output-message').textContent = "Decryption Successful!";
            document.getElementById('output-image').src = `data:image/png;base64,${result.decrypted_image}`;
            document.getElementById('output-image').style.display = "block";

            const downloadBtn = document.getElementById('download-btn');
            downloadBtn.style.display = "block";
            downloadBtn.onclick = function () {
                const link = document.createElement('a');
                link.href = document.getElementById('output-image').src;
                link.download = "decrypted_image.png";
                link.click();
            };
        } else {
            const errorData = await response.json();
            document.getElementById('output-message').textContent = errorData.error || "Decryption failed.";
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('output-message').textContent = "Error decrypting image.";
    }
});
