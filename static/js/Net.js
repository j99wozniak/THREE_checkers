/*
    obsługa komunikację Ajax - serwer
*/
function Net() {
    this.sendData = function (type, data) {
        $.ajax({
            url: "http://localhost:3000",
            data: {
                type: type,
                data: data
            },
            type: "POST",
            success: function (data) {
                //czytamy odesłane z serwera dane
                var obj = JSON.parse(data)
                console.log(obj)

                switch (obj.type) {
                    //dodanie nowego usera
                    case "LOGIN_USER":
                        if (obj.data[0] == "OKB") {
                            ui.firstLogin()
                            game.setPlayer("black")
                            $("#info").text("Grasz czarnymi " + obj.data[1])
                        }
                        else if (obj.data[0] == "OKW") {
                            ui.loginDelete()
                            game.setPlayer("white")
                            $("#info").text("Grasz białymi " + obj.data[1])
                        }
                        else if (obj.data[0] == "MAXUSERS") {
                            $(".text").text("Już jest dwóch graczy")
                        }
                        else {
                            $(".text").text("Zła nazwa")
                        }
                    break;

                    case "IS_READY":
                        // Sprawdzenie czy dołączył drugi gracz
                        if (obj.data[0] == "OK") {
                            ui.done()
                            ui.Wait()
                        }
                    break;

                    case "MOVE_PAWN":
                        // Nie spodziewamy się odpowiedzi z serwera. Tylko każemy userowi zacząć czekać na ruch przeciwnika
                        ui.Wait()
                    break;

                    case "DID_MOVE":
                        // Sprawdzenie czy przeciwnik się ruszył
                        if(obj.data[0] != "NO"){
                            mov = obj.data[0]
                            ui.moveDone()
                            game.movePawn(mov.sxz[0], mov.sxz[1], mov.dxz[0], mov.dxz[1], mov.cxz[0], mov.cxz[1])
                        }
                    break;

                    case "DELETE_USERS":
                        // ¯\_(ツ)_/¯
                    break;
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }
}