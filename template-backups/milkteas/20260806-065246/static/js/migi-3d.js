(function () {
    "use strict";

    function initNavigation() {
        var navigation = document.getElementById("navigation");
        if (!navigation) {
            return;
        }

        function updateStickyState() {
            if (window.scrollY > 28) {
                navigation.classList.add("is-sticky");
            } else {
                navigation.classList.remove("is-sticky");
            }
        }

        updateStickyState();
        window.addEventListener("scroll", updateStickyState, { passive: true });

        var navLinks = navigation.querySelectorAll(".nav-link");
        navLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                var collapse = document.getElementById("navbarCollapse");
                if (collapse && collapse.classList.contains("show") && window.bootstrap) {
                    window.bootstrap.Collapse.getOrCreateInstance(collapse).hide();
                }
            });
        });
    }

    function initPandaScene() {
        var mount = document.getElementById("migi3d-scene");
        if (!mount || !window.THREE) {
            if (mount) {
                mount.classList.add("migi-3d-unavailable");
            }
            return;
        }

        var THREE = window.THREE;
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
        var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
        var clock = new THREE.Clock();
        var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setClearColor(0x000000, 0);
        if (renderer.outputEncoding !== undefined && THREE.sRGBEncoding !== undefined) {
            renderer.outputEncoding = THREE.sRGBEncoding;
        }
        mount.appendChild(renderer.domElement);

        camera.position.set(0.4, 2.2, 8.2);

        scene.add(new THREE.HemisphereLight(0xfff3de, 0x1b2b3a, 1.15));
        var keyLight = new THREE.DirectionalLight(0xfff0c7, 1.9);
        keyLight.position.set(4, 7, 6);
        scene.add(keyLight);
        var redLight = new THREE.PointLight(0xff5d4e, 1.4, 10);
        redLight.position.set(-4.4, 2.4, 2.4);
        scene.add(redLight);
        var jadeLight = new THREE.PointLight(0x3ddc97, 1.0, 9);
        jadeLight.position.set(4.4, 1.4, 2.2);
        scene.add(jadeLight);

        var root = new THREE.Group();
        root.position.set(2.05, -0.1, 0);
        scene.add(root);

        var matWhite = new THREE.MeshStandardMaterial({ color: 0xfff8ea, roughness: 0.64, metalness: 0.02 });
        var matBlack = new THREE.MeshStandardMaterial({ color: 0x101317, roughness: 0.5, metalness: 0.02 });
        var matRed = new THREE.MeshStandardMaterial({ color: 0x9d1f20, roughness: 0.42, metalness: 0.05 });
        var matGold = new THREE.MeshStandardMaterial({ color: 0xf4b941, roughness: 0.38, metalness: 0.12 });
        var matNoodle = new THREE.MeshStandardMaterial({ color: 0xf5c36a, roughness: 0.78, metalness: 0 });
        var matBroth = new THREE.MeshStandardMaterial({ color: 0xb65b2e, roughness: 0.25, metalness: 0.04, transparent: true, opacity: 0.88 });
        var matWood = new THREE.MeshStandardMaterial({ color: 0x8d4b25, roughness: 0.55, metalness: 0 });
        var matSteam = new THREE.MeshBasicMaterial({ color: 0xf9fbff, transparent: true, opacity: 0.34 });

        function mesh(geometry, material, position, scale) {
            var item = new THREE.Mesh(geometry, material);
            item.position.copy(position);
            if (scale) {
                item.scale.copy(scale);
            }
            return item;
        }

        function addSphere(parent, radius, material, position, scale) {
            var item = mesh(new THREE.SphereGeometry(radius, 32, 24), material, position, scale);
            parent.add(item);
            return item;
        }

        function cylinderBetween(start, end, radius, material, segments) {
            var direction = new THREE.Vector3().subVectors(end, start);
            var length = direction.length();
            var geometry = new THREE.CylinderGeometry(radius, radius, length, segments || 16);
            var item = new THREE.Mesh(geometry, material);
            item.position.copy(start).add(end).multiplyScalar(0.5);
            item.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
            return item;
        }

        var panda = new THREE.Group();
        panda.position.set(-0.34, 0.12, -0.35);
        root.add(panda);

        addSphere(panda, 1.02, matWhite, new THREE.Vector3(0, -0.18, 0), new THREE.Vector3(1, 1.06, .82));
        addSphere(panda, .88, matWhite, new THREE.Vector3(0, 1.05, 0), new THREE.Vector3(1, .92, .86));
        addSphere(panda, .28, matBlack, new THREE.Vector3(-.62, 1.78, -.03), new THREE.Vector3(1, 1, .62));
        addSphere(panda, .28, matBlack, new THREE.Vector3(.62, 1.78, -.03), new THREE.Vector3(1, 1, .62));
        addSphere(panda, .24, matBlack, new THREE.Vector3(-.34, 1.14, .7), new THREE.Vector3(1.22, .7, .18));
        addSphere(panda, .24, matBlack, new THREE.Vector3(.34, 1.14, .7), new THREE.Vector3(1.22, .7, .18));
        addSphere(panda, .06, matWhite, new THREE.Vector3(-.32, 1.12, .83), new THREE.Vector3(1, 1, 1));
        addSphere(panda, .06, matWhite, new THREE.Vector3(.32, 1.12, .83), new THREE.Vector3(1, 1, 1));
        addSphere(panda, .24, matWhite, new THREE.Vector3(0, .9, .8), new THREE.Vector3(1.3, .72, .34));
        addSphere(panda, .06, matBlack, new THREE.Vector3(0, .94, 1.02), new THREE.Vector3(1.3, .72, .34));

        var headBand = new THREE.Mesh(new THREE.TorusGeometry(.68, .035, 10, 80), matRed);
        headBand.position.set(0, 1.47, .02);
        headBand.rotation.x = Math.PI / 2;
        panda.add(headBand);

        var leftArm = new THREE.Group();
        leftArm.position.set(-.78, .44, .1);
        leftArm.add(cylinderBetween(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-.54, -.76, .86), .16, matBlack, 18));
        addSphere(leftArm, .18, matBlack, new THREE.Vector3(-.54, -.76, .86), new THREE.Vector3(1, 1, 1));
        panda.add(leftArm);

        var rightArm = new THREE.Group();
        rightArm.position.set(.78, .44, .1);
        rightArm.add(cylinderBetween(new THREE.Vector3(0, 0, 0), new THREE.Vector3(.82, .78, .82), .16, matBlack, 18));
        panda.add(rightArm);

        var bowl = new THREE.Group();
        bowl.position.set(.2, -.82, 1.14);
        root.add(bowl);

        var bowlOuter = new THREE.Mesh(new THREE.CylinderGeometry(2.22, 1.42, .82, 72, 1, true), matRed);
        bowlOuter.material.side = THREE.DoubleSide;
        bowl.add(bowlOuter);
        var bowlRim = new THREE.Mesh(new THREE.TorusGeometry(2.22, .09, 16, 80), matGold);
        bowlRim.position.y = .43;
        bowlRim.rotation.x = Math.PI / 2;
        bowl.add(bowlRim);
        var broth = new THREE.Mesh(new THREE.CylinderGeometry(1.92, 1.92, .055, 72), matBroth);
        broth.position.y = .47;
        bowl.add(broth);

        var noodleGroup = new THREE.Group();
        bowl.add(noodleGroup);
        for (var i = 0; i < 20; i += 1) {
            var radius = .55 + (i % 6) * .18;
            var y = .54 + (i % 4) * .018;
            var points = [];
            for (var j = 0; j < 8; j += 1) {
                var angle = (j / 7) * Math.PI * 1.65 + i * .37;
                points.push(new THREE.Vector3(
                    Math.cos(angle) * radius + Math.sin(i) * .04,
                    y + Math.sin(j + i) * .045,
                    Math.sin(angle) * radius * .5
                ));
            }
            var curve = new THREE.CatmullRomCurve3(points);
            noodleGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 34, .018, 8, false), matNoodle));
        }

        var liftedNoodles = new THREE.Group();
        root.add(liftedNoodles);
        for (var n = 0; n < 8; n += 1) {
            var liftedCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(.28 + n * .035, -.24, 1.26),
                new THREE.Vector3(.44 + n * .02, .52, 1.16),
                new THREE.Vector3(.78 + n * .015, 1.08, 1.0),
                new THREE.Vector3(1.12 + n * .01, 1.56, .82)
            ]);
            liftedNoodles.add(new THREE.Mesh(new THREE.TubeGeometry(liftedCurve, 42, .016, 8, false), matNoodle));
        }

        var chopstickA = cylinderBetween(new THREE.Vector3(1.06, 1.82, .9), new THREE.Vector3(2.12, -.48, 1.2), .035, matWood, 12);
        var chopstickB = cylinderBetween(new THREE.Vector3(1.28, 1.86, .82), new THREE.Vector3(2.28, -.42, 1.08), .035, matWood, 12);
        root.add(chopstickA);
        root.add(chopstickB);

        var wontonGeometry = new THREE.DodecahedronGeometry(.16, 0);
        for (var w = 0; w < 7; w += 1) {
            var wonton = new THREE.Mesh(wontonGeometry, matGold);
            wonton.position.set(
                Math.cos(w * .9) * .8,
                -.22 + (w % 2) * .08,
                1.18 + Math.sin(w * .9) * .36
            );
            wonton.rotation.set(w * .4, w * .18, w * .22);
            wonton.scale.set(1.2, .62, .95);
            root.add(wonton);
        }

        var lanterns = new THREE.Group();
        root.add(lanterns);
        [-3.1, 2.7].forEach(function (x, index) {
            var lantern = new THREE.Group();
            lantern.position.set(x, 2.38, -.65);
            addSphere(lantern, .32, matRed, new THREE.Vector3(0, 0, 0), new THREE.Vector3(.82, 1.18, .82));
            var top = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .08, 20), matGold);
            top.position.y = .38;
            lantern.add(top);
            var bottom = top.clone();
            bottom.position.y = -.38;
            lantern.add(bottom);
            lantern.add(cylinderBetween(new THREE.Vector3(0, .46, 0), new THREE.Vector3(0, .92, 0), .012, matGold, 8));
            lantern.userData.phase = index * Math.PI;
            lanterns.add(lantern);
        });

        var steamGroup = new THREE.Group();
        root.add(steamGroup);
        for (var s = 0; s < 9; s += 1) {
            var xOffset = -0.58 + s * .15;
            var steamCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(xOffset, -.16, 1.18),
                new THREE.Vector3(xOffset + .12, .26, 1.16),
                new THREE.Vector3(xOffset - .08, .68, 1.12),
                new THREE.Vector3(xOffset + .12, 1.06, 1.08)
            ]);
            var steam = new THREE.Mesh(new THREE.TubeGeometry(steamCurve, 22, .01, 6, false), matSteam.clone());
            steam.userData.phase = s * .44;
            steamGroup.add(steam);
        }

        var floor = new THREE.Mesh(
            new THREE.CircleGeometry(3.9, 80),
            new THREE.MeshBasicMaterial({ color: 0x11161d, transparent: true, opacity: .18 })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(0, -1.26, .58);
        root.add(floor);

        function resize() {
            var width = mount.clientWidth || window.innerWidth;
            var height = mount.clientHeight || Math.max(window.innerHeight * .86, 520);
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }

        function renderFrame() {
            var elapsed = clock.getElapsedTime();
            var motion = reducedMotion ? 0 : elapsed;

            root.rotation.y = Math.sin(motion * .28) * .08 - .18;
            panda.position.y = .12 + Math.sin(motion * 1.4) * .035;
            rightArm.rotation.z = Math.sin(motion * 1.2) * .16;
            rightArm.rotation.x = Math.sin(motion * .9) * .08;
            chopstickA.rotation.z = Math.sin(motion * 1.2) * .02;
            chopstickB.rotation.z = Math.sin(motion * 1.2 + .2) * .02;
            liftedNoodles.rotation.z = Math.sin(motion * 1.15) * .04;
            noodleGroup.rotation.y = motion * .16;
            bowl.rotation.y = Math.sin(motion * .5) * .04;

            lanterns.children.forEach(function (lantern) {
                lantern.rotation.z = Math.sin(motion * .9 + lantern.userData.phase) * .08;
            });

            steamGroup.children.forEach(function (steam, index) {
                var phase = motion * .8 + steam.userData.phase;
                steam.position.y = Math.sin(phase) * .16;
                steam.position.x = Math.sin(phase * 1.3) * .04;
                steam.material.opacity = .18 + Math.abs(Math.sin(phase)) * .22;
                steam.scale.setScalar(.92 + Math.abs(Math.sin(phase + index)) * .18);
            });

            camera.lookAt(new THREE.Vector3(.55, .48, .5));
            renderer.render(scene, camera);
            mount.dataset.sceneReady = "true";
            window.migiPandaSceneReady = true;

            if (!reducedMotion) {
                window.requestAnimationFrame(renderFrame);
            }
        }

        resize();
        window.addEventListener("resize", resize);
        renderFrame();
    }

    function loadPage(event, element, page) {
        if (event) {
            event.preventDefault();
        }

        var groupId = element && element.getAttribute("id");
        var target = groupId ? document.getElementById("productList" + groupId) : null;
        if (!groupId || !target) {
            return;
        }

        var originalText = element.textContent;
        target.classList.add("is-loading");
        element.textContent = "...";

        var url = new URL(window.location.href);
        url.searchParams.set("group", groupId);
        url.searchParams.set("page", page);

        fetch(url.toString(), {
            credentials: "same-origin",
            headers: { "X-Requested-With": "XMLHttpRequest" }
        })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Page request failed");
                }
                return response.text();
            })
            .then(function (html) {
                var doc = new DOMParser().parseFromString(html, "text/html");
                var replacement = doc.getElementById("productList" + groupId);
                if (replacement) {
                    target.innerHTML = replacement.innerHTML;
                }
            })
            .catch(function () {
                element.textContent = originalText;
            })
            .finally(function () {
                target.classList.remove("is-loading");
            });
    }

    window.loadPage = loadPage;
    document.addEventListener("DOMContentLoaded", function () {
        initNavigation();
        initPandaScene();
    });
})();
