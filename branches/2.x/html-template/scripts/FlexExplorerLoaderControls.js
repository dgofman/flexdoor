var FlexExplorerLoaderControls = new function(){

	//Public
	this.tests;
	this.currentTestIndex = 0;
	
	this.run = function(){
		initilize(this, "Run Flex Explorer Loader Controls");

		this.tests = [
			testImageInit,
			testSWFLoaderInit,
			testVideoDisplayInit
		];
		runNextTest(FlexExplorerLoaderControls);
	}
	
	//Test Image BEGIN
	function testImageInit(){
		Utils.log("testImageInit");
		openNode(nodes, "Image");
		waitOnLoad(this, testImage);
	}
	
	function testImage(app, panel){
		Utils.log("testImage");
		var control = getChild(panel, "mx.controls::Image");
		var base64Str = FlexDoor.base64(control);
		Utils.info("data:image/png;base64," + base64Str);
		
		Utils.pause(0);
		Utils.info("Rotate Image (please wait a few seconds");
		var PNGEncoderRef = FD.getRef("mx.utils.PNGEncoder");
		var base64Encoder = FD.create(FD.getRef("mx.utils.Base64Encoder"));
		var bitmapData = FD.create(FD.getRef("flash.display.BitmapData"), [control.width(), control.height()]);
		var colorTransform  = FD.create(FD.getRef("flash.geom.ColorTransform"), [1, 1, 0, 0.3]); //Yellow, alpha - 0.3
		var matrix = FD.create(FD.getRef("flash.geom.Matrix"));
		matrix.rotate(180 * (Math.PI / 180) );
		matrix.translate(control.width(), control.height());
		bitmapData.draw(control, matrix, colorTransform);
		base64Encoder.encodeBytes(PNGEncoderRef.encode(bitmapData));
		var base64Str = base64Encoder.flush().replace(/\n/g, '');
		Utils.info("data:image/png;base64," + base64Str);
		
		FlexDoor.base64(control, base64Str);
		Utils.pause(PAUSE_INTERVAL);

		runNextTest(FlexExplorerLoaderControls);
	}
	//Test Image END
	
	//Test SWFLoader BEGIN
	function testSWFLoaderInit(){
		Utils.log("testSWFLoaderInit");
		openNode(nodes, "SWFLoader");
		waitOnLoad(this, testSWFLoader);
	}
	
	function testSWFLoader(app, panel){
		Utils.log("testSWFLoader");
		var swfLoader = getChild(panel, "mx.controls::SWFLoader");
		var loader = swfLoader.content().getChildAt(0);
		var loaderContent = loader.content();
		function isApplicationLoaded(){
			var application = loaderContent.application();
			if(application == null) return false;
			var control = getChild(application, "mx.controls::Label");
			Utils.info("Label.text: " + control.text());
			return true;
		};
		waitOnLoad(this, testSWFLoaderDone, isApplicationLoaded);
	}
	
	function testSWFLoaderDone(){
		runNextTest(FlexExplorerLoaderControls);
	}
	//Test SWFLoader END
	
	//Test VideoDisplay BEGIN
	function testVideoDisplayInit(){
		Utils.log("testVideoDisplayInit");
		openNode(nodes, "VideoDisplay");
		waitOnLoad(this, testVideoDisplay);
	}
	
	function testVideoDisplay(app, panel){
		Utils.log("testVideoDisplay");
		FD.setFrameRate(24); //Play video in normal mode
		var playing;
		var control = getChild(panel, "mx.controls::VideoDisplay");
		FD.addEventListener("stateChange", videoPlayer_stateChangeHandler, control);
		control.volume(0.1);
		function isPlaying(){
			playing = control.playing();
			if(!playing){
				Utils.info("Init State: " + control.state());
				if(control.state() == "stopped")
					control.play();
			}
			return playing;
		};
		function videoPlayer_stateChangeHandler(videoEvent){
			Utils.info("State: " + videoEvent.state());
			Utils.info("PlayheadTime: " + control.playheadTime());
			
			if(playing && videoEvent.state() == "stopped"){
				Utils.info("TotalTime: " + control.totalTime());
				var base64Str = FlexDoor.base64(control);
				Utils.info("data:image/png;base64," + base64Str);
				control.close();
			}else if(videoEvent.state() == "disconnected"){
				FD.removeEventListener("stateChange", videoPlayer_stateChangeHandler, control);
				FD.setFrameRate(1); //Reset frame rate
				runNextTest(FlexExplorerLoaderControls);
			}
		};
		waitOnLoad(this, null, isPlaying);
	}
	//Test VideoDisplay END
};
