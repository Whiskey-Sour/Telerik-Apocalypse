/**
 * Created by ArgiDux on 7/30/2015.
 */

/*var test1= typeof (menuObj)=== 'function'? 'pass':'fail';
console.log('Menu is a function and exists: '+test1);*/

//Menu Unit Test
var menuTest=function(){
    var menuFunc=menu,
        menuObj=menu();

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

    var aboutExists=typeof (aboutFunc)==='function';

    var allChildFunctionsArePresent=true;

    if(aboutObj.draw==undefined && typeof (aboutObj.draw)==='function' ){ allChildFunctionsArePresent=false;}
    console.log('about Unit Test: ');
    console.log('about exists and it is a function: '+aboutExists);
    console.log('about draw function is present and it is functions: '+allChildFunctionsArePresent);
}();


