// Backend URL (replace with your actual backend URL on Render)
const backendUrl = "https://aes-image-encryption-backend1.onrender.com";
fetch(`${backendUrl}/encrypt`, { method: "POST", body: formData});
// Event listener for the Encrypt button
document.getElementById('encrypt-btn').addEventListener('click', async function() {
    // Set up FormData for the encryption request
    const formData = new FormData();
    formData.append('key', document.getElementById('key').value);
    formData.append('image', document.getElementById('image').files[0]);
    console.log("ok");
    
    try {
        // Send the encryption request to the backend
        const response = await fetch(`${backendUrl}/encrypt`, {
            method: "POST",
            body: formData,
          
        });
        console.log(response);
        
        if (response.ok) {
            const result = await response.json();
            document.getElementById('output-message').textContent = "Operation Successful!";
            document.getElementById('output-image').src = `data:image/png;base64,${result.encrypted_image || result.decrypted_image}`;
            document.getElementById('output-image').style.display = "block";
        
            // Set up download functionality
            const downloadBtn = document.getElementById('download-btn');
            downloadBtn.style.display = "block";
            
            downloadBtn.onclick = function() {
                const link = document.createElement('a');
                link.href = document.getElementById('output-image').src;
                link.download = result.encrypted_image ? "encrypted_image.png" : "decrypted_image.png";
                link.click();
            };
        }
        
         else {
            const errorData = await response.json();
            document.getElementById('output-message').textContent = errorData.error || "Encryption failed.";
        }
    } catch (error) {
        console.log("Error:", error);
        document.getElementById('output-message').textContent = "Error encrypting image.";
    }
});
// Event listener for the Decrypt button
document.getElementById('decrypt-btn').addEventListener('click', async function() {
    // Extract the key and encrypted image file for decryption
    const key = document.getElementById('key').value;
    const encryptedImageFile = document.getElementById('image').files[0]; // Get the encrypted image file from the input

    // Check if the image is selected and if key is entered
    if (!encryptedImageFile) {
        document.getElementById('output-message').textContent = "Please select an encrypted image file.";
        return;
    }

    // Set up FormData for the decryption request
    const formData = new FormData();
    formData.append('key', key);
    formData.append('encrypted_image', encryptedImageFile); // Add the encrypted image to the FormData

    try {
        // Send the decryption request to the backend
        const response = await fetch(`${backendUrl}/decrypt`, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            document.getElementById('output-message').textContent = "Decryption Successful!";
            document.getElementById('output-image').src = `data:image/png;base64,${result.decrypted_image}`;
            document.getElementById('output-image').style.display = "block";

            // Set up download functionality
            const downloadBtn = document.getElementById('download-btn');
            downloadBtn.style.display = "block";

            downloadBtn.onclick = function() {
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
