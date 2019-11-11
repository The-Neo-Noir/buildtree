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



function showHideOutcome(value) {
    if (value === 'tag' || value === 'Any branch') {
        $('#outcome').show();
    } else {
        $('#outcome').hide();
    }
    
}
