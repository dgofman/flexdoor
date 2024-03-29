﻿package {

	import flash.display.MovieClip;
	
	import flash.display.LoaderInfo;
	import flash.utils.ByteArray;
	import flash.utils.Endian;
	import flash.events.MouseEvent;

	public class AlertView extends MovieClip
	{
		private var _runner:FlexDoorRunner;
	
		public function AlertView(){
			super();
			show = false;
		}

		public function init(runner:FlexDoorRunner){
			_runner = runner;

			_runner.initButton(ok_btn, mouseEvent);
			_runner.initButton(close_btn, mouseEvent, "Close");
		}

		public function about():void{
			title_lbl.htmlText = "<b>About</b>";
			var details:Array = ["<b>FlexDoor</b> version 3.1"];
			details.push("<b>Author:</b> David Gofman");

			var date:Date = readCompilationDate();
			if(date != null)
				details.push("<b>Modified:</b> " + date.toLocaleString());
			details_txt.htmlText = details.join("<br>");
			show = true;
		}

		public function error(value:String):void{
			title_lbl.htmlText = "<b>Error</b>";
			details_txt.htmlText = value;
			show = true;
		}

		public function finish(value:String):void{
			title_lbl.htmlText = "<b>Result</b>";
			details_txt.htmlText = value;
			show = true;
		}

		private function mouseEvent(event:MouseEvent):void{
			show = false;
		}

		private function set show(b:Boolean):void{
			visible = b;
			enabled = b;
			if(b == true){
				if(_runner.scaleX != 1 || _runner.scaleY != 1){
					visible = false;
					_runner.complete_lbl.visible = true;
				}
			}
		}

		private function readCompilationDate(serialNumber:ByteArray = null):Date
		{
			const compilationDate: Date = new Date();
			const DATETIME_OFFSET: uint = 18;
			
			if (serialNumber == null)
				serialNumber = readSerialNumber();
			
			/* example of filled SWF_SERIALNUMBER structure
			struct SWF_SERIALNUMBER
			{
			UI32 Id;         // "3"
			UI32 Edition;    // "6"
			// "flex_sdk_4.0.0.3342"
			UI8 Major;       // "4."
			UI8 Minor;       // "0."
			UI32 BuildL;     // "0."
			UI32 BuildH;     // "3342"
			UI32 TimestampL;
			UI32 TimestampH;
			};
			*/
			
			// the SWF_SERIALNUMBER structure exists in FLEX swfs only, not FLASH
			if (serialNumber == null)
				return null;
			
			// date stored as uint64
			serialNumber.position = DATETIME_OFFSET;
			serialNumber.endian = Endian.LITTLE_ENDIAN;
			compilationDate.time = serialNumber.readUnsignedInt() + serialNumber.readUnsignedInt() * (uint.MAX_VALUE + 1);
			
			return compilationDate;
		}
		
		///////////////////////////////////////////////////////////////////////////
		// Returns contents of Adobe SerialNumber SWF tag
		private function readSerialNumber(): ByteArray
		{
			const TAG_SERIAL_NUMBER: uint = 0x29;
			return findAndReadTagBody(TAG_SERIAL_NUMBER);
		}
		
		///////////////////////////////////////////////////////////////////////////
		// Returns the tag body if it is possible
		private function findAndReadTagBody(theTagCode: uint): ByteArray
		{
			// getting direst access to unpacked SWF file
			const src: ByteArray = stage.loaderInfo.bytes;
			
			/*
			SWF File Header
			Field      Type  Offset   Comment
			-----      ----  ------   -------
			Signature  UI8   0        Signature byte: “F” indicates uncompressed, “C” indicates compressed (SWF 6 and later only)
			Signature  UI8   1        Signature byte always “W”
			Signature  UI8   2        Signature byte always “S”
			Version    UI8   3        Single byte file version (for example, 0x06 for SWF 6)
			FileLength UI32  4        Length of entire file in bytes
			FrameSize  RECT  8        Frame size in twips
			FrameRate  UI16  8+RECT   Frame delay in 8.8 fixed number of frames per second
			FrameCount UI16  10+RECT  Total number of frames in file
			*/
			
			// skip AVM2 SWF header
			// skip Signature, Version & FileLength
			src.position = 8;
			// skip FrameSize
			const RECT_UB_LENGTH: uint = 5;
			const RECT_SB_LENGTH: uint = src.readUnsignedByte() >> (8 - RECT_UB_LENGTH);
			const RECT_LENGTH: uint = Math.ceil((RECT_UB_LENGTH + RECT_SB_LENGTH * 4) / 8);
			src.position += (RECT_LENGTH - 1);
			// skip FrameRate & FrameCount
			src.position += 4;
			
			while (src.bytesAvailable > 0)
				with (readTag(src, theTagCode))
				{
					if (tagCode == theTagCode)
						return tagBody;
				}
			
			return null;
		}
		
		///////////////////////////////////////////////////////////////////////////
		// Returns tag from current read position
		private function readTag(src: ByteArray, theTagCode: uint): Object
		{
			src.endian = Endian.LITTLE_ENDIAN;
			
			const tagCodeAndLength: uint = src.readUnsignedShort();
			const tagCode: uint = tagCodeAndLength >> 6;
			const tagLength: uint = function(): uint {
				const MAX_SHORT_TAG_LENGTH: uint = 0x3F;
				const shortLength: uint = tagCodeAndLength & MAX_SHORT_TAG_LENGTH;
				return (shortLength == MAX_SHORT_TAG_LENGTH) ? src.readUnsignedInt() : shortLength;
			}();
			
			const tagBody: ByteArray = new ByteArray;
			if (tagLength > 0)
				src.readBytes(tagBody, 0, tagLength);
			
			return {
				tagCode: tagCode,
				tagBody: tagBody
			};
		}
	}
}