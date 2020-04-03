// Simple Menu
		
		
		
	/*
	
	
		Attributes

		
		Example HTML:
		
			<simple-menu></simple-menu>
			
			
		Example event initialisation:
		
			window.customElements.define('simple-menu', SimpleMenu);
			let smenu = document.querySelector('simple-menu');
			let itemlist = [["Oranges", ["One", "Two", "Three"]], "Apples", "Pears", "Strawberries", ["Blackberries", ["A", "B"]], "Bananas", "Raspberries"];
		
			smenu.initialise(itemlist);
			
		Example event listener:
		
			smenu.addEventListener('menuclick', e => console.log(e.detail.menu));
			
			e.detail.menu contains the menu item clicked on
			examples based on the example initialisation above:
			
				Oranges_One
				Oranges_Two
				Apples

		Exposed styles:
		
				--simple-menu-background-color 					background-color;
				--simple-menu-background-color-selected			background-color;
				--simple-submenu-background-color				background-color;
				--simple-submenu-background-color-selected		background-color;
				--simple-menu-font								font;
				--simple-menu-font-size							font-size;
			
	*/
		

class SimpleMenu extends HTMLElement {
			
			
	constructor() {
		
		super(); // Always do this
		
		// Create shadow root
		this.attachShadow({mode: 'open'});
		
		this.shadowRoot.innerHTML = `
		
		<style>
		
			:host{
				--simple-menu-background-color: rgba(200,200,200,0.5);
				--simple-menu-background-color-selected: rgba(200,200,200,0.7);
				--simple-submenu-background-color: rgba(30,30,30,0.5);
				--simple-submenu-background-color-selected: rgba(30,30,30,0.7);
			}
			
			.smenu{
				color: #ffffff;
				margin: 15px 0px 20px 0px;
			}
			
			.smenu>ul{
				font-family: var(--simple-menu-font, sans-serif);
				font-size: var(--simple-menu-font-size, 24px);
				list-style-type: none;
				margin: 0;
				padding: 0;
			}
			
			.smenu>ul>li{
				background-color: var(--simple-menu-background-color);
				margin-bottom: 4px;
				padding: 8px 0px 8px 20px;
				border-radius: 0px;
				border-width: 0px 0px 0px 0px;
				border-style: solid;
				border-color: #ffffff;
				cursor: pointer;
			}
			
			.nestedmenu{
				margin: 0px 0px -8px 0px;
				padding: 0;
			}
			
			li>.nestedmenu{
				margin-top: 10px;
				list-style-type: none;
			}
			
			.nestedmenu>li{
				background-color: var(--simple-submenu-background-color);
				font-family: var(--simple-menu-font, sans-serif);
				font-size: var(--simple-menu-font-size, 24px);
				margin-bottom: 4px;
				padding: 5px 5px 5px 20px;
				border-width: 0px 0px 0px 0px;
				border-style: solid;
				border-color: #ffffff;
				list-style-type: none;
				cursor: pointer;
			}
			
			
			
			
		</style>
		
		<div class="smenu"></div>
		
		`;
		
		let menuitem = null;
		
	}
	
	
	initialise(list, initiallySelected)
	{
		
		// initiallySelected is the initial item to be highlighted
		
		let menu = this.shadowRoot.querySelector('.smenu');
		menu.innerHTML = "<ul></ul>";
		let ul = menu.querySelector('ul');
		
		for(var m_item of list)
		{
			
			let li = document.createElement('li');
			
			if(typeof m_item == "object")
			{
				// Replace spaces with dashes
				li.id = m_item[0].replace(/\s+/g, '-');
				li.innerHTML = m_item[0] + "...<ul class='nestedmenu' id='ul_" + m_item[0] + "'></ul>";
				let nesteditem = li.querySelector('#ul_' + m_item[0]);
				
				// Initially hide sub menu
				nesteditem.hidden = true;
				
				for(var subm_item of m_item[1])
				{
					
					let nestedli = document.createElement('li');
					
					nestedli.id = m_item[0].replace(/\s+/g, '-') + "_" + subm_item.replace(/\s+/g, '-');
					nestedli.innerText = subm_item;
					
					// ************** Set up event listeners and custom events for sub menus **********************
					
					nestedli.addEventListener('mousedown', function(e){
						
						submenuclicked(e);
						nestedli.dispatchEvent(new CustomEvent('menuclick', {detail:{menu: SimpleMenu.menuitem}, bubbles: true, cancelable: false, composed: true}));
						
					});
					
					nestedli.addEventListener('touchstart', function(e){
						
						submenuclicked(e);
						nestedli.dispatchEvent(new CustomEvent('menuclick', {detail:{menu: SimpleMenu.menuitem}, bubbles: true, cancelable: false, composed: true}));
							
					});
					
					
					nesteditem.appendChild(nestedli);
					
				}
				
				// ************** Set up event listeners for show hide sub menu functionality **********************
				
				li.addEventListener('mousedown', function(e){
					
					menuclicked(e);
					hideshowsub(e);
					
				});
				
				li.addEventListener('touchstart', function(e){
					
					//console.log("touched2")
					menuclicked(e);
					hideshowsub(e);
						
				});
				
				ul.appendChild(li);
				
			}else
			{

				// Replace spaces with dashes
				li.id = m_item.replace(/\s+/g, '-');
				
				li.innerHTML = m_item;
				
				// ************** Set up event listeners and custom events for menus **********************
				
				li.addEventListener('mousedown', function(e){

					
					menuclicked(e);
					
					li.dispatchEvent(new CustomEvent('menuclick', {detail:{menu: SimpleMenu.menuitem}, bubbles: true, cancelable: false, composed: true}));	

				});
				
					
				li.addEventListener('touchstart', function(e){	
					//console.log("touched1")	
					menuclicked(e);
					
					li.dispatchEvent(new CustomEvent('menuclick', {detail:{menu: SimpleMenu.menuitem}, bubbles: true, cancelable: false, composed: true}));

				});
				
				ul.appendChild(li);
				
			}

		}
		
		// Highlight the initial selection
		
		SimpleMenu.menuitem = initiallySelected.replace(/\s+/g, '-');
		if(initiallySelected != null)
		{
			let limenuitem = menu.querySelector('#' + SimpleMenu.menuitem);
			limenuitem.style.setProperty('background-color', 'var(--simple-menu-background-color-selected)');
		}
		
		function menuclicked(e)
		{
			
			//console.log(SimpleMenu.menuitem);
			let limenuitem = menu.querySelector('#' + SimpleMenu.menuitem);
					
			if(limenuitem != null)
			{
				if(!SimpleMenu.menuitem.includes("_"))
				{
					limenuitem.style.setProperty('background-color', 'var(--simple-menu-background-color)');
				}else
				{
					limenuitem.style.setProperty('background-color', 'var(--simple-submenu-background-color)');
				}
			}
					
			SimpleMenu.menuitem = e.target.id;

			limenuitem = menu.querySelector('#' + SimpleMenu.menuitem);
			limenuitem.style.setProperty('background-color', 'var(--simple-menu-background-color-selected)');

		}
		
		
		function submenuclicked(e)
		{
			
			let limenuitem = menu.querySelector('#' + SimpleMenu.menuitem);
						
			if(SimpleMenu.menuitem != null)
			{
				if(SimpleMenu.menuitem.includes("_"))
				{
					limenuitem.style.setProperty('background-color', 'var(--simple-submenu-background-color)');
				}else
				{
					limenuitem.style.setProperty('background-color', 'var(--simple-menu-background-color)');
				}
			}
						
			SimpleMenu.menuitem = e.target.id;
							
			limenuitem = menu.querySelector('#' + SimpleMenu.menuitem);
			limenuitem.style.setProperty('background-color', 'var(--simple-submenu-background-color-selected)');
						
		}
		
		
		function hideshowsub(e)
		{
			
			// Check to make sure that only the menu item has been clicked on, not a sub menu item
			if(!e.target.id.includes("_"))	
			{
						
				let limenuitem = menu.querySelector('#' + e.target.id);
				let ultochange = e.target.querySelector('#ul_' + e.target.id);
						
				//console.log(e.target);
						
				if(ultochange.hidden == false)
				{
					ultochange.hidden = true;

					if(SimpleMenu.menuitem == e.target.id)
					{
						limenuitem.style.setProperty('background-color', 'var(--simple-menu-background-color)');
						limenuitem = menu.querySelector('#' + SimpleMenu.menuitem);
						limenuitem.style.setProperty('background-color', 'var(--simple-menu-background-color)');
					}else
					{
						limenuitem.style.setProperty('background-color', 'var(--simple-menu-background-color)');
						if(SimpleMenu.menuitem != null)
						{
							limenuitem = menu.querySelector('#' + SimpleMenu.menuitem);
							limenuitem.style.setProperty('background-color', 'var(--simple-menu-background-color)');
						}
					}
				}else
				{
					ultochange.hidden = false;
					limenuitem.style.setProperty('background-color', 'var(--simple-menu-background-color-selected)');
				}
				
			}	
		}
		
		
	}
	
	
		
	// This sets up attributes to be observed so that any changes are captured by attributeChangedCallback
	static get observedAttributes() {
		//return ['state'];
	}
  
  
	attributeChangedCallback(name, oldValue, newValue) {
		
		const menu = this.shadowRoot.querySelector('.smenu');
		
	}
	
	
	// Colour luminance change function from CSS Tricks web site
	/*
	function ColorLuminance(hex, lum) {

		// validate hex string
		hex = String(hex).replace(/[^0-9a-f]/gi, '');
		if (hex.length < 6) {
			hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
		}
		lum = lum || 0;

		// convert to decimal and change luminosity
		var rgb = "#", c, i;
		for (i = 0; i < 3; i++) {
			c = parseInt(hex.substr(i*2,2), 16);
			c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
			rgb += ("00"+c).substr(c.length);
		}

		return rgb;
	}
	*/
	
}


// Class data

SimpleMenu.menuitem = null;


