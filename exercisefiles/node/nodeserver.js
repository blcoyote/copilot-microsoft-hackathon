const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// write a nodejs server that will expose a method call "get" that will return the value of the key passed in the query string
// example: http://localhost:3000/get?key=hello
// if the key is not passed, return "key not passed"
// if the key is passed, return "hello" + key
// if the url has other methods, return "method not supported"
// when server is listening, log "server is listening on port 3000"
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    switch (pathname) {
        case '/get':
            if (query.key) {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                if (query.key === 'world') {
                    res.end('hello world');
                } else {
                    res.end('hello ' + query.key);
                }
            } else {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('key not passed');
            }
            break;

        case '/DaysBetweenDates':
            const date1 = new Date(query.date1);
            const date2 = new Date(query.date2);
            if (!isNaN(date1) && !isNaN(date2)) {
                const diffTime = Math.abs(date2 - date1);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(diffDays.toString());
            } else {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid dates');
            }
            break;

        case '/validatephonenumber':
            const phoneNumber = query.phoneNumber;
            const spanishPhoneNumberPattern = /^(\+34|0034|34)?[6|7|9][0-9]{8}$/;
            if (spanishPhoneNumberPattern.test(phoneNumber)) {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('valid');
            } else {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('invalid');
            }
            break;

        case '/ValidateSpanishDNI':
            const dni = query.dni;
            const dniPattern = /^[0-9]{8}[A-Z]$/;
            const dniLetters = "TRWAGMYFPDXBNJZSQVHLCKE";

            if (dniPattern.test(dni)) {
                const number = parseInt(dni.slice(0, 8), 10);
                const letter = dni.slice(-1);
                const calculatedLetter = dniLetters[number % 23];

                if (calculatedLetter === letter) {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('valid');
                } else {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('invalid');
                }
            } else {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('invalid');
            }
            break;

        case '/ReturnColorCode':
            const color = query.color;
            const colorsFilePath = path.join(__dirname, 'colors.json');

            fs.readFile(colorsFilePath, 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }

                const colors = JSON.parse(data);
                const colorData = colors.find(c => c.color.toLowerCase() === color.toLowerCase());

                if (colorData) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(colorData.code.rgba));
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Color not found');
                }
            });
            break;

        case '/TellMeAJoke':
            axios.get('https://official-joke-api.appspot.com/random_joke')
                .then(response => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(response.data));
                })
                .catch(error => {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Failed to fetch joke');
                });
            break;

        case '/moviesbytitle':
            const director = query.director;
            const apiKey = 'fc89485';
            const omdbUrl = `http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(director)}`;

            axios.get(omdbUrl)
                .then(response => {
                    if (response.data.Response === 'True') {
                        const titles = response.data.Search.map(movie => movie.Title);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(titles));
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('No movies found');
                    }
                })
                .catch(error => {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Failed to fetch movies');
                });
            break;

        case '/ParseUrl':
            const someurl = query.someurl;
            if (someurl) {
                const parsedUrl = url.parse(someurl, true);
                const result = {
                    protocol: parsedUrl.protocol,
                    host: parsedUrl.host,
                    port: parsedUrl.port,
                    path: parsedUrl.pathname,
                    querystring: parsedUrl.query
                };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } else {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('someurl parameter is missing');
            }
            break;

        case '/ListFiles':
            const currentDirectory = __dirname;
            fs.readdir(currentDirectory, (err, files) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Failed to list files');
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(files));
            });
            break;

        case '/GetFullTextFile':
            const filePath = path.join(__dirname, 'sample.txt');
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Failed to read file');
                    return;
                }

                const lines = data.split('\n').filter(line => line.includes('Fusce'));
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(lines.join('\n'));
            });
            break;

        default:
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('method not supported');
            break;
    }
});

server.listen(3000, () => {
    console.log('server is listening on port 3000');
});

