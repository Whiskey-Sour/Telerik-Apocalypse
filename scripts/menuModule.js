var menuModule=function(){
    var menuObj={
        createMenu: function(){
            menu();
        }
    };
    function menu() {
        var divIdName = 'game-menu',
            buttonsIdNames = ['btn-play', 'btn-about'],
            buttonsIdNamesLen = buttonsIdNames.length;

        addMenu();

        function addMenu () {
            addDiv();
            addButtons();
            addEvents();
        }

        function addDiv() {
            var $div = $('<div>').attr('id', divIdName);
            $($div).appendTo('body');
        }

        function addButtons() {
            var $buttonContainer = ('#' + divIdName),
                currentIdName,
                $button,
                i;

            for (i = 0; i < buttonsIdNamesLen; i += 1) {
                currentIdName = buttonsIdNames[i];
                $button = $('<button>').attr('id', currentIdName);

                $($button).appendTo($buttonContainer);
            }
        }

        function addEvents() {
            var buttonIdName = buttonsIdNames[0];

            $('#' + buttonIdName).on('click', function() {
                $('#' + divIdName).remove();
                main.game.startGame();
                //play();
            });

            buttonIdName = buttonsIdNames[1];
            $('#' + buttonIdName).on('click', function() {
                $('#' + divIdName).remove();
                main.about.createAboutPage();
                //about();
            });
        }

        return{
            Menu: addMenu,
            Div: addDiv,
            Button: addButtons,
            Event: addEvents,
        };
    };
    return menuObj;
}();
