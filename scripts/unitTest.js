/**
 * Created by ArgiDux on 7/30/2015.
 */

/*var test1= typeof (menuObj)=== 'function'? 'pass':'fail';
console.log('Menu is a function and exists: '+test1);*/
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
//Menu Unit Test
var menuTest=function(main){
    var menuFunc=main.menu.createMenu,
        menuObj=main.menu.createMenu();
    document.body.innerHTML = "";
    var menuExists=typeof (menuFunc)==='function';

    var allChildFunctionsArePresent=true;

    if(menuObj.Menu==undefined && typeof (menuObj.Menu)==='function' ){ allChildFunctionsArePresent=false;}
    if(menuObj.Div==undefined && typeof (menuObj.Div)==='function' ){ allChildFunctionsArePresent=false;}
    if(menuObj.Button==undefined && typeof (menuObj.Button)==='function' ){ allChildFunctionsArePresent=false;}
    if(menuObj.Event==undefined && typeof (menuObj.Event)==='function' ){ allChildFunctionsArePresent=false;}
    console.log('menu Unit Test: ');
    console.log('menu exists and it is a function: '+menuExists);
    console.log('menu builder, div builder, button builder, event builder are all present and are functions: '+allChildFunctionsArePresent);
}(main);

var aboutTest=function(main){
    var aboutFunc=main.about.createAboutPage,
        aboutObj=main.about.createAboutPage();
    document.body.innerHTML = "";
    var aboutExists=typeof (aboutFunc)==='function';

    var allChildFunctionsArePresent=true;

    if(aboutObj.draw==undefined && typeof (aboutObj.draw)==='function' ){ allChildFunctionsArePresent=false;}
    console.log('about Unit Test: ');
    console.log('about exists and it is a function: '+aboutExists);
    console.log('about draw function is present and it is functions: '+allChildFunctionsArePresent);
}(main);

var playTest=function(main){
    var playFunc=main.game.play.startGame,
        playObj=main.game.play.startGame();
    Phaser.World=null;


    var playExists=typeof (playFunc)==='function';

    var allChildFunctionsArePresent=true;

    if(playObj.load==undefined && typeof (playObj.load)==='function' ){ allChildFunctionsArePresent=false;}
    if(playObj.create==undefined && typeof (playObj.create)==='function' ){ allChildFunctionsArePresent=false;}
    if(playObj.loop==undefined && typeof (playObj.loop)==='function' ){ allChildFunctionsArePresent=false;}

    console.log('play Unit Test: ');
    console.log('play exists and it is a function: '+playExists);
    console.log('loading assets, game initialization, and game loop are present and are functions: '+allChildFunctionsArePresent);
}(main);


