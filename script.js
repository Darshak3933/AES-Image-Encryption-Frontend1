const backendUrl = "https://aes-image-encryption-backend1.onrender.com";

// Event listener for the Encrypt button
document.getElementById('encrypt-btn').addEventListener('click', async function () {
    const key = document.getElementById('key').value;
    const imageFile = document.getElementById('image').files[0];

    // Validate key length
    if (key.length !== 16 && key.length !== 24 && key.length !== 32) {
        alert("Key must be 16, 24, or 32 characters long.");
        return;
    }

    // Validate image file
    if (!imageFile) {
        alert("Please upload an image file.");
        return;
    }

    const formData = new FormData();
    formData.append('key', key);
    formData.append('image', imageFile);

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

            // Show download button for encrypted image
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
        console.error("Error:", error);
        document.getElementById('output-message').textContent = "Error encrypting image.";
    }
});

// Event listener for the Decrypt button
document.getElementById('decrypt-btn').addEventListener('click', async function () {
    const key = document.getElementById('key').value;
    const encryptedImageFile = document.getElementById('image').files[0];

    // Validate key length
    if (key.length !== 16 && key.length !== 24 && key.length !== 32) {
        alert("Key must be 16, 24, or 32 characters long.");
        return;
    }

    // Validate encrypted image file
    if (!encryptedImageFile) {
        alert("Please upload the encrypted image file.");
        return;
    }

    const formData = new FormData();
    formData.append('key', key);
    formData.append('encrypted_image', encryptedImageFile);

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

            // Show download button for decrypted image
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
            console.error("Backend Error:", errorData.error);
            document.getElementById('output-message').textContent = errorData.error || "Decryption failed.";
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('output-message').textContent = "Error decrypting image.";
    }
});
