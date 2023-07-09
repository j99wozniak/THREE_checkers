var http = require("http");
var fs = require("fs");
var qs = require("querystring");

var users = []
var pionki = [
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0]
]
var lChange = { color: '', sxz: [], dxz: [], cxz: []} // last Change. source[x, z], destination[x, z], captured[x, z]
var didmoveB = false // did Black move?
var didmoveW = false // did White move?

var server = http.createServer(function(req, response) {
    response.writeHead(200, { "content-type": "text/html;charset=utf-8" })
    switch (req.method) {
        case "GET":
            if (req.url === "/") {
                fs.readFile("static/index.html", function(error, data) {
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.write(data);
                    response.end();
                })
            } else if (req.url === "/css/style.css") {
                fs.readFile("static/css/style.css", function(error, data) {
                    response.writeHead(200, { 'Content-Type': 'text/css' });
                    response.write(data);
                    response.end();
                })
            } else if (req.url === "/libs/three.js") {
                fs.readFile("static/libs/three.js", function(error, data) {
                    response.writeHead(200, { 'Content-Type': 'application/javascript' });
                    response.write(data);
                    response.end();
                })
            } else if (req.url === "/libs/jquery-3.1.1.js") {
                fs.readFile("static/libs/jquery-3.1.1.js", function(error, data) {
                    response.writeHead(200, { 'Content-Type': 'application/javascript' });
                    response.write(data);
                    response.end();
                })
            } else if (req.url === "/js/Game.js") {
                fs.readFile("static/js/Game.js", function(error, data) {
                    response.writeHead(200, { 'Content-Type': 'application/javascript' });
                    response.write(data);
                    response.end();
                })
            } else if (req.url === "/js/Main.js") {
                fs.readFile("static/js/Main.js", function(error, data) {
                    response.writeHead(200, { 'Content-Type': 'application/javascript' });
                    response.write(data);
                    response.end();
                })
            } else if (req.url === "/js/UI.js") {
                fs.readFile("static/js/UI.js", function(error, data) {
                    response.writeHead(200, { 'Content-Type': 'application/javascript' });
                    response.write(data);
                    response.end();
                })
            } else if (req.url === "/js/Net.js") {
                fs.readFile("static/js/Net.js", function(error, data) {
                    response.writeHead(200, { 'Content-Type': 'application/javascript' });
                    response.write(data);
                    response.end();
                })
            } else if (req.url === "/mats/light.jpg") {
                fs.readFile("static/mats/light.jpg", function(error, data) {
                    response.writeHead(200, { 'Content-Type': 'image/jpeg' });
                    response.write(data);
                    response.end();
                })
            } else if (req.url === "/mats/dark.jpg") {
                fs.readFile("static/mats/dark.jpg", function(error, data) {
                    response.writeHead(200, { 'Content-Type': 'image/jpeg' });
                    response.write(data);
                    response.end();
                })
            } else if (req.url === "/mats/sdark.jpg") {
                fs.readFile("static/mats/sdark.jpg", function(error, data) {
                    response.writeHead(200, { 'Content-Type': 'image/jpeg' });
                    response.write(data);
                    response.end();
                })
            } else if (req.url === "/mats/black.jpg") {
                fs.readFile("static/mats/black.jpg", function(error, data) {
                    response.writeHead(200, { 'Content-Type': 'image/jpeg' });
                    response.write(data);
                    response.end();
                })
            } else if (req.url === "/mats/sblack.jpg") {
                fs.readFile("static/mats/sblack.jpg", function(error, data) {
                    response.writeHead(200, { 'Content-Type': 'image/jpeg' });
                    response.write(data);
                    response.end();
                })
            } else if (req.url === "/mats/white.jpg") {
                fs.readFile("static/mats/white.jpg", function(error, data) {
                    response.writeHead(200, { 'Content-Type': 'image/jpeg' });
                    response.write(data);
                    response.end();
                })
            } else if (req.url === "/mats/swhite.jpg") {
                fs.readFile("static/mats/swhite.jpg", function(error, data) {
                    response.writeHead(200, { 'Content-Type': 'image/jpeg' });
                    response.write(data);
                    response.end();
                })
            } else if (req.url === "/mats/load.png") {
                fs.readFile("static/mats/load.png", function(error, data) {
                    response.writeHead(200, { 'Content-Type': 'image/png' });
                    response.write(data);
                    response.end();
                })
            }

            break;

        case "POST":
            servResponse(req, response)

            break;

    }
})

function servResponse(req, response) {
    var allData = "";

    //kiedy przychodzą dane POSTEM, w postaci pakietów,
    //łączymy je po kolei do jednej zmiennej "allData"

    req.on("data", function(data) {
        console.log("data: " + data)
        allData += data;
    })

    //kiedy przyjdą już wszystkie dane
    //parsujemy je do obiektu "finish"
    //i odsyłamy do przeglądarki (żeby nie tworzyć nowych obiektów)

    req.on("end", function(data) {
        var finish = qs.parse(allData)
        switch (finish.type) {
            case "LOGIN_USER":
                if (users.length == 0 && finish.data) {
                    users.push(finish.data)
                    finish.data = ["OKB", finish.data]
                    console.log("OK " + users)
                } else if (users.length == 1 && finish.data && users[0] != finish.data) {
                    users.push(finish.data)
                    finish.data = ["OKW", finish.data]
                    console.log("OK " + users)
                } else if (users[0] == finish.data || !finish.data) {
                    finish.data = ["INVALIDNAME"]
                    console.log("INVALID " + users)
                } else {
                    finish.data = ["MAXUSERS"]
                    console.log("MAXUSERS " + users)
                }
            break;

            case "IS_READY":
                if (users.length == 2) {
                    finish.data = ["OK"]
                }
            break;

            case "MOVE_PAWN":
                finish.data = JSON.parse(finish.data)
                lChange = finish.data
                pionki[lChange.sxz[0]][lChange.sxz[1]] = 0
                if (lChange.color == "white") {
                    pionki[lChange.dxz[0]][lChange.dxz[1]] = 1
                    didmoveW = true
                } else {
                    pionki[lChange.dxz[0]][lChange.dxz[1]] = 2
                    didmoveB = true
                }
                if(lChange.cxz[0] != -1 && lChange.cxz[1] != -1){
                    pionki[lChange.cxz[0]][lChange.cxz[1]] = 0
                }

            break;

            case "DID_MOVE":
            if (finish.data == "white"){
                if(didmoveB){
                    console.log(lChange)
                    finish.data = [lChange]
                    didmoveB = false
                }
                else{
                    finish.data = ["NO"]
                }
            }
            else if (finish.data == "black"){
                if(didmoveW){
                    console.log(lChange)
                    finish.data = [lChange]
                    didmoveW = false
                }
                else{
                    finish.data = ["NO"]
                }
            }
            break;

            case "DELETE_USERS":
                users = []
                console.log("Deleting users")
            break;
        }
        console.log(finish)
        response.end(JSON.stringify(finish));
    })
}

server.listen(3000, function() {
    console.log("serwer startuje na porcie 3000")
});