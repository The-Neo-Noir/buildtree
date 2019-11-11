function buildContextMenu(cy) {

    cy.cxtmenu({
        selector: 'node, edge',

        commands: [
            {
                content: '<span class="fa fa-folder-open fa-2x"></span>',
                select: function (ele) {
                    if (ele.data().value.type !== 'infra') {// TODO: only if the service applicable for the path , then only

                        httpGetNoWindow('/path?gitUrl=' +
                            encodeURI(ele.data().value.giturl) + '&version=' +
                            encodeURI(ele.data().value.tag) + '&branch=' +
                            encodeURI(ele.data().value.branch));
                    } else {
                        toastr.info(ele.data().value.service_name + ' is a infra service , don\'t have any source code folder');
                    }
                }
            },
            {
                // deploy ;
                content: '<span class="fa fa-rocket fa-2x"></span>',
                select: function (ele) {
                    var data = currentPathSelected.reverse();
                    $.ajax({
                        type: "POST",
                        url: '/deploy',
                        data: JSON.stringify(data),
                        contentType: 'application/json',
                        dataType: 'json',
                        success: function (data) {
                            console.log("Success");
                        },
                        failure: function (data) {

                        }
                    });


                    //  httpGetNoWindow('http://localhost:3000/docker/deploy?images=' + ele.data().id);
                    console.log('Deploy  action selection : TODO, run node server , the test cases' + ele.data().id);
                }
            },
            {
                content: '<span class="fa fa-flash fa-2x"></span>',
                select: function (ele) {
                    caseName = ele.data().value.giturl.substring(ele.data().value.giturl.lastIndexOf("/") + 1, ele.data().value.giturl.lastIndexOf("."));
                    console.log();
                    httpGet('/newMan?caseName=' + caseName);
                    console.log('Test action selection : TODO, run node server , the test cases');
                }
            },
            {
                content: '<span class="fa fa-info-circle fa-2x"></span>',
                select: function (ele) {
                    $("#wrapper").toggleClass("toggled");

                    console.log('Test action selection : TODO, run node server ,     the test cases');
                }
            },
            {
                content: '<span class="fa fa-heartbeat fa-2x" fa-2x"></span>',
                select: function (ele) {
                    console.log(ele.data().value.giturl);

                }
            },

            {
                content: '<span class="fa fa-github fa-2x"></span>',
                select: function (ele) {
                    if (ele.data().value.type !== 'infra') {// TODO: only if the service applicable for the path , then pnly
                        console.log(ele.data().value.giturl);
                        httpGet(ele.data().value.giturl);
                        console.log('Test action selection : TODO, run node server , the test cases');
                    } else {
                        toastr.info(ele.data().value.service_name + ' is a infra service , don\'t have any git repository');
                    }
                }
            }
        ]
    });

    cy.cxtmenu({
        selector: 'core',

        commands: [
            {
                content: 'null',
                select: function () {
                    sendName();
                    console.log('null');
                }
            },

            {
                content: 'add',
                select: function () {
                    $('#myModal').modal();
                    console.log('adding a node');
                }
            }
        ]
    });
}


var masterdata =
    {
        'TMS': {
            parent: 'tms',
            sn: 'tms',
            service_name: 'tenant-management-service',
            giturl: 'http://10.201.39.34/git/Base3x/tms.git',
            type: 'service',
            build_location: 'tms-core'
        },
        'GEMS': {
            parent: 'gems',
            sn: 'gems',
            service_name: 'global-ecosystem-management-system',
            giturl: 'http://10.201.39.34/git/Base3x/global-ecosystem-management-service.git',
            type: 'service',
            build_location: ''
        },
        'RBAC': {
            parent: 'rbac',
            sn: 'rbac',
            service_name: 'rbacl-auth-server',
            giturl: 'http://10.201.39.34/git/Base3x/rbacl-auth-server.git',
            type: 'service',
            build_location: ''
        },
        'FLW': {
            parent: 'flw',
            sn: 'fwr',
            service_name: 'flowable-rest',
            giturl: 'http://10.201.39.34/git/Base3x/flowable-listener.git',
            type: 'service',
            build_location: ''
        },
        'PS': {
            parent: 'ps',
            sn: 'ps',
            service_name: 'process-services',
            giturl: 'http://10.201.39.34/git/Base3x/process-services.git',
            type: 'service',
            build_location: ''
        },
        'QRS': {
            parent: 'qrs',
            sn: 'qrs',
            service_name: 'Queue-Services',
            giturl: 'http://10.201.39.34/git/Base3x/qrs.git',
            type: 'service',
            build_location: ''
        },
        'FUSE': {
            parent: 'fuse',
            sn: 'fuse',
            service_name: 'fuse-gateway',
            giturl: 'http://10.201.39.34/git/Base3x/fuse-gateway.git',
            type: 'service',
            build_location: ''
        },
        'B3X': {
            sn: 'b3x',
            parent: 'b3x',
            service_name: 'base-IDE',
            giturl: 'http://10.201.39.34/git/Base3x/Base-IDE.git',
            type: 'service',
            env_data:"RBACLAUTH_URL=http://rbacl-auth-server:8070;AUDIT_SERVER_URL=http://spotify-kafka-base3x:2181;GEMS_URL=http://global-ecosystem-management-service:8084;PSQL_URL=http://postgres-base3x:5432;PROCESS_SERVICE_URL=http://process-services:8088;GATEWAY_URL=http://fuse-gateway:8280;QRS_URL=http://qrs:8082",
            build_location: ''
        }
    };
var returns;

function modalWork(obj) {
    if (obj.id === 'modal-done') {
        if (eh === undefined) {
            eh = cy.edgehandles();
        }
        var serviceType = $('#service_type');
        var obj = eval('masterdata.' + serviceType.val());

        if ($('#branch_type').val() === 'Any branch') {
            subPart = $('#outcome').val;
        } else {
            subPart = $('#branch_type').val();
        }
        var id = $('#service_type').val() + '-' + subPart;

        var current = {
            group: 'nodes',
            data: {
                id: id,
                parent: obj.parent,
                value: {
                    sn: obj.sn,

                    service_name: obj.service_name,
                    tag: $('#outcome').val(),
                    giturl: obj.giturl,
                    branch: $('#branch_type').val(),
                    type: obj.type,
		    env_data: obj.env_data,
                    build_location: obj.build_location
                }
            },
            position: {
                x: 50 + cy.$('#' + obj.parent).position().x,
                y: cy.$('#' + obj.parent).position().y
            },
            selected: true
        };
        if (cy.$('$#' + current.data.id).length == 1) {
            alert("Node already exists, choose another");
            return;
        }
        returns = cy.add(current);
        cy.$(id).trigger('tap');//.json({ selected: true });
        eh.start(cy.$('node:selected'));
        $.ajaxSetup({
            'beforeSend': function (xhr) {
                xhr.overrideMimeType('application/json; charset=utf-8');
            },
        });
        cy.on('ehcomplete', function (event, sourceNode, targetNode, addedEles) {
            nodeData = sourceNode.json().data;
            edgeData = addedEles.json().data;
            $.ajax({
                type: 'POST',
                url: '/save/',
                data: JSON.stringify({"nodes": [{"data": nodeData}], "edges": [{"data": edgeData}]}),
                success: function (data) {
                    alert('Success');
                },
                contentType: "application/json",
                dataType: 'json'
            });
            eh.destroy();

        });

        $('#myModal').modal('hide');
        buildToolsTips();
    } else {
        $('#myModal').modal('hide');
    }
}
