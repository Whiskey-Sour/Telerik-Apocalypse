var GAME = gameModule;
var MENU = menuModule;
var ABOUT = aboutModule;

var mainModule = function (game, menu, about) {
    var main = {
        game: game,
        menu: menu,
        about: about,
        run: function(){
            this.menu.createMenu();
        }
    };

    return main;
}(GAME,MENU,ABOUT);

var main = mainModule;
main.run();