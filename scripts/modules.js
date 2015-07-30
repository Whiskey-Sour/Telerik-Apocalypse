/**
 * Created by ArgiDux on 7/30/2015.
 */
var aboutModule=function(aboutF){
    var about={
        createAboutPage: function(){
            aboutF();
        }
    };
    return about;
}(about);

var menuModule=function(menuF){
    var menu={
        createMenu: function(){
            menuF();
        }
    };
    return menu;
}(menu);

var gameModule=function(gameF){
    var game={
        startGame: function(){
            gameF();
        }
    };
    return game;
}(play);
var GAME=gameModule;
var MENU=menuModule;
var ABOUT=aboutModule;

var mainModule= function (game, menu, about) {
    var main={
        game: game,
        menu: menu,
        about: about,
        run: function(){
            this.menu.createMenu();
        }
    };
    return main
}(GAME,MENU,ABOUT);




var main=mainModule;
main.run();