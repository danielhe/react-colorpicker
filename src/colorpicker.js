import dragMixin from './mixins/drag';
import colorUtil from './common/colorUtil';

const 
COMMON_COLORS = 
	["#000", "#333", "#666", "#999", "#ccc", "#fff", "#f00", "#0f0", "#00f", "#ff0", "#0ff", "#f0f"],
STANDARD_COLORS = 
	["#000000", "#003300", "#006600", "#009900", "#00CC00", "#00FF00", "#330000", "#333300", "#336600", 
	 "#339900", "#33CC00", "#33FF00", "#660000", "#663300", "#666600", "#669900", "#66CC00", "#66FF00", "#000033", 
	 "#003333", "#006633", "#009933", "#00CC33", "#00FF33", "#330033", "#333333", "#336633", "#339933", "#33CC33", 
	 "#33FF33", "#660033", "#663333", "#666633", "#669933", "#66CC33", "#66FF33", "#000066", "#003366", "#006666", 
	 "#009966", "#00CC66", "#00FF66", "#330066", "#333366", "#336666", "#339966", "#33CC66", "#33FF66", "#660066", 
	 "#663366", "#666666", "#669966", "#66CC66", "#66FF66", "#000099", "#003399", "#006699", "#009999", "#00CC99", 
	 "#00FF99", "#330099", "#333399", "#336699", "#339999", "#33CC99", "#33FF99", "#660099", "#663399", "#666699", 
	 "#669999", "#66CC99", "#66FF99", "#0000CC", "#0033CC", "#0066CC", "#0099CC", "#00CCCC", "#00FFCC", "#3300CC", 
	 "#3333CC", "#3366CC", "#3399CC", "#33CCCC", "#33FFCC", "#6600CC", "#6633CC", "#6666CC", "#6699CC", "#66CCCC", 
	 "#66FFCC", "#0000FF", "#0033FF", "#0066FF", "#0099FF", "#00CCFF", "#00FFFF", "#3300FF", "#3333FF", "#3366FF", 
	 "#3399FF", "#33CCFF", "#33FFFF", "#6600FF", "#6633FF", "#6666FF", "#6699FF", "#66CCFF", "#66FFFF", "#990000", 
	 "#993300", "#996600", "#999900", "#99CC00", "#99FF00", "#CC0000", "#CC3300", "#CC6600", "#CC9900", "#CCCC00", 
	 "#CCFF00", "#FF0000", "#FF3300", "#FF6600", "#FF9900", "#FFCC00", "#FFFF00", "#990033", "#993333", "#996633", 
	 "#999933", "#99CC33", "#99FF33", "#CC0033", "#CC3333", "#CC6633", "#CC9933", "#CCCC33", "#CCFF33", "#FF0033", 
	 "#FF3333", "#FF6633", "#FF9933", "#FFCC33", "#FFFF33", "#990066", "#993366", "#996666", "#999966", "#99CC66", 
	 "#99FF66", "#CC0066", "#CC3366", "#CC6666", "#CC9966", "#CCCC66", "#CCFF66", "#FF0066", "#FF3366", "#FF6666", 
	 "#FF9966", "#FFCC66", "#FFFF66", "#990099", "#993399", "#996699", "#999999", "#99CC99", "#99FF99", "#CC0099", 
	 "#CC3399", "#CC6699", "#CC9999", "#CCCC99", "#CCFF99", "#FF0099", "#FF3399", "#FF6699", "#FF9999", "#FFCC99", 
	 "#FFFF99", "#9900CC", "#9933CC", "#9966CC", "#9999CC", "#99CCCC", "#99FFCC", "#CC00CC", "#CC33CC", "#CC66CC", 
	 "#CC99CC", "#CCCCCC", "#CCFFCC", "#FF00CC", "#FF33CC", "#FF66CC", "#FF99CC", "#FFCCCC", "#FFFFCC", "#9900FF", 
	 "#9933FF", "#9966FF", "#9999FF", "#99CCFF", "#99FFFF", "#CC00FF", "#CC33FF", "#CC66FF", "#CC99FF", "#CCCCFF", 
	 "#CCFFFF", "#FF00FF", "#FF33FF", "#FF66FF", "#FF99FF", "#FFCCFF", "#FFFFFF"];

var container_bound = {
		left: 0,
		top: 0,
		width: 0,
		height: 0
	};


const ColorPicker = React.createClass({

	displayName: 'ColorPicker',

	mixins: [dragMixin],

	propTypes: {
		enableRGBA: React.PropTypes.bool,
		currentColor: '#000000',
		onChange: React.PropTypes.func
	},

	_getCustomZoneBClr(){
		var rgb = colorUtil.getRGBFromHSV(this.state.currentHSV.hue, 1, 1);
		return colorUtil.rgbToCSSValue(rgb.red, rgb.green, rgb.blue);
	},

	_getCurrentColor(){
		return colorUtil.getHexFromHSV(this.state.currentHSV);
	},

	_getDragPositon(){
		return {
			x: this.state.currentHSV.saturation * 100 + '%',
			y: (1 - this.state.currentHSV.value) * 100 + '%'
		}
	},

	getInitialState() {
		var crgb = colorUtil.hexToRGB(this.props.currentColor),
			hsv = colorUtil.getHSVFromRGB(crgb.r, crgb.g, crgb.b);

		return {
			toggleClass:'arrow-up',
			isCommonColorShow: false,
			currentHSV: colorUtil.getHSVFromRGB(crgb.r, crgb.g, crgb.b),
			rulerPositonY: hsv.hue * 100 + '%'
		}
	},

	changeColor(color){

		this.fire('onChange', {
			color: color
		})
	},

	_calculateHSV(position){
		var radioX = position.x / container_bound.width,
			radioY = position.y / container_bound.height;

		return {
			saturation : radioX,
			value: 1 - radioY
		};
	},

	_calculatePosition(offset){
		var rx, ry, x, y;

		rx = offset.pageX - container_bound.left;
		ry = offset.pageY - container_bound.top;

		if(rx < 0) x = 0;
		else if(rx > container_bound.width ) x = container_bound.width;
		else x = rx;

		if(ry < 0) y = 0;
		else if(ry > container_bound.height) y = container_bound.height;
		else y = ry;

		return { x: x, y: y }
	},

	handlerPickerClick(event){
		var el = event.target,
			color = el.getAttribute('data-color');

		this.changeColor(this._getCurrentColor());
	},

	handleToggle(event){
		var isShow = this.state.isCommonColorShow;
		this.setState({
			isCommonColorShow: !isShow
		});
	},

	handleTranClick(event){
		return this.changeColor('transparent');
	},

	handleClearClick(event){
		return this.changeColor('');
	},

	handleDragStart: function(event){
		var el = event.currentTarget,
			offset = $(el).offset();

		container_bound.left =  offset.left;
		container_bound.top = offset.top;
		container_bound.width =  el.clientWidth;
		container_bound.height =  el.clientHeight;
	},

	handleDrag(event, offset){
		var position = this._calculatePosition(offset),
			HSV = this._calculateHSV(position);

		this.setState({
			currentHSV: {
				saturation: HSV.saturation,
				value: HSV.value
			}
		});

		this.changeColor(this._getCurrentColor());
	},

	handleRulerClick(event){
		var el = event.currentTarget,
			height = el.clientHeight, 
			offsetTop = $(el).offset().top,
			offsetY, hue;

		offsetY = event.pageY - offsetTop;
		hue = offsetY / height;

		this.setState({
			rulerPositonY: offsetY,
			currentHSV: { hue: hue }
		});

		this.changeColor(this._getCurrentColor());
	},

	_renderColor(colors){
		if(!colors) return;

		var self = this,
			children = [];

		colors.forEach(function(color, index){
			children.push(<i data-color={color} style={{backgroundColor:color}} onClick={self.handlerPickerClick}></i>);
		});

		return children;
	},

	renderPickers() {
		return this._renderColor(STANDARD_COLORS);
	},

	fire(name, data){ //fire custom event
		if(typeof this.props[name] === 'function') {
			this.props[name].call(this, data);
		}
	},

	restoreFromHistory(key){
		return store.get(key);
	},

	recordToHistory(key, value){
		return store.set(key, value);
	},

	renderHistory(){
		var storedColors = this.restoreFromHistory('used_colors'), 
			colors = [], 
			len = (storedColors && storedColors.length) || 0;

		for(var i = len; i < 20; i++) {
			colors.push('#fff');
		}
		return this._renderColor(colors);
	},

	renderCommonColors(){
		return this._renderColor(COMMON_COLORS);
	},

	renderHeadbar(){
		return (
			<div className="header">
				<div className="color">
					<span className="current-color" style={{backgroundColor: this._getCurrentColor()}}></span>
					<span className="transparent" onClick={this.handleTranClick}><i></i></span>
					<span className="clear" onClick={this.handleClearClick}><i></i></span>
				</div>
				<div className="input"><input type="text" value={this._getCurrentColor()}/></div>
				<div className="more"><button className={this.state.toggleClass} onClick={this.handleToggle}>&nbsp;</button></div>
			</div>
		);
	},

	renderCustomZone(){
		var dragPosition = this._getDragPositon(),

			containerProps = {
				className : "advanced",
				style: {
					display: !this.state.isCommonColorShow ? 'block' : 'none'
				}
			},
			customoneProps = {
				className:"custom-zone",
				onMouseDown:this.handleMousedown,
				style: {
					backgroundColor: this._getCustomZoneBClr()
				}
			},

			rulerProps = {
				className: 'ruler',
				onClick: this.handleRulerClick
			},

			draggerProps = {
				className:"dragger",
				style: {
					left: dragPosition.x, 
					top: dragPosition.y
				}
			},
			
			rulerMarkProps = {//
				style: {
					top: this.state.rulerPositonY
				}
			};

		return (
			<div {...containerProps}>
				<div {...customoneProps}>
					<div {...draggerProps}></div>
				</div>
				<div {...rulerProps}>
					<i {...rulerMarkProps}></i>
					<span></span>
				</div>
			</div>
		);
	},

	render() {
		return (
			<div className="hui-colorpicker">
				{this.renderHeadbar()}
				<div className='select-zone' style={{display: this.state.isCommonColorShow ? 'block' : 'none'}}>
					<div className="history">
					{this.renderHistory()}
					</div>
					<div className="colors">
						<div className="common">
						{this.renderCommonColors()}
						</div>
						<div className="standard">
						{this.renderPickers()}
						</div>
					</div>
				</div>
				{this.renderCustomZone()}
			</div>
		);
	}

});

export default ColorPicker