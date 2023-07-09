/*
    UI - obsługa interfejsu użytkownika
*/

function Ui() {

    // Ustaw pozycję kamery
    $("#camselect").change(function() {
        var num = Number($("#camselect").val())
        switch (num) {
            case 1:
                game.setCamera([0, 1000, 0]);
                break;

            case 2:
                game.setCamera([1000, 500, 0]);
                break;

            case 3:
                game.setCamera([0, 500, 1000]);
                break;

            case 4:
                game.setCamera([-1000, 500, 0]);
                break;
        }

    });

    // Ekran "logowania"
    this.Login = function() {

        var blockade = $("<div>").addClass("block")
        $(blockade)
            .css("width", w)
            .css("height", h)

        $("#login").append(blockade)

        var logdiv = $("<div>").addClass("logdiv")
        $(logdiv)
            .css("top", (h / 2) - 200)
            .css("left", (w / 2) - 250)

        var text = $("<div>").addClass("text").text("Zaloguj się!")
        $(logdiv).append(text)

        var textbox = $("<input type='text'>", ).addClass("option")
        $(logdiv).append(textbox)

        var option = $("<div>").addClass("option").attr('id', 'bLog');
        $(option).text("Login")
        $(logdiv).append(option)

        var delUsers = $("<div>").addClass("option").attr('id', 'bDel');
        $(delUsers).text("Delete Users")
        $(logdiv).append(delUsers)

        $("#login").append(logdiv)

        $(option).click(function() {
            net.sendData("LOGIN_USER", $(textbox).val())
        })

        $(delUsers).click(function() {
            net.sendData("DELETE_USERS", "")
        })

    }

    // "Poczekalnia" dla pierwszego gracza
    var spinInterval
    this.firstLogin = function(){
        $(".text").text("Oczekiwanie na drugiego gracza...")
        $(".option").remove()

        var image = $("<div>").addClass("loadImage")
        $(".logdiv").append(image)
        var i = 0
 
        spinInterval = setInterval(spinCheck, 10);
        
        // Co 100 wykonań pętli zapytaj serwera czy drugi gracz dołączył
        function spinCheck(){
            if(i > 100){
                i = 0
                net.sendData("IS_READY",0)
            }
            // Kręcący się obrazek :)
            $(".loadImage").css("transform", "rotate("+(i*3.6)+"deg)")

            i++
        }
    }

    // Czekanie na ruch przeciwnika
    this.Wait = function(){
        // Stwórz blokadę na ekranie divem, tak żeby gracz nie klikał planszy
        var blockade = $("<div>").addClass("block")
        $(blockade)
            .css("width", w)
            .css("height", h)
            .css("opacity", 0.2)

        var image = $("<div>").addClass("loadImage")
        $(blockade).append(image)
        var i = 0
 
        checkMove = setInterval(moveCheck, 10);
        
        // Co 100 wykonań pętli zapytaj serwea czy przeciwnik się ruszył
        function moveCheck(){
            if(i > 100){
                i = 0
                net.sendData("DID_MOVE", side)
            }

            $(".loadImage").css("transform", "rotate("+(i*3.6)+"deg)")

            i++
        }

        $("#login").append(blockade)

        var text = $("<div>").addClass("text").text("Tura przeciwnika")
        $("#login").append(text)

    }

    this.loginDelete = function() {
        $("#login").empty()
    }

    this.moveDone = function(){
        clearInterval(checkMove);
        ui.loginDelete()
    }

    this.done = function(){
        clearInterval(spinInterval);
        ui.loginDelete()
    }
}