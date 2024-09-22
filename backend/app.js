const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' })); // Support JSON-encoded bodies (limit size for safety)
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['POST', 'GET'],
    credentials: true
}));

// Utility function to validate base64 file
function validateBase64File(base64String) {
    try {
        const parts = base64String.split(';base64,');
        if (parts.length !== 2) {
            return { isValid: false, mimeType: 'invalid', sizeKb: 0 };
        }
        const mimeType = parts[0].split(':')[1]; // Extract MIME type from the prefix
        const base64Data = parts[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const fileSizeKb = (buffer.length / 1024).toFixed(2);
        return {
            isValid: true,
            mimeType: mimeType || 'unknown',
            sizeKb: fileSizeKb
        };
    } catch (error) {
        return { isValid: false, mimeType: 'invalid', sizeKb: 0 };
    }
}

// POST request handler
app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    if (!Array.isArray(data)) {
        return res.status(400).json({
            is_success: false,
            message: 'Invalid JSON input format, "data" should be an array'
        });
    }

    const numbers = [];
    const alphabets = [];
    let highestLowercaseAlphabet = '';

    data.forEach(item => {
        if (!isNaN(item)) {
            numbers.push(item);
        } else if (/^[a-zA-Z]$/.test(item)) {
            alphabets.push(item);
            if (/[a-z]/.test(item) && (highestLowercaseAlphabet === '' || item > highestLowercaseAlphabet)) {
                highestLowercaseAlphabet = item;
            }
        }
    });

    let fileResponse = {
        file_valid: false
    };

    if (file_b64) {
        const fileValidation = validateBase64File(file_b64);
        fileResponse = {
            file_valid: fileValidation.isValid
        };
        if (fileValidation.isValid) {
            fileResponse.file_mime_type = fileValidation.mimeType;
            fileResponse.file_size_kb = fileValidation.sizeKb;
        }
    }

    res.status(200).json({
        is_success: true,
        user_id: 'Dipesh_Kumar_10102003',
        email: 'dr2034@srmist.edu.in',
        roll_number: 'RA2111003010553',
        numbers: numbers,
        alphabets: alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet ? [highestLowercaseAlphabet] : [],
        ...fileResponse
    });
});

// GET request handler
app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});