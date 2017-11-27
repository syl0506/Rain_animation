(function () {

	var scene,
	    camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
		renderer , raycaster, clock, debugCube;

		var control; //= new THREE.TrackballControls(camera);

	function createScene()
	{
		scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
		scene.gameObjects = {};

		HEIGHT = window.innerHeight;
		WIDTH = window.innerWidth;

		aspectRatio = WIDTH / HEIGHT;
		fieldOfView = 60;
		nearPlane = 1;
		farPlane = 10000;
		camera = new THREE.PerspectiveCamera(
			fieldOfView,
			aspectRatio,
			nearPlane,
			farPlane
			);

		camera.position.z = 5;
		camera.position.y = 1.4;

		raycaster = new THREE.Raycaster();

		renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		renderer.setSize( window.innerWidth, window.innerHeight );
		//renderer.setSize( 200, 200 );
		document.body.appendChild( renderer.domElement );

		BHelper.initialize(renderer.domElement);

		window.addEventListener('resize', handleWindowResize, false);

		clock  = new THREE.Clock();

		BStageManager.initialize(scene, camera, raycaster);

		//control = new THREE.TrackballControls(camera);
	}

	function handleWindowResize() {
		// update height and width of the renderer and the camera
		HEIGHT = window.innerHeight;
		WIDTH = window.innerWidth;
		renderer.setSize(WIDTH, HEIGHT);
		camera.aspect = WIDTH / HEIGHT;
		camera.updateProjectionMatrix();
	}

	function createLight()
	{
		//Light -------------
		var ambientLight = new THREE.AmbientLight( 0xcccccc, 1.5 );
		scene.add( ambientLight );

		var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.25 );
		scene.add( light );

		// var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
	}

	var update = function () {
		requestAnimationFrame( update );

		var delta = clock.getDelta();
		var theta = clock.getElapsedTime();

		BHelper.update(delta);

		//var worldPos = BHelper.convertScreenToWorld(camera, )
		debugCube.position.set(BHelper.Input.Mouse.pos.x, BHelper.Input.Mouse.pos.y, 1)

		BStageManager.update(delta);

		for(var index in scene.gameObjects)
		{
			scene.gameObjects[index].update(delta);
		}

		if(control)
			control.update(delta);

		renderer.render(scene, camera);
	};

	createScene();
	createLight();

	var geometry = new THREE.BoxBufferGeometry( 0.1, 0.1, 0.1 );
	var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
	debugCube = new THREE.Mesh( geometry, material );
	//scene.add( debugCube );

	update();

	BStageManager.startStage("rainy");



}());
