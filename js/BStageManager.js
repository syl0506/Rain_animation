//-------------------------
//
//-------------------------
var BStageManager = (function(){

	var stages = {};
	var activeStage;

	var startStage = function(name)
	{
		if(stages[name] == undefined) return;

		if(activeStage)
		{
			activeStage.destroyLevel(function(){
				activeStage = stages[name];
				activeStage.startLevel();
			});
		}else{
			activeStage = stages[name];
			activeStage.startLevel();
		}

	}

	var update = function(deltaTime)
	{
		if(BHelper.Input.Key.up('A') )
		{
			startStage("rainy");
		}

		if(activeStage)
			activeStage.updateLevel(deltaTime)
	}

	var initialize = function(scene, camera, raycaster)
	{
		//stage template--------------------------------------------
		var tempStage = new BStage("example", scene, camera,
			function() //Start logic
			{},
			function(deltaTime) //update logic
			{},
			function() //destroy logic
			{}
		);
		stages[tempStage.name] = tempStage;
		//------------------------------------------------------------

		//0. collider stage
		var tempStage = new BStage("coll", scene, camera,
			function() //Start logic
			{

				var plate = new BGameObject(scene, 'plate',
					function(gameObject, deltaTime)
					{

						if( BHelper.Input.Mouse.isDown )
						{
							if(BHelper.Input.Mouse.isClicked)
							{
								if(gameObject.isClicked(raycaster, camera))
								{
									gameObject.originalPos = gameObject.mesh.position.clone(); //deep copy
								}
							}else
							{
								if(gameObject.originalPos)
								{

									gameObject.mesh.position.set(BHelper.Input.Mouse.pos.x, BHelper.Input.Mouse.pos.y, 0.5)
								}
							}
						}
						else
						{
							// return to the original position
							if(gameObject.originalPos)
							{
								var orgPos = gameObject.originalPos;

								BHelper.startCoroutine(0.3, function(tt){
									gameObject.mesh.position.lerp(orgPos, tt);
								}, function(){
									gameObject.mesh.position.set(orgPos.x,orgPos.y, orgPos.z );
								});
							}
							gameObject.originalPos = null;
						}
					});

				plate.loadJson('docs/assets/holder.json', false,-1, null, null,
					function(gameObject)
					{
						gameObject.setIntersectBoundary(0.2);
						//gameObject.boxCollider.applyMatrix4(gameObject.mesh.matrix)
					});

				var testSphere = new BGameObject(scene, 'sph',
					function(gameObject, deltaTime)
					{

						if(!gameObject.isIntersectsWith(plate)){
							console.log("Out");
						}
					});

				testSphere.create('sphere', null, function(gameObject)
				{
					gameObject.setIntersectBoundary(0.1);

				});
			},
			function(deltaTime) //update logic
			{},
			function() //destroy logic
			{}
		);
		stages[tempStage.name] = tempStage;

		//1. drag example stage
		var tempStage = new BStage("drag", scene, camera,
			function() //Start logic
			{
				var plate = new BGameObject(scene, 'plate',
					function(gameObject, deltaTime)
					{
						if( BHelper.Input.Mouse.isDown )
						{
							if(BHelper.Input.Mouse.isClicked)
							{
								if(gameObject.isClicked(raycaster, camera))
								{
									gameObject.originalPos = gameObject.mesh.position.clone(); //deep copy
								}
							}else
							{
								if(gameObject.originalPos)
								{
									gameObject.mesh.position.set(BHelper.Input.Mouse.pos.x, BHelper.Input.Mouse.pos.y, 1)
								}
							}
						}
						else
						{
							// return to the original position
							if(gameObject.originalPos)
							{
								var orgPos = gameObject.originalPos;

								BHelper.startCoroutine(0.3, function(tt){
									gameObject.mesh.position.lerp(orgPos, tt);
								});
							}
							gameObject.originalPos = null;
						}
					});

				plate.loadJson('docs/assets/holder.json', false,-1);
			},
			function(deltaTime) //update logic
			{
				//Describe
			},
			function() //destroy logic
			{
				//Describe
			}
		);
		stages[tempStage.name] = tempStage;
		//-----------------------------------------------------------

		//second stage
		var tempStage = new BStage("second", scene, camera,
			function() //Start logic
			{
				var character = new BGameObject(scene, 'character');
				character.loadJson('docs/assets/PANDAP.json', true, 3, null, null,
					function(loaded){
						var item = new BGameObject(scene, 'hat',
							function(gameObject, deltaTime)
							{
								if( BHelper.Input.Mouse.isDown )
								{
									if(BHelper.Input.Mouse.isClicked)
									{
										if(gameObject.isClicked(raycaster, camera))
										{
											scene.add(gameObject.mesh)
											gameObject.mesh.scale.set(1,1,1);

											var headPos = character.mesh.skeleton.bones[10].getWorldPosition().clone();
											gameObject.mesh.position.set(headPos.x, headPos.y, headPos.z);

											gameObject.mesh.setRotationFromEuler(new THREE.Euler(THREE.Math.degToRad(90),0,0, 'XYZ'));

											gameObject.originalPos = gameObject.mesh.position.clone(); //deep copy
											gameObject.grabLastPos = {x:BHelper.Input.Mouse.pos.x, y:BHelper.Input.Mouse.pos.y}


											character.transitAnimation("LookForItem");
										}
									}else
									{
										if(gameObject.originalPos)
										{

											var deltaX =  (gameObject.grabLastPos.x -BHelper.Input.Mouse.pos.x);
											var deltaY =  (gameObject.grabLastPos.y -BHelper.Input.Mouse.pos.y);

											gameObject.grabLastPos.x = BHelper.Input.Mouse.pos.x;
											gameObject.grabLastPos.y = BHelper.Input.Mouse.pos.y;

											gameObject.mesh.translateX(deltaX * -1 * 3);
											gameObject.mesh.translateZ(deltaY  * 2);
											//gameObject.mesh.position.set(BHelper.Input.Mouse.pos.x, BHelper.Input.Mouse.pos.y, 1)

											character.mesh.lookAt(BHelper.Input.Mouse.pos.x, 0, 0.5);
										}
									}
								}
								else
								{
									// return to the original position
									if(gameObject.originalPos)
									{
										character.mesh.skeleton.bones[10].add(gameObject.mesh)
										gameObject.mesh.scale.set(8,8,8)

										character.transitAnimation("Idle");
										var orgPos = character.mesh.skeleton.bones[10].getWorldPosition().clone();
										//var orgRot = character.mesh.skeleton.bones[10].getWorldRotation().clone();

										var orgRot = new THREE.Quaternion();
										orgRot.setFromEuler(  new THREE.Euler(0,0,0,'XYZ') );

										var orgRot_character = new THREE.Quaternion();
										orgRot.setFromEuler(  new THREE.Euler(0,0,0,'XYZ') );

										var currRot_hat = gameObject.mesh.quaternion.clone();
										var currRot_character = character.mesh.quaternion.clone();

										var qm_hat = new THREE.Quaternion();
										var qm_character =new THREE.Quaternion();

										BHelper.startCoroutine(0.3, function(tt){
											gameObject.mesh.position.lerp(orgPos, tt);


											THREE.Quaternion.slerp(currRot_hat, orgRot, qm_hat, tt);
											gameObject.mesh.quaternion.copy(qm_hat);

											THREE.Quaternion.slerp(currRot_character, orgRot_character, qm_character, tt);
											character.mesh.quaternion.copy(qm_character);
										},
										function()
										{
											//character.mesh.skeleton.bones[10].add(gameObject.mesh)
											gameObject.mesh.position.set(0,0,0);
											gameObject.mesh.setRotationFromEuler(new THREE.Euler(0,0,0, 'XYZ'));
											//gameObject.mesh.scale.set(8,8,8)
										});
									}
									gameObject.originalPos = null;
								}
							})

						console.log("ddd");
						item.loadJson('docs/assets/hat.json', false, -1, null, null,
						function(item)
						{
							character.mesh.skeleton.bones[10].add(item.mesh);
							item.mesh.scale.set(8,8,8)
						}
					);
					});



			},
			function(deltaTime) //update logic
			{},
			function() //destroy logic
			{}
		);
		stages[tempStage.name] = tempStage;


		//First stage
		tempStage = new BStage("rainy", scene, camera,
			function() //Start logic
			{
				var plate = new BGameObject(scene, 'plate');
				plate.loadJson('docs/assets/scene_rain.js', false,-1, new THREE.TextureLoader().load( 'docs/assets/bus_stop_tex_dark_test.png' ), null,

					function(item)
					{
						item.mesh.scale.set(1.5,1.5,1.5)
						item.mesh.position.set(0,-0.1,-1)
					});

				var particle = new BParticle(scene, 'paritcle',
					function(gameObject, deltaTime)
					{
						gameObject.particleSystem.rotation.y += 0.01;

						var pCount = gameObject.particleCount;
					    while (pCount--) {
							// get the particle
							var particle = gameObject.particles.vertices[pCount];

						    // check if we need to reset
							if (particle.y < 0) {

							  particle.y = Math.random() * 2.2;

							  particle.velocity.y = 0;
							}

							// update the velocity
							particle.velocity.y -= Math.random() * .005;
							// and the position
							//particle.x += particle.velocity.x;
							particle.y += particle.velocity.y;
							//particle.z += particle.velocity.z;

						 }
						  gameObject.particleSystem.geometry.verticesNeedUpdate = true;
					});
				particle.create(100, 0x0060d3, 0.03, 1.5,3,3);

				var character = new BGameObject(scene, 'character');
				character.loadJson('docs/assets/PANDAP.json', true, 6, null, null,
					function()
					{
						var item = new BGameObject(scene, 'umblerra',
							function(gameObject, deltaTime){

								if( BHelper.Input.Mouse.isDown )
								{


									if(BHelper.Input.Mouse.isClicked)
									{
										raycaster.setFromCamera( BHelper.Input.Mouse.pos, camera );

										var result = raycaster.intersectObject(gameObject.mesh, false);
										if(result.length > 0)
										{
											gameObject.grabLastPos = {x:BHelper.Input.Mouse.pos.x, y:BHelper.Input.Mouse.pos.y}
											gameObject.grabZ = result[0].point.clone();

											gameObject.isDetached = true;
										}
									}
									else
									{
										if(gameObject.grabZ)
										{


											if(gameObject.isDetached){
												character.transitAnimation("Hold_Item");
												gameObject.isDetached = null;
												scene.add(gameObject.mesh)
												gameObject.mesh.setRotationFromEuler(new THREE.Euler(0,0,0, 'XYZ'));
												gameObject.mesh.scale.set(1,1,1);

											}

											var deltaX =  (gameObject.grabLastPos.x -BHelper.Input.Mouse.pos.x);
											var deltaY =  (gameObject.grabLastPos.y -BHelper.Input.Mouse.pos.y);


											gameObject.grabLastPos.x = BHelper.Input.Mouse.pos.x;
											gameObject.grabLastPos.y = BHelper.Input.Mouse.pos.y;

											//gameObject.mesh.lookAt(BHelper.Input.Mouse.pos.x, BHelper.Input.Mouse.pos.y, 0.5 )

											gameObject.mesh.rotateZ(THREE.Math.radToDeg(  deltaX * deltaTime ));
											gameObject.mesh.rotateX(THREE.Math.radToDeg( deltaY* deltaTime ));

											//gameObject.mesh.lookAt(gameObject.grabZ.x, gameObject.grabZ.y, gameObject.grabZ.z )

											var worldPos = character.mesh.skeleton.bones[15].getWorldPosition();

											gameObject.mesh.position.set(worldPos.x, worldPos.y, worldPos.z)

											character.mesh.lookAt(BHelper.Input.Mouse.pos.x, 0, 0.5);
											//character.mesh.lookAt(gameObject.grabZ.x, 0, 0);
										}
									}
								}
								else
								{
									if(gameObject.grabZ != null)
									{
										character.mesh.skeleton.bones[14].add(gameObject.mesh)
										gameObject.mesh.position.set(0,0,0)


										//Smooth Reset for Umbrella
										var currRot_umb = gameObject.mesh.quaternion.clone();
										var currRot_character = character.mesh.quaternion.clone();

										var targetRot = new THREE.Quaternion();
										targetRot.setFromEuler(  new THREE.Euler(0,0,0,'XYZ') );

										var targetRot_umb = new THREE.Quaternion();
										targetRot_umb.setFromEuler(  new THREE.Euler(THREE.Math.degToRad(-90),0,0,'XYZ') );

										var qm_umb = new THREE.Quaternion();
										var qm_char = new THREE.Quaternion();

										BHelper.startCoroutine(0.3, function(tt)
										{
											 THREE.Quaternion.slerp(currRot_umb, targetRot_umb, qm_umb, tt);
											 gameObject.mesh.quaternion.copy(qm_umb);

											 THREE.Quaternion.slerp(currRot_character, targetRot, qm_char, tt);
											 character.mesh.quaternion.copy(qm_char);
										},
										function()
										{
											gameObject.mesh.setRotationFromEuler(new THREE.Euler(THREE.Math.degToRad(-90),0,0, 'XYZ'));
										})

										gameObject.mesh.scale.set(11,11,11)
										character.transitAnimation("Stand_with_Umb");
									}

									gameObject.isDetached = null;
									gameObject.grabZ = null;
								}
							}
						 )

						item.loadJson('docs/assets/unbrella.json', false, -1, null, null,
							function(item)
							{
								character.mesh.skeleton.bones[14].add(item.mesh);
								item.mesh.setRotationFromEuler(new THREE.Euler(THREE.Math.degToRad(-90),0,0, 'XYZ'));
								item.mesh.scale.set(11,11,11)
							}
						);

					});
			},

			function(deltaTime) //update logic
			{

			},

			function() //destroy logic
			{

			}
		);
		stages[tempStage.name] = tempStage;

	}

	return {
		initialize: initialize,
		startStage:startStage,
		activeStage:activeStage,
		update:update,

	}


})();