// Simple Point Slider
		
		
		
	/*
		Attributes
		
		points: number of points along slider
		start: value at start of slider
		end: value at end of slider
		thumbtext: text to display next to slider value. Note if this attribute is not set then the value will not be displayed
		
		Note that in this version 'end' must be greater than 'start'.
		
		Following attributes to be implemented:
		starttext: text to display at start of slider track
		endtext: text to display at end of slider track
		
		
		Example HTML:
		
			<point-slider id='slider' points = "16" start = "4" end = "8"></point-slider>
		
		Note custom event called 'slidermove' is dispatched when slider is moved
		This can be used to read the slider thumb value
		
		Example event listener:
		
			let slider = document.querySelector('#slider');
			
			slider.addEventListener('slidermove', function (e) {
				console.log(slider.getAttribute('value'));
			});
			
		Exposed styles:
		
			css variable				css rule
			
			--simple-slider-thumb-color			background-color
			--simple-slider-thumb-border		border
			--simple-slider-thumb-radius 		border-radius
			
			--simple-slider-track-color			background-color
			--simple-slider-track-border		border
			--simple-slider-track-radius		border-radius
			
			--simple-slider-thumb-text-color	color
			--simple-slider-thumb-text-font		font-family
			--simple-slider-thumb-text-size		font-size
		
	*/

class SimplePointSlider extends HTMLElement {
			
			
	constructor() {
		
		super(); // Always do this
		
		// Create shadow root
		this.attachShadow({mode: 'open'});
		
		this.shadowRoot.innerHTML = `
		
		<style>
			
			/* fixed styling and variables */
			
			:host {
				--simple-slider-thumb-height: 50px;
				--simple-slider-thumb-width: 50px;
				--simple-slider-track-height: 10px;
				--track-top: calc((var(--simple-slider-thumb-height)/2) - (var(--simple-slider-track-height)/2));
			}
			
			/* default styling */
			
			.slider_box{
				width: 100%;
				height: var(--simple-slider-thumb-height);
				padding: 0px;
				margin: 0px;
				border: 0px;
			}
			
			
			.thumb{
				z-index: 2;
				position: absolute;
				width: var(--simple-slider-thumb-width);
				height: var(--simple-slider-thumb-height);
				font-family: sans-serif;
				font-size: 12px;
				background-color: var(--simple-slider-thumb-color, #ffffff);
				color: #000000;
				cursor: pointer;
				margin: 0px;
				border: var(--simple-slider-thumb-border, 0px none);
				border-radius: var(--simple-slider-thumb-radius, 0px);
				padding: 0px;
			}
			
			
			.track{
				z-index: 1;
				position: relative;
				width: 100%;
				top: var(--track-top);
				height: var(--simple-slider-track-height, 10px);
				background-color: var(--simple-slider-track-color, #a8a8a8);
				color: #000000;
				margin: 0px;
				border: var(--simple-slider-track-border, 0px none);
				border-radius: var(--simple-slider-track-radius, 0px);
			}
			
			
			.thumbtext{
				z-index: 2;
				position: absolute;
				width: auto;
				font-family: var(--simple-slider-thumb-text-font, sans-serif);
				font-size: var(--simple-slider-thumb-text-size, 14px);
				color: var(--simple-slider-thumb-text-color, #ffffff);
				text-align: center;
				margin-top: var(--simple-slider-thumb-height);
			}
			

			
		</style>
		
		<div class="slider_box">
			<div class="thumb"></div>
			<div class="track"></div>
			<div class="thumbtext"></div>
		</div>
		
		`;
		
		
		const thumb = this.shadowRoot.querySelector('.thumb');
		const track = this.shadowRoot.querySelector('.track');
		const thumb_text = this.shadowRoot.querySelector('.thumbtext');
		const parent_element = this;
		
		
		let mdown = false;
		let sliderpos = 0;
		
		let newrangeposition = Number(parent_element.getAttribute('start'));
		parent_element.setAttribute('value', newrangeposition.toString());
		
		let range = Number(parent_element.getAttribute('end')) - Number(parent_element.getAttribute('start'));
		
		let thumbPosition = offset(thumb);
		let trackPosition = offset(track);
		
		// Calculate the range increment between points
		let rangeincrement = (Number(this.getAttribute('end')) - Number(this.getAttribute('start')))/Number(this.getAttribute('points'))
		
		update_thumb_text(newrangeposition.toString());
		
		
		thumb.addEventListener('mousedown', thumbstart_ev);
		thumb.addEventListener('touchstart', thumbstart_ev);
	
		// Do window resize actions to make sure everything is positioned nicely
		resize_ev();
		
		
		function thumbstart_ev(e)
		{
			
			mdown = true;
			
			e.preventDefault();
				
		}
		
		
		// Mouse up and Touch end event handling
		
		window.addEventListener('mouseup', thumbend_ev);
		window.addEventListener('touchend', thumbend_ev);
		
		function thumbend_ev()
		{
			
			// Check to see if event is associated with slider
			
			if(mdown == true)
			{
				mdown = false;
			}
			
		}
		
		
		
		// Mouse move and Touch move event handling
		
		window.addEventListener('mousemove', thumbmove_ev);
		window.addEventListener('touchmove', thumbmove_ev);
		
		function thumbmove_ev(e)
		{
			 
			
			if(mdown)
			{
				
				e.preventDefault();
			
				let cursorpos = 0;
				thumbPosition = offset(thumb);
				trackPosition = offset(track);
			
				if(e.targetTouches)
				{
					cursorpos = e.targetTouches[0].clientX;
				}else{
					cursorpos = e.pageX;
				}
				
				
				
				// Calculate current position of cursor relative to the slider range.
				
				let trackstart = Number(parent_element.getAttribute('start')) - rangeincrement/2;
				let trackend = Number(parent_element.getAttribute('end')) + rangeincrement/2;
				let trackrange =  trackend - trackstart;
				
				let currentrangeposition = trackstart + ((cursorpos - parseInt(Number(trackPosition.left)))/Number(track.offsetWidth)) * (trackrange);
				
				if(currentrangeposition < trackstart)
				{
					newrangeposition = Number(parent_element.getAttribute('start'));
				}else
				{
					if(currentrangeposition > trackend)
					{
						newrangeposition = Number(parent_element.getAttribute('end'));
					}else
					{
						let i = Number(parent_element.getAttribute('start'));
						
						while((currentrangeposition < (i - rangeincrement/2) || currentrangeposition > (i + rangeincrement/2)) && (i <= Number(parent_element.getAttribute('end'))))
						{
							i = i + rangeincrement;
						}
						
						newrangeposition = i;
					}
				}
				
				// from the found point position, calculate the new position to place the slider thumb along the track
				let x = parseInt(Number(trackPosition.left)) + (Number(track.offsetWidth) - Number(thumb.offsetWidth))*(newrangeposition - Number(parent_element.getAttribute('start')))/range ;
				
				// Update position of thumb and thumb text
				thumb.style.left = x.toString() + "px";
				thumb_text.style.left = (x - (thumb_text.offsetWidth/2 - thumb.offsetWidth/2)).toString() + "px";

				update_thumb_text(newrangeposition.toString());
				
				// dispatch event for app to listen for and set the vale attribute ready to be read.
				parent_element.setAttribute('value', newrangeposition.toString());
				parent_element.dispatchEvent(new CustomEvent('slidermove', {bubbles: true, cancelable: false, composed: true}));
				
			}
			
		}
		
		
		// Set up listener to move thumb to correct position when window resized.
		
		window.addEventListener('resize', resize_ev);
		
		function resize_ev()
		{		
		
			thumbPosition = offset(thumb);
			trackPosition = offset(track);
				
			// Update thumb position
			let x = parseInt(Number(trackPosition.left)) + (Number(track.offsetWidth) - Number(thumb.offsetWidth))*(newrangeposition - Number(parent_element.getAttribute('start')))/range ;
				
			thumb.style.left = x.toString() + "px";
			thumb_text.style.left = (x - (thumb_text.offsetWidth/2 - thumb.offsetWidth/2)).toString() + "px";
		}
		
		
		
		function update_thumb_text(position_value){
			
			if(parent_element.getAttribute('thumbtext') != null)
			{
				thumb_text.innerHTML = Number(position_value).toFixed(2) + parent_element.getAttribute('thumbtext');
			}else
			{
				thumb_text.innerHTML ="";
			}
		}
		
		
		
		function offset(el) {
			
			var rect = el.getBoundingClientRect(),
			scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
			return { left: rect.left + scrollLeft }
			
		}
		
		
	};
	
	
	
		
	
	// This sets up attributes to be observed so that any changes are captured by attributeChangedCallback
	static get observedAttributes() {
		return ['points', 'start', 'end', 'value', 'thumbtext'];
	}
  
  
	attributeChangedCallback(name, oldValue, newValue) {
		
		// Do nothing for now
		// This could be changed in next version

	}
	
	
	// Currently attributes are not setable
	
	get value() {
		return this.getAttribute('value');
	}
	
	
	get points() {
		return this.getAttribute('points');
	}
	
	
	
	get start() {
		return this.getAttribute('start');
	}
	
	
	
	get end() {
		return this.getAttribute('end');
	}
	
	
	get thumbtext() {
		return this.getAttribute('thumbtext')
	}
	
	
	
		
};


