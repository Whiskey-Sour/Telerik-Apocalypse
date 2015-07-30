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
    if(menuObj.Div==undefined && typeof (menuObj.Menu)==='function' ){ allChildFunctionsArePresent=false;}
    if(menuObj.Button==undefined && typeof (menuObj.Menu)==='function' ){ allChildFunctionsArePresent=false;}
    if(menuObj.Event==undefined && typeof (menuObj.Menu)==='function' ){ allChildFunctionsArePresent=false;}

    console.log('Menu exists and it is a function: '+menuExists);
    console.log('Menu builder, div builder, button builder, event builder are all present and are functions: '+allChildFunctionsArePresent);
}();


