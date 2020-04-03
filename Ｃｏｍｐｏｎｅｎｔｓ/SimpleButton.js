// Simple Button
		
		
		
	/*
	
		Multi state button
	
		Attributes
			state: The state of the button can be initially set.
			
					values: 
					"enabled" --- default styling and button is active, cursor is set to pointer 
					"selected" --- styling is changed to the selected style, button is active cursor is pointer
					"disabled" --- button is 'greyed out', cursor is changed to standard arrow pointer, button does not generate event
		
		Note: If a button is set to 'disabled' there is no logic in the component to stop it from being 'enabled' or 'selected'
		Logic for this should be external to the button component and custom to the application. Use the state attribute in 
		Javascript to change states.
		
		Example HTML:
		
			<button-comp state="selected">Button Text</button-comp>
			
			
		Example event listener:
		
			let button = document.querySelector('button-comp');
			
			button.addEventListener('buttonclick', function (e) {
				console.log(slider.getAttribute('state'));
			});
			
		Exposed styles:
		
			css variable			css rule
			
			--simple-button-border 		border
			--simple-button-color 			background-color
			--simple-button-radius 		border-radius
			--simple-button-text-align		text-align
			--simple-button-padding		padding
			
	*/
	
	

class SimpleButton extends HTMLElement {
			
			
	constructor() {
		
		super(); // Always do this
		
		// Create shadow root
		this.attachShadow({mode: 'open'});
		
		this.shadowRoot.innerHTML = `
		
		<style>
		
			
			.sbutton{
				position: relative;
				text-align: var(--simple-button-text-align, center);
				padding: var(--simple-button-padding, 6px);
				border: var(--simple-button-border, 2px solid rgba(255, 255, 255, 0.5));
				border-radius: var(--simple-button-radius, initial);
				background-color: var(--simple-button-color, transparent);
				width: auto;
				height: auto;
				cursor: pointer;
			}
			
			
		</style>
		
		<div class="sbutton"><slot>Your content here</slot></div>
		
		`;
		
		
		const but = this.shadowRoot.querySelector('.sbutton');
		const parent_element = this;
		
		// Set state attribute to enabled if not set
		if(parent_element.getAttribute('state') == null)
		{
			parent_element.setAttribute('state', 'enabled');
		}

		but.addEventListener('mouseup', butend_ev);
		but.addEventListener('touchend', butend_ev);
		
		function butend_ev()
		{
			
			switch (parent_element.getAttribute('state'))
			{
				
				case 'enabled':
					// Dispatch event
					parent_element.dispatchEvent(new CustomEvent('buttonclick', {bubbles: true, cancelable: false, composed: true}));
					parent_element.setAttribute('state', 'selected');
					break;
					
				case 'selected':
					// Dispatch event
					parent_element.dispatchEvent(new CustomEvent('buttonclick', {bubbles: true, cancelable: false, composed: true}));
					break;
					
				case 'disabled':
					// do nothing
					break;
					
				default:
					// do nothing
			}
		}
	
	}
	
	// This sets up attributes to be observed so that any changes are captured by attributeChangedCallback
	static get observedAttributes() {
		return ['state'];
	}
  
  
	attributeChangedCallback(name, oldValue, newValue) {
		
		const but = this.shadowRoot.querySelector('.sbutton');
		
		switch (name)
		{
			
			case 'state':
			
				switch (newValue)
				{
				
					case 'enabled':
						
						but.style="border-color: rgba(255, 255, 255, 0.5); cursor: pointer;";

						break;
					
					case 'selected':
						
						but.style="border-color: rgba(255, 255, 255, 1); cursor: pointer;";

						break;
					
					case 'disabled':
						
						but.style="opacity: 0.5; cursor: default;";
						
						break;
					
					default:
						// do nothing
						
				}
					
				break;
				
			default:
			// do nothing
				
		}
		
	}
	
	
	get state() {
		return this.getAttribute('state');
	}
	
	
	set state(newstate) {
		this.setAttribute('state', newstate);
	}
	
	
}


