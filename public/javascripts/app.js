var stompClient = null;


function animate(id) {
    cy.zoom(3);
    var centerX = cy.width() / 2;
    var centerY = cy.height() / 2;

    var nodePointX = cy.$id(id).renderedPosition().x;
    var nodePointY = cy.$id(id).renderedPosition().y;

    var viewPortX = cy.elements().renderedBoundingBox().x1;
    var viewPortY = cy.elements().renderedBoundingBox().y1;

    var panX = nodePointX > centerX ? (viewPortX - Math.abs(nodePointX - centerX)) : (viewPortX + Math.abs(nodePointX - centerX));
    var panY = nodePointY < centerY ? (viewPortY + Math.abs(nodePointY - centerY)) : (viewPortY - Math.abs(nodePointY - centerY));

    cy.animate(
        {
            pan: {x: panX, y: panY}
        }
    );
    showBuildingProcessToolTip(cy.$id(id));

}

var lastProgressTipOnTop;

function showBuildingProcessToolTip(node) {

    var makeProgressTip = function (node) {
        return tippy(node.popperRef(), {
            content: '<div id="progressTip">\n' +
                '        <span class="fa fa-github faa-pulse animated fa-2x " ></span>\n' +
                '        <span class="fa fa-wrench faa-pulse animated fa-2x" style="padding-left: 20px"></span>\n' +
                '        <span class="fab fa-docker fa-docker fa-2x" style="padding-left: 20px"></span>\n' +
                '    </div>',
            trigger: 'manual',
            animation: 'none',
            animateFill: false,
            arrow: true,
            placement: 'top',
            hideOnClick: false,
            multiple: false,
            theme: 'honeybee',
            sticky: true
        });
    };
    if (lastProgressTipOnTop) {
        lastProgressTipOnTop.hide();
    }
    lastProgressTipOnTop = makeProgressTip(node);
    lastProgressTipOnTop.show();
}

function updateBuildingProcessToolTip() {

}


function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('/fullduplex');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/ConsoleLogs', function (greeting) {
            // showConsoleLog(greeting.body);
        });
        stompClient.subscribe('/topic/StatusUpdate', function (stausMsg) {
            //  var parse = JSON.parse( stausMsg.toString() );
            animate(JSON.parse(stausMsg.body).id);
            // AVeryComplecatedSectionTODO(greeting.body);
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.send("/app/hello", {}, JSON.stringify({'name': 'Abhirms'}));
}

function showConsoleLog(message) {
    toastr.info(message);

    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

function showHideOutcome(value) {
    if (value === 'tag' || value === 'Any branch') {
        $('#outcome').show();
    } else {
        $('#outcome').hide();
    }

}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $("#connect").click(function () {
        connect();
    });
    $("#disconnect").click(function () {
        disconnect();
    });
    $("#send").click(function () {
        sendName();
    });
});
