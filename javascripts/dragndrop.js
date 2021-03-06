function initDragNDrop(num) {
    $('.draggable').remove();
    $('.dropzone').remove();
    
    // dropzoneAnswers 초기화
    while (dropzoneAnswers.length) { dropzoneAnswers.pop(); }
    showAnswers();
    
    for (i = 0; i < num; i++) {
        $('.dragzone-wrapper').append("<div id='drag" + (i + 1) + "' class='draggable js-drag'><img src='./images/a.png'/></div>");
        $('.dropzone-wrapper').append("<div id='drop" + (i + 1) + "' class='dropzone js-drop'><img src='./images/b.png'/></div>");
    }

    var dragObjList = $('.draggable');
    var dropzoneObjList = $('.dropzone');
    // setupDropzone에 받을 Draggable obj id가 들어간 list
    // var draggableIdList = new Array(dragObjList.length);
    // for (i = 0; i < dragObjList.length; i++) {
    //     draggableIdList[i] = '#' + dragObjList[i].id;
    // }

    (function (interact) {

        'use strict';

        var position = {};
        var index = 0;

        // setup draggable elements.
        interact('.js-drag')
            .draggable(true)
            .on('dragstart', function (event) {
                position.x = parseInt(event.target.dataset.x, 10) || 0;
                position.y = parseInt(event.target.dataset.y, 10) || 0;
            })
            .on('dragmove', function (event) {
                position.x += event.dx;
                position.y += event.dy;

                event.target.dataset.x = position.x;
                event.target.dataset.y = position.y;
                event.target.style.webkitTransform = event.target.style.transform = 'translate(' + position.x + 'px, ' + position.y + 'px)';
            });

        // setup drop areas.
        // drag obj and drop obj 1:N으로 매칭이 가능
        for (var i in dropzoneObjList) {
            console.log('#' + dropzoneObjList[i].id);
            // Dropzone은 반드시 id selector가 들어가야함. '#drop1'
            // Draggable은 상관없음.
            setupDropzone('#' + dropzoneObjList[i].id, dragObjList);
        }

        /**
         * Setup a given element as a dropzone.
         *
         * @param {HTMLElement|String} el
         * @param {String} accept
         */
        function setupDropzone(el, accept) {
            interact(el)
                .dropzone({
                    accept: accept,
                    ondropactivate: function (event) {
                        event.relatedTarget.classList.add('-drop-possible');
                    },
                    ondropdeactivate: function (event) {
                        event.relatedTarget.classList.remove('-drop-possible');
                    }
                })
                .on('dropactivate', function (event) {
                    if (event.target.classList.contains('-drop-end')) return;

                    console.log('activate', event);
                    event.target.classList.add('-drop-possible');
                    // event.target.textContent = 'Drop me here! #' + event.target.id;
                })
                .on('dropdeactivate', function (event) {
                    if (dropzoneAnswers.indexOf(event.relatedTarget.id) == -1) {
                        // Dropzone에 안착하지 못 하면 원위치 한다.
                        goBackOriginalPostion(event.relatedTarget);
                    }
                    console.log('deactivate', event);
                    event.target.classList.remove('-drop-possible');
                    // event.target.textContent = 'Dropzone #' + event.target.id;
                })
                .on('dragenter', function (event) {
                    console.log('dragenter', event);
                    event.target.classList.add('-drop-over');
                    // event.relatedTarget.textContent = 'I\'m in. #' + event.relatedTarget.id;
                })
                .on('dragleave', function (event) {
                    console.log('dragleave', event);
                    event.target.classList.remove('-drop-over');
                    // event.relatedTarget.textContent = 'Drag me… #' + event.relatedTarget.id;
                    // 여기서 지우니까 안 되네... TODO 아래코드 위치 변경 필요함.
                    event.target.classList.remove('-drop-end');
                    // 나갈 때 배열에 있는 자기를 제거해야함.
                    dropzoneAnswers[dropzoneAnswers.indexOf(event.relatedTarget.id)] = '';
                    showAnswers();
                })
                .on('drop', function (event) {
                    console.log('drop', event);

                    // Dropzone에 이미 있으면 이전 dragObj는 원위치 시킨다.
                    var exRelatedTargetId = saveDraggableId(event.target.id, event.relatedTarget.id);
                    if (exRelatedTargetId && exRelatedTargetId != event.relatedTarget.id) {
                        console.log("EX-Related Target ID : " + exRelatedTargetId);
                        var exRelatedTarget = $('#' + exRelatedTargetId)[0];
                        // exRelatedTarget.textContent = 'Drag me… #' + exRelatedTarget.id; 

                        goBackOriginalPostion(exRelatedTarget);
                    }

                    event.target.classList.remove('-drop-over');
                    // event.relatedTarget.textContent = 'Dropped #' + event.relatedTarget.id;
                    
                    console.log(dropzoneAnswers);

                    showAnswers();
                });
        }

    }(window.interact));
}