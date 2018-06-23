(() => {
    const lz4 = require('lz4'),
        Buffer = require('buffer').Buffer;
    window.joinRoom = ip => {
        socket = new NetSocket(ip);
    }
    window.toggleLoading = () => {
        if ($("#spinner")[0].style.display === "" || $("#spinner")[0].style.display === "none") {
            // menu is present
            $(".menu").fadeOut(100, () => {
                $("#spinner").fadeIn(100);
            });
        } else {
            $("#spinner").fadeOut(100, () => {
                $(".menu").fadeIn(100);
            });
        }
    }
    window.hideMenu = () => {
        $("#overlay").fadeOut(100);
        $("#menu-holder").fadeOut(100);
        $("#hud").fadeIn(150);
        let i = 0;
        for (const tid in territories) {
            ++i;
            setTimeout(tid => {
                fadeSpriteIn(territories[tid].sprite);
            }, (i * 10), tid);
        }
    }
    window.setElmState = (id, state) => {
        if (state) {
            $("#" + id).show();
        } else {
            $("#" + id).hide();
        }
    }
    window.setStatus = (txt) => {
        $("#status").text(txt);
    }
    window.countTroops = id => {
        let troops = 0;
        for (let tid in territories) {
            let t = territories[tid];
            if (t.ownerId == id) {
                troops += t.troops;
            }
        }
        return troops;
    }
    window.updateHud = () => {
        $("#troops").text(newTroops || 'n/a');
    }
    window.territories = {
        0: {
            name: "alaska",
            url: "assets/alaska.png",
            mapX: 66,
            mapY: 193,
            connections: [1, 3, 29],
            txtX: 143.5,
            txtY: 241.5
        },
        1: {
            name: "northwest territory",
            url: "assets/northwest_territory.png",
            mapX: 204,
            mapY: 57,
            connections: [0, 3, 4, 5, 2],
            txtX: 338,
            txtY: 250
        },
        2: {
            name: "greenland",
            url: "assets/greenland.png",
            mapX: 564,
            mapY: 52,
            connections: [1, 5, 19],
            txtX: 727,
            txtY: 142.5
        },
        3: {
            name: "alberta",
            url: "assets/alberta.png",
            mapX: 218,
            mapY: 290,
            connections: [0, 1, 4, 6],
            txtX: 328.5,
            txtY: 319.5
        },
        4: {
            name: "ontario",
            url: "assets/ontario.png",
            mapX: 402,
            mapY: 290,
            connections: [1, 5, 3, 7],
            txtX: 451.5,
            txtY: 330.5
        },
        5: {
            name: "quebec",
            url: "assets/quebec.png",
            mapX: 528,
            mapY: 272,
            connections: [1, 2, 4, 7],
            txtX: 568,
            txtY: 330
        },
        6: {
            name: "west us",
            url: "assets/west_us.png",
            mapX: 291,
            mapY: 371,
            connections: [3, 7, 8, 4],
            txtX: 346,
            txtY: 411
        },
        7: {
            name: "east us",
            url: "assets/east_us.png",
            mapX: 387,
            mapY: 369,
            connections: [8, 6, 5, 4],
            txtX: 471.5,
            txtY: 435.5
        },
        8: {
            name: "central america",
            url: "assets/central_america.png",
            mapX: 333,
            mapY: 475,
            connections: [6, 7, 9],
            txtX: 401,
            txtY: 513
        },
        9: {
            name: "venezuela",
            url: "assets/venezuela.png",
            mapX: 520,
            mapY: 585,
            connections: [8, 10, 11],
            txtX: 568,
            txtY: 614
        },
        10: {
            name: "brazil",
            url: "assets/brazil.png",
            mapX: 560,
            mapY: 622,
            connections: [9, 11, 12, 13],
            txtX: 670.5,
            txtY: 704.5
        },
        11: {
            name: "peru",
            url: "assets/peru.png",
            mapX: 517,
            mapY: 654,
            connections: [9, 10, 12],
            txtX: 574.5,
            txtY: 719.5
        },
        12: {
            name: "argentina",
            url: "assets/argentina.png",
            mapX: 548,
            mapY: 745,
            connections: [10, 11],
            txtX: 603.5,
            txtY: 814.5
        },
        13: {
            name: "north africa",
            url: "assets/north_africa.png",
            mapX: 854,
            mapY: 446,
            connections: [10, 14, 15, 16, 24],
            txtX: 947.5,
            txtY: 549.5
        },
        14: {
            name: "egypt",
            url: "assets/egypt.png",
            mapX: 994,
            mapY: 472,
            connections: [13, 16, 31, 25],
            txtX: 1058.5,
            txtY: 498.5
        },
        15: {
            name: "central africa",
            url: "assets/congo.png",
            mapX: 994,
            mapY: 596,
            connections: [13, 16, 17],
            txtX: 1052.5,
            txtY: 648.5
        },
        16: {
            name: "east africa",
            url: "assets/east_africa.png",
            mapX: 1063,
            mapY: 532,
            connections: [17, 18, 15, 14],
            txtX: 1126,
            txtY: 607
        },
        17: {
            name: "south africa",
            url: "assets/south_africa.png",
            mapX: 1007,
            mapY: 684,
            connections: [15, 16, 18],
            txtX: 1066.5,
            txtY: 762.5
        },
        18: {
            name: "madagascar",
            url: "assets/madagascar.png",
            mapX: 1174,
            mapY: 719,
            connections: [17, 16],
            txtX: 1186,
            txtY: 751
        },
        19: {
            name: "iceland",
            url: "assets/iceland.png",
            mapX: 819,
            mapY: 240,
            connections: [2, 22],
            txtX: 837.5,
            txtY: 245.5
        },
        20: {
            name: "scandanavia",
            url: "assets/scandanavia.png",
            mapX: 972,
            mapY: 195,
            connections: [22, 21, 23],
            txtX: 999.5,
            txtY: 271.5
        },
        21: {
            name: "russia",
            url: "assets/russia.png",
            mapX: 1055,
            mapY: 208,
            connections: [20, 23, 25, 31, 30, 26],
            txtX: 1130,
            txtY: 332
        },
        22: {
            name: "uk",
            url: "assets/uk.png",
            mapX: 892,
            mapY: 304,
            connections: [23, 24, 20, 19],
            txtX: 915,
            txtY: 331
        },
        23: {
            name: "north europe",
            url: "assets/north_eu.png",
            mapX: 960,
            mapY: 314,
            connections: [22, 25, 20, 21, 24],
            txtX: 1012,
            txtY: 348
        },
        24: {
            name: "west europe",
            url: "assets/west_eu.png",
            mapX: 900,
            mapY: 359,
            connections: [22, 23, 25, 13],
            txtX: 918.5,
            txtY: 422.5
        },
        25: {
            name: "south europe",
            url: "assets/south_eu.png",
            mapX: 979,
            mapY: 374,
            connections: [14, 31, 23, 24, 21],
            txtX: 1051,
            txtY: 390
        },
        26: {
            name: "ural",
            url: "assets/ural.png",
            mapX: 1216,
            mapY: 172,
            connections: [21, 30, 33, 27],
            txtX: 1290.5,
            txtY: 276.5
        },
        27: {
            name: "siberia",
            url: "assets/siberia.png",
            mapX: 1343,
            mapY: 128,
            connections: [26, 28, 36, 35, 33],
            txtX: 1433.5,
            txtY: 252.5
        },
        28: {
            name: "yakutsk",
            url: "assets/yakutsk.png",
            mapX: 1504,
            mapY: 170,
            connections: [27, 36, 29],
            txtX: 1591,
            txtY: 230
        },
        29: {
            name: "kamchatka",
            url: "assets/kamchatka.png",
            mapX: 1633,
            mapY: 181,
            connections: [0, 36, 28, 35, 34],
            txtX: 1772.5,
            txtY: 237.5
        },
        30: {
            name: "afghanistan",
            url: "assets/afghanistan.png",
            mapX: 1194,
            mapY: 326,
            connections: [21, 26, 31, 32, 33],
            txtX: 1283.5,
            txtY: 390.5
        },
        31: {
            name: "middle east",
            url: "assets/middle_east.png",
            mapX: 1083,
            mapY: 417,
            connections: [21, 25, 14, 32, 30, 16],
            txtX: 1186,
            txtY: 460
        },
        32: {
            name: "india",
            url: "assets/india.png",
            mapX: 1269,
            mapY: 448,
            connections: [31, 30, 33, 37],
            txtX: 1344,
            txtY: 508
        },
        33: {
            name: "china",
            url: "assets/china.png",
            mapX: 1336,
            mapY: 373,
            connections: [37, 32, 30, 26, 27, 35],
            txtX: 1449,
            txtY: 451
        },
        34: {
            name: "japan",
            url: "assets/japan.png",
            mapX: 1628,
            mapY: 340,
            connections: [29, 35],
            txtX: 1671,
            txtY: 443
        },
        35: {
            name: "mongolia",
            url: "assets/mongolia.png",
            mapX: 1421,
            mapY: 339,
            connections: [34, 29, 36, 27, 33],
            txtX: 1529,
            txtY: 382
        },
        36: {
            name: "irtusk",
            url: "assets/irtusk.png",
            mapX: 1452,
            mapY: 253,
            connections: [35, 29, 28, 27],
            txtX: 1525,
            txtY: 323
        },
        37: {
            name: "siam",
            url: "assets/siam.png",
            mapX: 1422,
            mapY: 500,
            connections: [32, 33, 38],
            txtX: 1478.5,
            txtY: 563.5
        },
        38: {
            name: "indonesia",
            url: "assets/indonesia.png",
            mapX: 1448,
            mapY: 616,
            connections: [37, 39, 40],
            txtX: 1538,
            txtY: 646
        },
        39: {
            name: "new guinea",
            url: "assets/new_guinea.png",
            mapX: 1640,
            mapY: 655,
            connections: [38, 40, 41],
            txtX: 1686,
            txtY: 675
        },
        40: {
            name: "west australia",
            url: "assets/west_au.png",
            mapX: 1540,
            mapY: 713,
            connections: [38, 41, 39],
            txtX: 1595.5,
            txtY: 782.5
        },
        41: {
            name: "east australia",
            url: "assets/east_au.png",
            mapX: 1660,
            mapY: 712,
            connections: [40, 39],
            txtX: 1709,
            txtY: 797
        }
    };
    let playerColorMap = {
        0: '0xcc0000',
        1: '0x2eb82e',
        2: '0x0000cc',
        3: '0xcccc00',
        4: '0xe600ac'
    }
    // line class
    class Line extends PIXI.Graphics {
        constructor(points, lineSize, lineColor) {
            super();
            
            var s = this.lineWidth = lineSize || 5;
            var c = this.lineColor = lineColor || "0x000000";
            
            this.points = points;
    
            this.lineStyle(s, c)
    
            this.moveTo(points[0], points[1]);
            this.lineTo(points[2], points[3]);
        }
        updatePoints(p) {
            var points = this.points = p.map((val, index) => val || this.points[index]);
            var s = this.lineWidth, c = this.lineColor;
            this.clear();
            this.lineStyle(s, c);
            this.moveTo(points[0], points[1]);
            this.lineTo(points[2], points[3]);
        }
    }
    const CONN_COLOR = "0xFFFFFF",
        CONN_CIRCLE_RADIUS = 2;
    let drawConnection = (startX, startY, endX, endY, color = CONN_COLOR) => {
        let line = new Line([endX, endY, startX, startY], 1, color);
        
        let c1 = new PIXI.Graphics();
        c1.beginFill(parseInt(CONN_COLOR));
        c1.drawCircle(startX - (CONN_CIRCLE_RADIUS - 1), startY - (CONN_CIRCLE_RADIUS - 2), CONN_CIRCLE_RADIUS);
        c1.endFill();
        
        let c2 = new PIXI.Graphics();
        c2.beginFill(parseInt(CONN_COLOR));
        c2.drawCircle(endX + (CONN_CIRCLE_RADIUS - 1), endY + (CONN_CIRCLE_RADIUS - 2), CONN_CIRCLE_RADIUS);
        c2.endFill();
        
        view.addChild(line);
        view.addChild(c1);
        view.addChild(c2);
    }
    // net
    class NetSocket extends EventEmitter {
        constructor(address) {
            super();
            let me = this;
            this.ws = new WebSocket(address);
            this.ws.binaryType = 'arraybuffer';
            this.ip = address;
            this.ws.onopen = () => {
                me.emit('open');
            }
            this.ws.onclose = () => {
                me.emit('close');
            }
            this.ws.onmessage = msgEvent => {
                if (typeof msgEvent.data === 'string') {
                    let data = JSON.parse(msgEvent.data);
                    // emit event recieved from socket
                    me.emit(data.e, data.d);
                } else {
                    let buf = new Buffer(msgEvent.data),
                        decompressed = buf.toString('utf8'),
                        mapData = '';
                    for (let i = 0; i < decompressed.length; ++i) {
                        let charCode = decompressed[i];
                        mapData += String.fromCharCode(charCode);
                    }
                    me.emit('map', JSON.parse(mapData));
                }
            }
        }
        send(event, data) {
            let packet = {
                e: event,
                d: data
            }
            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify(packet));
            }
        }
    }
    let Application = PIXI.Application,
        Container = PIXI.Container,
        loader = PIXI.loader,
        resources = PIXI.loader.resources,
        TextureCache = PIXI.utils.TextureCache,
        Sprite = PIXI.Sprite,
        Rectangle = PIXI.Rectangle,
        borders,
        app,
        view,
        isDragging = false,
        socket,
        inGame = false,
        myTurn = false,
        myId = -1,
        selectingTerritory = false,
        newTroops,
        autoSelect = true,
        reinforcing = false,
        attacking = false,
        moving = false;
    let send = (evt, data) => {
        if (!socket || socket.ws.readyState !== WebSocket.OPEN) {
            throw new Error('failed to send data');
        }
        socket.send(evt, data);
    }
    let chainload = () => {
        return loader.add("assets/borders_bw.png").add("assets/afghanistan.png").add("assets/alaska.png").add("assets/alberta.png").add("assets/argentina.png").add("assets/brazil.png").add("assets/central_america.png").add("assets/china.png").add("assets/congo.png").add("assets/east_africa.png").add("assets/east_au.png").add("assets/east_us.png").add("assets/egypt.png").add("assets/greenland.png").add("assets/iceland.png").add("assets/irtusk.png").add("assets/india.png").add("assets/indonesia.png").add("assets/japan.png").add("assets/kamchatka.png").add("assets/madagascar.png").add("assets/middle_east.png").add("assets/mongolia.png").add("assets/new_guinea.png").add("assets/north_africa.png").add("assets/north_eu.png").add("assets/northwest_territory.png").add("assets/ontario.png").add("assets/peru.png").add("assets/quebec.png").add("assets/russia.png").add("assets/scandanavia.png").add("assets/siam.png").add("assets/siberia.png").add("assets/south_africa.png").add("assets/south_eu.png").add("assets/uk.png").add("assets/ural.png").add("assets/venezuela.png").add("assets/west_au.png").add("assets/west_eu.png").add("assets/west_us.png").add("assets/yakutsk.png");
    }
    let highlight = (t, color) => {
        t.sprite.filters = [new PIXI.filters.GlowFilter(30, 2, 1, parseInt(color), 0.5)];
    },
    unhighlight = t => t.sprite.filters = [],
    territoryMouseDown = tid => {
        let t = territories[tid];
        if (isDragging) return;
        if (selectingTerritory) {
            send('selectionChoice', tid);
        } else if (reinforcing) {
            send('place', tid);
            if (newTroops >= 0) newTroops--;
        } else if (attacking == 'source') {
            send('atk_src', tid);
            setStatus('select attack destination');
            $("#br-button").text('cancel attack');
            attacking = 'dest';
        } else if (attacking == 'dest') {
            send('atk_dst', tid);
            setStatus('select attack source');
            attacking = 'source';
            $("#br-button").text('end attack');
        }
    },
    startAttack = () => {
        reinforcing = false;
        attacking = 'source';
        setStatus('select attack source');
        $("#br-button").text('end attack');
        $("#br-button").fadeIn(350);
    },
    endAttack = () => {
        attacking = false;
        setStatus('select move source');
        $("#br-button").text('end turn');
    },
    updateSprites = () => {
        for (const tid in window.territories) {
            let t  = territories[tid];
            if ((t.ownerId || t.ownerId === 0) && t.ownerId !== -1) {
                t.sprite.tint = playerColorMap[t.ownerId];
            }
            if (t.troops > 0) {
                t.txt.visible = true;
                t.txt.text = t.troops;
            } else {
                t.txt.visible = false;
            }
        }
    },
    fadeSpriteIn = (spr) => {
        let intv = setInterval(() => {
            if (spr.alpha == 1) {
                clearInterval(intv);
                return;
            }
            spr.alpha += 0.005;
        }, 2.5);
    },
    init = () => {
        joinRoom('ws://mcanalley.io:8080');
        // create and setup app
        app = new PIXI.Application({ 
            width: window.innerWidth, 
            height: window.innerHeight,
            antialiasing: true, 
            transparent: false, 
            resolution: 1
        });
        app.view.id = "view";
        app.renderer.view.style.position = "absolute";
        app.renderer.view.style.width = window.innerWidth + "px";
        app.renderer.view.style.height = window.innerHeight + "px";
        app.renderer.view.style.display = "block";
        document.getElementById('game-container').appendChild(app.view);
        
        // create viewport
        view = new PIXI.extras.Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: 1920,
            worldHeight: 1080
        });
        app.stage.addChild(view);
        view
            .drag({
                clampWheel: true
            })
            .wheel()
            .pinch()
            .bounce()
            .fitWorld()
            .clampZoom({
                minWidth: 400,
                minHeight: 400,
                maxWidth: 2500,
                maxHeight: 2500
            })
            .decelerate();
        view.on('drag-start', () => {
            isDragging = true;
        }).on('drag-end', () => {
            isDragging = false;
        });
        
        app.renderer.resize(window.innerWidth, window.innerHeight);
        view.resize(window.innerWidth, window.innerHeight, 1920, 1080);
        
        // chainload all the assets
        chainload()
            .load(postLoad);
        // dom handlers
        $("#join").click(e => {
            let name = $("#name").val();
            send('join', name);
        });
        $("#br-button").click(e => {
            if (attacking == 'source') {
                send('end_atk_turn', 0);
                endAttack();
            } else if (attacking == 'dest') {
                send('cancel_atk', 0);
                $("#br-button").text('end attack');
                setStatus('select attack source');
                attacking = 'source';
            } else if (moving) {
                send('endTurn', 0);
            }
        });
        // net
        socket.on('joined', () => {
            console.log('waiting for game to start');
            toggleLoading();
        }).on('started', id => {
            console.log('game started!');
            toggleLoading();
            hideMenu();
            myId = id;
        }).on('select', () => {
            console.log('my turn to choose a territory');
            selectingTerritory = true;
            setStatus('select a territory');
            if (autoSelect) {
                for (let tid in territories) {
                    let t = territories[tid];
                    if (!((t.ownerId || t.ownerId === 0) && t.ownerId !== -1)) {
                        send('selectionChoice', tid);
                    }
                }
            }
        }).on('selectEnd', () => {
            console.log('my turn to choose a territory is over');
            setStatus('please wait...');
            selectingTerritory = false;
        }).on('map', mapState => {
            mapState = JSON.parse(mapState);
            // update map state
            for (const tid in mapState) {
                let tstate = mapState[tid];
                territories[tid].troops = tstate.troops;
                territories[tid].ownerId = tstate.owner;
                updateSprites();
            }
            updateHud();
        }).on('phase', phase => {
            $('#phase').text(phase);
            if (phase == 'attack') {
                startAttack();
            }
        }).on('newTroops', _newTroops => {
            newTroops = _newTroops;
            console.log('my turn to place new troops');
            reinforcing = true;
            setStatus('select to reinforce');
        });
    }
    let postLoad = () => {
        // add borders
        /*
        let borderTexture = TextureCache["assets/borders_bw.png"];
        let rect = new Rectangle(0, 0, 2000, 997);
        borderTexture.frame = rect;
        borders = new Sprite(borderTexture);
        borders.x = 0;
        borders.y = 0;
        borders.alpha = 0.15;
        view.addChild(borders);
        */
        
        // render each territory
        for (let i = 0; i < Object.keys(territories).length; ++i) {
            // render the sprite of the territory
            let t = territories[i];
            t.tx = TextureCache[t.url];
            t.sprite = new Sprite(t.tx);
            t.sprite.x = t.mapX;
            t.sprite.y = t.mapY;
            t.sprite.interactive = true;
            t.sprite.buttonMode = true;
            // t.sprite.anchor.set(0.5, 0.5);
            if (!t.color) {
                t.sprite.tint = 0xFFFFFF;
                t.sprite.alpha = 0.1;
            }
            view.addChild(t.sprite);
            t.sprite.on('pointerdown', territoryMouseDown.bind(t.sprite, i));
            
            // render it's name
            t.txt = new PIXI.Text('0', {
                fontFamily: 'Ubuntu',
                fontSize: 15,
                fill: 0xeeeeee,
                align: 'center',
                stroke: 'black',
                strokeThickness: 2
            });
            t.txt.x = t.txtX;
            t.txt.y = t.txtY;
            t.txt.visible = 0;
            // t.txt.visible = false;
            view.addChild(t.txt);
        }
    }
    window.addEventListener('load', init.bind(window));
    window.addEventListener('resize', () => {
        app.renderer.view.style.width = window.innerWidth + "px";
        app.renderer.view.style.height = window.innerHeight + "px";
        app.renderer.resize(window.innerWidth, window.innerHeight);
        view.resize(window.innerWidth, window.innerHeight, 1920, 1080);
    });
})();