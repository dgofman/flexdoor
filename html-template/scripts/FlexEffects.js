var FlexEffects = new function(){

	//Public
	this.tests;
	this.currentTestIndex = 0;
	
	this.run = function(){
		initilize(this, "Run Flex Explorer Effects");

		this.tests = [
			testAnimatePropertyInit,
			testBlurInit,
			testDissolveInit,
			testEffectInit,
			testFadeInit,
			testGlowInit,
			testIrisInit,
			testMoveInit,
			testResizeInit,
			testPauseInit,
			testResizeInit,
			testRotateInit,
			testSequenceInit,
			testSoundEffectInit,
			testWipeDownInit,
			testWipeLeftInit,
			testWipeRightInit,
			testWipeUpInit,
			testZoomInit
		];
		runNextTest(FlexEffects);
	}
	
	function onMouseEvent(control, type){
		if(type == null) type = "mouseDown";
		var MouseEventRef = FD.getRef("flash.events.MouseEvent");
		var event = FD.create(MouseEventRef, [type]);
		doEvent(control, event, true, 2000);
	}
	
	//Test AnimateProperty BEGIN
	function testAnimatePropertyInit(){
		Utils.log("testAnimatePropertyInit");
		openNode(nodes, "AnimateProperty");
		waitOnLoad(this, testAnimateProperty);
	}
	
	function testAnimateProperty(app, panel){
		Utils.log("testAnimateProperty");
		onMouseEvent(app.flex());
		runNextTest(FlexEffects);
	}
	//Test AnimateProperty END
	
	//Test Blur BEGIN
	function testBlurInit(){
		Utils.log("testBlurInit");
		openNode(nodes, "Blur");
		waitOnLoad(this, testBlur);
	}
	
	function testBlur(app, panel){
		Utils.log("testBlur");
		onMouseEvent(app.flex());
		runNextTest(FlexEffects);
	}
	//Test Blur END
	
	//Test Dissolve BEGIN
	function testDissolveInit(){
		Utils.log("testDissolveInit");
		openNode(nodes, "Dissolve");
		waitOnLoad(this, testDissolve);
	}
	
	function testDissolve(app, panel){
		Utils.log("testDissolve");
		var chbox = app.cb1();
		onMouseEvent(chbox, "click");
		onMouseEvent(chbox, "click");
		runNextTest(FlexEffects);
	}
	//Test Dissolve END
	
	//Test Effect BEGIN
	function testEffectInit(){
		Utils.log("testEffectInit");
		openNode(nodes, "Effect");
		waitOnLoad(this, testEffect);
	}
	
	function testEffect(app, panel){
		Utils.log("testEffect");
		var controlBar = getChild(panel.rawChildren(), "mx.containers::ControlBar");
		var numChildren = controlBar.numChildren();
		for(var i = 0; i < numChildren; i++){
			var button = getChild(controlBar, "mx.controls::Button", i);
			onMouseEvent(button, "click");
			closeAlertWindow();
		}
		runNextTest(FlexEffects);
	}
	//Test Effect END
	
	//Test Fade BEGIN
	function testFadeInit(){
		Utils.log("testFadeInit");
		openNode(nodes, "Fade");
		waitOnLoad(this, testFade);
	}
	
	function testFade(app, panel){
		Utils.log("testFade");
		var chbox = app.cb1();
		onMouseEvent(chbox, "click");
		onMouseEvent(chbox, "click");
		runNextTest(FlexEffects);
	}
	//Test Fade END
	
	//Test Glow BEGIN
	function testGlowInit(){
		Utils.log("testGlowInit");
		openNode(nodes, "Glow");
		waitOnLoad(this, testGlow);
	}
	
	function testGlow(app, panel){
		Utils.log("testGlow"); 
		var image = getChild(panel, "mx.controls::Image");
		onMouseEvent(image, "mouseDown");
		onMouseEvent(image, "mouseUp");
		runNextTest(FlexEffects);
	}
	//Test Glow END
	
	//Test Iris BEGIN
	function testIrisInit(){
		Utils.log("testIrisInit");
		openNode(nodes, "Iris");
		waitOnLoad(this, testIris);
	}
	
	function testIris(app, panel){
		Utils.log("testIris");
		var chbox = app.cb1();
		onMouseEvent(chbox, "click");
		onMouseEvent(chbox, "click");
		runNextTest(FlexEffects);
	}
	//Test Iris END
	
	//Test Move BEGIN
	function testMoveInit(){
		Utils.log("testMoveInit");
		openNode(nodes, "Move");
		waitOnLoad(this, testMove);
	}
	
	function testMove(app, panel){
		Utils.log("testMove");
		var canvas = app.canvas();
		var width = canvas.width() - app.img().width();
		var pointRef = FD.getRef("flash.geom.Point");
		var point = FD.create(pointRef, [0, 0]);
		var point = app.localToGlobal(point);
		var offsetX = point.x() + 60;
		for(var i = 0; i < 3; i++){
			var localX = Math.floor(Math.random() * width) + offsetX;
			FD.root(app, "_mouseX", localX);
			onMouseEvent(canvas);
			Utils.log("localX: " + localX + "=" + (localX - offsetX));
		}
		runNextTest(FlexEffects);
	}
	//Test Move END
	
	//Test Resize BEGIN
	function testResizeInit(){
		Utils.log("testResizeInit");
		openNode(nodes, "Resize");
		waitOnLoad(this, testResize);
	}
	
	function testResize(app, panel){
		Utils.log("testResize");
		var controlBar = getChild(panel.rawChildren(), "mx.containers::ControlBar");
		for(var i = 0; i < 2; i++){
			var button = getChild(controlBar, "mx.controls::Button", i);
			onMouseEvent(button, "click");
		}
		runNextTest(FlexEffects);
	}
	//Test Resize END
	
	//Test Pause BEGIN
	function testPauseInit(){
		Utils.log("testPauseInit");
		openNode(nodes, "Pause");
		waitOnLoad(this, testPause);
	}
	
	function testPause(app, panel){
		Utils.log("testPause");
		onMouseEvent(getChild(panel, "mx.controls::Image"));
		Utils.pause(4000);
		runNextTest(FlexEffects);
	}
	//Test Pause END
	
	//Test Resize BEGIN
	function testResizeInit(){
		Utils.log("testResizeInit");
		openNode(nodes, "Resize");
		waitOnLoad(this, testResize);
	}
	
	function testResize(app, panel){
		Utils.log("testResize");
		var controlBar = getChild(panel.rawChildren(), "mx.containers::ControlBar");
		for(var i = 0; i < 2; i++){
			var button = getChild(controlBar, "mx.controls::Button", i);
			onMouseEvent(button, "click");
		}
		runNextTest(FlexEffects);
	}
	//Test Resize END
	
	//Test Rotate BEGIN
	function testRotateInit(){
		Utils.log("testRotateInit");
		openNode(nodes, "Rotate");
		waitOnLoad(this, testRotate);
	}
	
	function testRotate(app, panel){
		Utils.log("testRotate");
		var controlBar = getChild(panel.rawChildren(), "mx.containers::ControlBar");
		var button = getChild(controlBar, "mx.controls::Button");
		for(var i = 0; i < 4; i++)
			onMouseEvent(button, "click");
		runNextTest(FlexEffects);
	}
	//Test Rotate END
	
	//Test Sequence BEGIN
	function testSequenceInit(){
		Utils.log("testSequenceInit");
		openNode(nodes, "Sequence");
		waitOnLoad(this, testSequence);
	}
	
	function testSequence(app, panel){
		Utils.log("testSequence");
		onMouseEvent(getChild(panel, "mx.controls::Image"));
		Utils.pause(4000);
		runNextTest(FlexEffects);
	}
	//Test Sequence END
	
	//Test SoundEffect BEGIN
	function testSoundEffectInit(){
		Utils.log("testSoundEffectInit");
		openNode(nodes, "SoundEffect");
		waitOnLoad(this, testSoundEffect);
	}
	
	function testSoundEffect(app, panel){
		Utils.log("testSoundEffect");
		onMouseEvent(app.flex());
		runNextTest(FlexEffects);
	}
	//Test SoundEffect END
	
	//Test WipeDown BEGIN
	function testWipeDownInit(){
		Utils.log("testWipeDownInit");
		openNode(nodes, "WipeDown");
		waitOnLoad(this, testWipeDown);
	}
	
	function testWipeDown(app, panel){
		Utils.log("testWipeDown");
		var chbox = app.cb1();
		onMouseEvent(chbox, "click");
		onMouseEvent(chbox, "click");
		runNextTest(FlexEffects);
	}
	//Test WipeDown END
	
	//Test WipeLeft BEGIN
	function testWipeLeftInit(){
		Utils.log("testWipeLeftInit");
		openNode(nodes, "WipeLeft");
		waitOnLoad(this, testWipeLeft);
	}
	
	function testWipeLeft(app, panel){
		Utils.log("testWipeLeft");
		var chbox = app.cb1();
		onMouseEvent(chbox, "click");
		onMouseEvent(chbox, "click");
		runNextTest(FlexEffects);
	}
	//Test WipeLeft END
	
	//Test WipeRight BEGIN
	function testWipeRightInit(){
		Utils.log("testWipeRightInit");
		openNode(nodes, "WipeRight");
		waitOnLoad(this, testWipeRight);
	}
	
	function testWipeRight(app, panel){
		Utils.log("testWipeRight");
		var chbox = app.cb1();
		onMouseEvent(chbox, "click");
		onMouseEvent(chbox, "click");
		runNextTest(FlexEffects);
	}
	//Test WipeRight END
	
	//Test WipeUp BEGIN
	function testWipeUpInit(){
		Utils.log("testWipeUpInit");
		openNode(nodes, "WipeUp");
		waitOnLoad(this, testWipeUp);
	}
	
	function testWipeUp(app, panel){
		Utils.log("testWipeUp");
		var chbox = app.cb1();
		onMouseEvent(chbox, "click");
		onMouseEvent(chbox, "click");
		runNextTest(FlexEffects);
	}
	//Test WipeUp END
	
	//Test Zoom BEGIN
	function testZoomInit(){
		Utils.log("testZoomInit");
		openNode(nodes, "Zoom");
		waitOnLoad(this, testZoom);
	}
	
	function testZoom(app, panel){
		Utils.log("testZoom");
		var img = app.img();
		onMouseEvent(img, "rollOver");
		onMouseEvent(img, "rollOut");
		runNextTest(FlexEffects);
	}
	//Test Zoom END
}
