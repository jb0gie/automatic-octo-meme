// InfoBox content container
		
	/*
		Attributes
		
		There are no attributes
		
		
		Example HTML:
		
			<box>Donec cursus elit lobortis ultrices aliquam. 
			Vivamus tempus feugiat consequat. Morbi sed libero ac sem condimentum finibus sed nec nisi. 
			Nulla faucibus mi urna, vitae tempus neque euismod vitae. 
			</box>
			
		Example event listener:
		
			let infobox = document.querySelector('box');
			
			infobox.addEventListener('closed', function (e) {
				console.log("info box closed");
			});
			
		Exposed styles:
				
			css variable				css rule
			
			--simple-info-box-color 			background-color
			--simple-info-box-close-color 		color (of close button)
			--simple-info-box-border 			border
			--simple-info-box-radius 			border-radius

		
	*/

class SimpleInfoBox extends HTMLElement {
			
			
	constructor() {
		
		super(); // Always do this
		
		// Create shadow root
		this.attachShadow({mode: 'open'});
		
		this.shadowRoot.innerHTML = `
		
		<style>
		
			.wrapper{
				height: auto;
				background-color: var(--simple-info-box-color, #EDEDED);
				border: var(--simple-info-box-border, 0px none);
				border-radius: var(--simple-info-box-radius, initial);
			}
		
			.closebut{
				float: right;
				font-family: sans-serif;
				font-size: 24px;
				padding-top: 10px;
				padding-right: 10px;
				color: var(--simple-info-box-close-color, #000000);
				cursor: pointer;
			}
			
			/* Following css imposes default margins for text */
			.user_content{
				padding: 15px 30px 15px 15px;
			}
			
			/* Insert css to change parent/host element here */
			:host{
				/*
				overflow: auto;
				*/
			}
			
		</style>
		<div class="wrapper">
			<div class="closebut">X</div>
			<div class="user_content"><slot>Your content here</slot></div>
		</div>
		`;
		
		
		const close_button = this.shadowRoot.querySelector('.closebut');
		const parent_element = this;
		
		close_button.addEventListener('mouseup', close_ev);
		close_button.addEventListener('touchend', close_ev);
	
	
		function close_ev()
		{
			parent_element.parentNode.removeChild(parent_element);
			// dispatch a closed event
			parent_element.dispatchEvent(new CustomEvent('closed', {bubbles: true, cancelable: false, composed: true}));
		}
	
	};
	

		
};


