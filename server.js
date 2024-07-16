const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Web Scraper Form</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .form-container {
                    background: #fff;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    border-radius: 8px;
                    width: 100%;
                    max-width: 400px;
                    box-sizing: border-box;
                }
                .form-container h1 {
                    margin-bottom: 20px;
                    font-size: 24px;
                    text-align: center;
                    color: #333;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                    color: #555;
                }
                .form-group input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    box-sizing: border-box;
                    font-size: 16px;
                }
                .form-group input[type="submit"] {
                    background-color: #007bff;
                    color: #fff;
                    cursor: pointer;
                    border: none;
                    transition: background-color 0.3s;
                }
                .form-group input[type="submit"]:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="form-container">
                <h1>Start Web Scraper</h1>
                <form action="/start-scraper" method="post">
                    <div class="form-group">
                        <label for="urls">URLs (comma separated):</label>
                        <input type="text" id="urls" name="urls" required>
                    </div>
                    <div class="form-group">
                        <label for="interval">Interval (seconds):</label>
                        <input type="number" id="interval" name="interval" required>
                    </div>
                    <div class="form-group">
                        <label for="username">Username:</label>
                        <input type="text" id="username" name="username">
                    </div>
                    <div class="form-group">
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password">
                    </div>
                    <div class="form-group">
                        <input type="submit" value="Start Scraper">
                    </div>
                </form>
            </div>
        </body>
        </html>
    `);
});

app.post('/start-scraper', (req, res) => {
    const config = {
        urls: req.body.urls.split(',').map(url => url.trim()),
        interval: parseInt(req.body.interval, 10),
        username: req.body.username,
        password: req.body.password
    };

    fs.writeFileSync('config.json', JSON.stringify(config, null, 2));

    exec('node scraper.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.send(`Error: ${error.message}`);
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.send(`Error: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
        res.send('Scraper started successfully.');
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
