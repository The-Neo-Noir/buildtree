function httpGetNoWindow(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, true); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, true); // false for synchronous request
    xmlHttp.send(null);
    window.open(theUrl, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=1000,height=1200");
    return xmlHttp.responseText;
}

function buildToolsTips(cy) {


    var makeProgressTip = function (node, text) {
        return tippy(node.popperRef(), {
            content: function () {
                var div = document.createElement('div');

                div.innerHTML = text;

                return div;
            },
            trigger: 'manual',
            animation: 'none',
            animateFill: false,
            arrow: false,
            placement: 'bottom',
            hideOnClick: false,
            multiple: false,
            theme: 'honeybee',
            sticky: true
        });
    };
    var makeTippy = function (node, text) {
        return tippy(node.popperRef(), {
            content: function () {
                var div = document.createElement('div');

                div.innerHTML = text;

                return div;
            },
            trigger: 'manual',
            animation: 'none',
            animateFill: false,
            arrow: false,
            placement: 'bottom',
            hideOnClick: false,
            multiple: false,
            theme: 'honeybee',
            sticky: true
        });
    };
    var mapOfToolTips = {};
    cy.nodes().forEach(function (a) {
        console.log(a);
        mapOfToolTips[String(a.data().id)] = makeTippy(a, a.data().id);
    });
    cy.on('mouseover', 'node', function (evt) {
        evt.preventDefault();
        mapOfToolTips[evt.target.data().id].show();

    });
    cy.on('mouseout', 'node', function (evt) {
        evt.preventDefault();
        mapOfToolTips[evt.target.data().id].hide();
    });
}

var currentPathSelected = [];

function tracePath(path) {
    currentPathSelected = [];
    currentPathSelected.push(path.data());
    var node = path.successors();
    if (lastSelectedPath && lastNode) {
        for (var j = 0; j < lastSelectedPath.length; j++) {
            lastSelectedPath[j].removeClass('highlighted');
        }
        lastNode.removeClass('highlighted');
    }
    var i = 0;
    lastSelectedPath = node;
    lastNode = path;
    var highlightNextEle = function () {
        if (i < lastSelectedPath.length) {
            // console.log("executing " + JSON.stringify(lastSelectedPath[i].data().value));
            lastSelectedPath[i].addClass('highlighted');
            if (lastSelectedPath[i].data().source === undefined)
                currentPathSelected.push(lastSelectedPath[i].data());
            i++;
            setTimeout(highlightNextEle, 50);
        }
    };
    path.addClass('highlighted');
    highlightNextEle();

    console.log("Showing current elected path");

    console.log(currentPathSelected);

}
