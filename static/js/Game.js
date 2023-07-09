/*
    klasa Game
*/

function Game() {
    side = ""

    var init = function () {
        $("#root").empty();
        this.camera = new THREE.PerspectiveCamera(
            45, // kąt patrzenia kamery (FOV - field of view)
            w / h, // proporcje widoku, powinny odpowiadać proporjom naszego ekranu przeglądarki
            0.1, // minimalna renderowana odległość
            10000 // maxymalna renderowana odległość
        );
        var scene = new THREE.Scene();
        var color = new THREE.Color('#b5d1ff');
        scene.background = color
        camera.position.set(600, 600, 600)
        var renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xffffff);
        renderer.setSize(w, h);
        $("#root").append(renderer.domElement);

        var gField = new THREE.BoxGeometry(100, 50, 100);

        var mBField = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('mats/dark.jpg'),
            wireframe: false,
            transparent: false,
        });
        var mBsField = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('mats/sdark.jpg'),
            wireframe: false,
            transparent: false,
        });
        var mWField = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('mats/light.jpg'),
            wireframe: false,
            transparent: false,
        });


        var gPawn = new THREE.CylinderGeometry(45, 45, 20, 32);

        var mBPawn = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('mats/black.jpg'),
            wireframe: false,
            transparent: false
        });

        var mWPawn = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('mats/white.jpg'),
            wireframe: false,
            transparent: false
        });



        var mBsPawn = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('mats/sblack.jpg'),
            wireframe: false,
            transparent: false
        });

        var mWsPawn = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('mats/swhite.jpg'),
            wireframe: false,
            transparent: false
        });

        // Plansza sama w sobie (0 to jasne pole, 1 to ciemne pole)
        var szachownica = [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1]
        ];

        // Umieszczenie pionków na planszy (dobrze żeby się zgadzała z tym co ma serwer)
        // 0 - nic, 1 - biały, 2 - czarny
        var pionki = [
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0]
        ];

        var bField = new THREE.Mesh(gField, mBField);

        var wField = new THREE.Mesh(gField, mWField);

        createBoard()
        loadPawns()

        var raycaster = new THREE.Raycaster()
        var mouseVector = new THREE.Vector2()

        var sPawn = 0 //selected Pawn 

        var hPawn = 0 //highlighted Pawn
        var hField = 0

        // Podświetlanie pionków i pól 
        $("#root").mousemove(function (event) {

            if (hField) {
                hField.material = mBField
                hField = 0
            }
            if (!sPawn) {
                if (side == "white") {
                    hPawn.material = mWPawn
                } else {
                    hPawn.material = mBPawn
                }
            }

            mouseVector.x = (event.clientX / w) * 2 - 1;
            mouseVector.y = -(event.clientY / h) * 2 + 1;

            raycaster.setFromCamera(mouseVector, camera);

            var intersects = raycaster.intersectObjects(scene.children);

            if (intersects.length > 0 && intersects[0].object.type != 'LineSegments') {
                target = intersects[0].object

                // Najechanie na pionka
                if (target.userData.color == side && !sPawn) {
                    hPawn = target
                    if (side == "white") {
                        hPawn.material = mWsPawn
                    } else {
                        hPawn.material = mBsPawn
                    }
                // Najechanie na pole
                } else if (sPawn && target.userData.type == "bField") {
                    //Sprawdź czy ruch jest valid, jeśli tak zakoloruj
                    hField = target
                    dx = hField.userData.x
                    sx = sPawn.userData.x
                    dz = hField.userData.z
                    sz = sPawn.userData.z
                    if (isMoveValid(sx, sz, dx, dz)[0]){
                        hField.material = mBsField
                    }
                }
            }
        })

        // Zaznaczanie pionków i ruch
        $("#root").mousedown(function (event) {

            mouseVector.x = (event.clientX / w) * 2 - 1;
            mouseVector.y = -(event.clientY / h) * 2 + 1;

            raycaster.setFromCamera(mouseVector, camera);

            var intersects = raycaster.intersectObjects(scene.children);

            if (intersects.length > 0 && intersects[0].object.type != 'LineSegments') {
                target = intersects[0].object

                // Zaznaczenie (swojego) pionka
                if (target.userData.color == side) {
                    sPawn = target
                    // Odkoloruj ostatnio zaznaczonego pionka
                    if (side == "white") {
                        hPawn.material = mWPawn
                    } else {
                        hPawn.material = mBPawn
                    }
                    // I pokoloruj nowo zaznaczonego
                    hPawn = target
                    if (side == "white") {
                        hPawn.material = mWsPawn
                    } else {
                        hPawn.material = mBsPawn
                    }

                } else if (sPawn && target.userData.type == "bField") {
                    // Sprawdź czy ruch jest legalny, i czy przy okazji zbijamy
                    var canMove, isCapturing
                    [canMove, isCapturing] = isMoveValid(sPawn.userData.x, sPawn.userData.z, target.userData.x, target.userData.z)
                    if(canMove){
                        // jeśli zbijamy, to podajemy współrzędne zbicia. Jeśli nie, to wysyłamy domyślną (nielegalną) wartość -1
                        var cx = -1
                        var cz = -1
                        if(isCapturing){
                            cx = (sPawn.userData.x + target.userData.x) / 2
                            cz = (sPawn.userData.z + target.userData.z) / 2
                        }
                        net.sendData("MOVE_PAWN", JSON.stringify({ color: side, sxz: [sPawn.userData.x, sPawn.userData.z], dxz: [target.userData.x, target.userData.z], cxz: [cx, cz] }))
                        move(sPawn.userData.x, sPawn.userData.z, target.userData.x, target.userData.z, cx, cz)
                    }
                }

            }

        })

        // Pętla renderowania (60fps)
        function render() {

            requestAnimationFrame(render);

            renderer.render(scene, camera);
            camera.lookAt(scene.position)
        }
        render();

        function createBoard() {
            for (var x = 0; x < szachownica.length; x++) {
                for (var z = 0; z < szachownica[x].length; z++) {
                    if (szachownica[x][z] == 0) {
                        var field = bField.clone()
                        field.userData = { x: x, z: z, type: "bField" }
                        field.position.set(350 - (x * 100), -25, 350 - (z * 100))
                        scene.add(field)
                    } else {
                        var field = wField.clone()
                        field.userData = { x: x, z: z, type: "wField" }
                        field.position.set(350 - (x * 100), -25, 350 - (z * 100))
                        scene.add(field)
                    }


                }
            }
        }

        function loadPawns() {
            for (var x = 0; x < pionki.length; x++) {
                for (var z = 0; z < pionki[x].length; z++) {
                    if (pionki[x][z] == 1) {
                        var pawn = new THREE.Mesh(gPawn, mWPawn);
                        pawn.userData = { x: x, z: z, color: "white", type: "pawn" }
                        pawn.position.set(350 - (x * 100), 10, 350 - (z * 100))
                        scene.add(pawn)
                    } else if (pionki[x][z] == 2) {
                        var pawn = new THREE.Mesh(gPawn, mBPawn);
                        pawn.userData = { x: x, z: z, color: "black", type: "pawn" }
                        pawn.position.set(350 - (x * 100), 10, 350 - (z * 100))
                        scene.add(pawn)
                    }
                }
            }
        }

        // Returns [canMove, isCapturing]
        isMoveValid = function(sx, sz, dx, dz){
            if (pionki[dx][dz] == 0) {
                // białe
                if(pionki[sx][sz] == 1){
                    // poruszanie o jeden
                    if(dx - sx == -1 && (dz - sz == 1 || dz - sz == -1)){
                        return [true, false]
                    }
                    // zbijanie w lewo
                    if(dx - sx == -2 && dz - sz == -2 && pionki[sx-1][sz-1] == 2){
                        return [true, true]
                    }
                    // zbijanie w lewo
                    if(dx - sx == -2 && dz - sz == 2 && pionki[sx-1][sz+1] == 2){
                        return [true, true]
                    }
                }
                // czarne
                else if(pionki[sx][sz] == 2){
                    if(dx - sx == 1 && (dz - sz == 1 || dz - sz == -1)){
                        return [true, false]
                    }
                    if(dx - sx == 2 && dz - sz == -2 && pionki[sx+1][sz-1] == 1){
                        return [true, true]
                    }
                    if(dx - sx == 2 && dz - sz == 2 && pionki[sx+1][sz+1] == 1){
                        return [true, true]
                    }
                }
                return [false, false]
            }
            return [false, false]
        }

        //s - start
        //d - destination
        //c - capture
        move = function (sx, sz, dx, dz, cx, cz) {
            // Zaznaczamy pionka który ma się ruszyć.
            if (sPawn == 0) {
                console.log(sx, sz, dx, dz, cx, cz)
                for (var c = 0; c < scene.children.length; c++) {
                    var my = scene.children[c].userData
                    console.log(my)
                    if (my.x == sx && my.z == sz && my.type == "pawn") {
                        sPawn = scene.children[c]
                        break
                    }
                }
            }
            // Ruszamy
            if (sPawn.userData.color == "white") {
                pionki[dx][dz] = 1
                sPawn.userData.x = dx
                sPawn.userData.z = dz
                pionki[sx][sz] = 0
                sPawn.position.set(350 - (dx * 100), 10, 350 - (dz * 100))
                sPawn.material = mWPawn
                sPawn = 0
            } else if (sPawn.userData.color == "black") {
                pionki[dx][dz] = 2
                sPawn.userData.x = dx
                sPawn.userData.z = dz
                pionki[sx][sz] = 0
                sPawn.position.set(350 - (dx * 100), 10, 350 - (dz * 100))
                sPawn.material = mBPawn
                sPawn = 0
            }
            // Zbijamy
            if (cx != -1 && cz != -1){
                for (var c = 0; c < scene.children.length; c++) {
                    var my = scene.children[c].userData
                    if (my.x == cx && my.z == cz && my.type == "pawn") {
                        console.log("Removing " + my)
                        scene.remove(scene.children[c])
                        pionki[cx][cz] = 0
                        break
                    }
                }
            }

        }

    }

    init();

    this.movePawn = function (sx, sz, dx, dz, cx, cz) {
        move(sx, sz, dx, dz, cx, cz)
    }

    this.setCamera = function (val) {
        camera.position.set(val[0], val[1], val[2])
    }

    this.setPlayer = function (pl) {
        if (pl == "white") {
            side = "white"
            game.setCamera([-1000, 500, 0]);
        } else if (pl == "black") {
            side = "black"
            game.setCamera([1000, 500, 0]);
        }
    }

}