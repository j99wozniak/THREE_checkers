var game;
var net;
var ui;
var w = window.innerWidth;
var h = window.innerHeight - 4;
$(document).ready(function() {
    game = new Game()
    net = new Net()
    ui = new Ui()
    ui.Login()
})