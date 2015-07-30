/**
 * Created by ArgiDux on 7/30/2015.
 */

/*var test1= typeof (menuObj)=== 'function'? 'pass':'fail';
console.log('Menu is a function and exists: '+test1);*/

//Menu Unit Test
var menuTest=function(){
    var menuFunc=menu,
        menuObj=menu();
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
}();

var aboutTest=function(){
    var aboutFunc=about,
        aboutObj=about();
    document.body.innerHTML = "";
    var aboutExists=typeof (aboutFunc)==='function';

    var allChildFunctionsArePresent=true;

    if(aboutObj.draw==undefined && typeof (aboutObj.draw)==='function' ){ allChildFunctionsArePresent=false;}
    console.log('about Unit Test: ');
    console.log('about exists and it is a function: '+aboutExists);
    console.log('about draw function is present and it is functions: '+allChildFunctionsArePresent);
}();

var playTest=function(){
    var playFunc=play,
        playObj=play();
    Phaser.World=null;


    var playExists=typeof (playFunc)==='function';

    var allChildFunctionsArePresent=true;

    if(playObj.load==undefined && typeof (playObj.load)==='function' ){ allChildFunctionsArePresent=false;}
    if(playObj.create==undefined && typeof (playObj.create)==='function' ){ allChildFunctionsArePresent=false;}
    if(playObj.loop==undefined && typeof (playObj.loop)==='function' ){ allChildFunctionsArePresent=false;}

    console.log('play Unit Test: ');
    console.log('play exists and it is a function: '+playExists);
    console.log('loading assets, game initialization, and game loop are present and are functions: '+allChildFunctionsArePresent);
}();


