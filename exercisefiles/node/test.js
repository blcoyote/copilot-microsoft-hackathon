//write npm command line to install mocha
//npm install --global mocha

//command to run this test file
//mocha test.js

const assert = require('assert');
const http = require('http');
const server = require('./nodeserver');

describe('Node Server', () => {
    it('should return "key not passed" if key is not passed', (done) => {
        http
        .get('http://localhost:3000/get' , (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                assert.equal(data, 'key not passed');
                done();
            });
        });
    });

    //add test to check get when key is equal to world
    it('should return "hello world" if key is "world"', (done) => {
        http
        .get('http://localhost:3000/get?key=world', (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                assert.equal(data, 'hello world');
                done();
            });
        });
    });

    //add test to check validatephoneNumber
    it('should validate phone number', (done) => {
        http
        .get('http://localhost:3000/validatephonenumber?phoneNumber=612345678', (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                assert.equal(data, 'valid');
                done();
            });
        });
    });

    //write test to validate validateSpanishDNI
    it('should validate Spanish DNI', (done) => {
        http
        .get('http://localhost:3000/ValidateSpanishDNI?dni=12345678Z', (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                assert.equal(data, 'valid');
                done();
            });
        });
    });

    //write test for returnColorCode red should return code #FF0000
    it('should return color code [255,0,0,1] for red', (done) => {
        http
        .get('http://localhost:3000/ReturnColorCode?color=red', (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                assert.deepEqual(JSON.parse(data), [255, 0, 0, 1]);
                done();
            });
        });
    });

    //write test for daysBetweenDates
    it('should calculate days between dates', (done) => {
        http
        .get('http://localhost:3000/DaysBetweenDates?date1=2023-01-01&date2=2023-01-10', (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                assert.equal(data, '9');
                done();
            });
        });
    });

    //write test for TellMeAJoke endpoint
    it('should return a random joke', (done) => {
        http
        .get('http://localhost:3000/TellMeAJoke', (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                const joke = JSON.parse(data);
                assert.ok(joke.setup);
                assert.ok(joke.punchline);
                console.log('Joke:', joke.setup, '-', joke.punchline);
                done();
            });
        });
    });

    //write test for moviesbytitle endpoint
    it('should return a list of movie titles by director', (done) => {
        http
        .get('http://localhost:3000/moviesbytitle?director=Tim%20Burton', (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                const titles = JSON.parse(data);
                assert.ok(Array.isArray(titles));
                assert.ok(titles.length > 0);
                done();
            });
        });
    });

    //write test for ParseUrl endpoint
    it('should parse the URL and return its components', (done) => {
        http
        .get('http://localhost:3000/ParseUrl?someurl=https://example.com:8080/path?query=1', (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                const parsedUrl = JSON.parse(data);
                assert.equal(parsedUrl.protocol, 'https:');
                assert.equal(parsedUrl.host, 'example.com:8080');
                assert.equal(parsedUrl.port, '8080');
                assert.equal(parsedUrl.path, '/path');
                assert.deepEqual(parsedUrl.querystring, { query: '1' });
                done();
            });
        });
    });

    //write test for ListFiles endpoint
    it('should return a list of files in the current directory', (done) => {
        http
        .get('http://localhost:3000/ListFiles', (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                const files = JSON.parse(data);
                assert.ok(Array.isArray(files));
                assert.ok(files.length > 0);
                done();
            });
        });
    });

    //write test for GetFullTextFile endpoint
    it('should return lines that contain the word "Fusce"', (done) => {
        http
        .get('http://localhost:3000/GetFullTextFile', (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                const lines = data.split('\n');
                assert.ok(lines.every(line => line.includes('Fusce')));
                done();
            });
        });
    });
});
