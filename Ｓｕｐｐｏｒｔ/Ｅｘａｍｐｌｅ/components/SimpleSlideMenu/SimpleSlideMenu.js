// Simple Slide Menu
		
		
		
	/*
	
		Slide Menu Container
	
		Attributes

		
		Example HTML:
		
			<slide-menu>
				<h3 slot="title">My Menu</h3>
				<ul>
					<li>Oranges</li>
					<li>Apples</li>
					<li>Grapes</li>
					<li>Strawberries</li>
				</ul>
			</slide-menu>
			
			Note that the menu is slotted content held in a container that has the sliding functionality.
			
			
		Example event listeners:
		
			let slidemenu = document.querySelector('slide-menu');
			
			slidemenu.addEventListener('menu-opened', function (e) {
				console.log('menu opened');
			});
			
			slidemenu.addEventListener('menu-closed', function (e) {
				console.log('menu closed');
			});
			
		Exposed styles:
		
			css variable							css rule
			
			--simple-slide-menu-burger-margin 		margin	
			--simple-slide-menu-width 				width	
			--simple-slide-menu-min-width 			min-width			
			--simple-slide-menu-bg-color			color		
			--simple-slide-menu-border				border	
			--simple-slide-menu-title-size			font-size
			--simple-slide-menu-title-bg-color		background-color
			--simple-slide-menu-title-color			color
			--simple-slide-menu-title-border		border
			--simple-slide-menu-title-border-width	border-width
			
	*/
	
	
class SimpleSlideMenu extends HTMLElement {
	
	
    constructor() {
        super();
        this.attachShadow({ mode: "open"});
        // Elements
        this._frame = null;
        // Data
        this._open = false;
		
    }
	
	
    set open(value) {
        const result = (value === true);
        if (this._open === result) return;
        this._open = result;
        this._render();
    }
	
	
    get open() {
        return this._open;
    }
	
	
	
	
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
			
				.burger-container {
					z-index: 1000;
					margin: var(--simple-slide-menu-burger-margin, 0 0 0 0);
					height: 40px;
				}
				
				.burger{
					cursor: pointer;
					height: 40px;
				}
				
				
                .frame {
                    position: fixed;
					z-index: 1001;
                    top: 0;
                    bottom: 0;
                    width: 100%;                   
                    overflow: hidden;
                    pointer-events: none;
                    transition: background-color 300ms ease-in;
                }
				
                .container {
                    position: relative;
                    z-index: 1003;
                    width: var(--simple-slide-menu-width, 50%);
					min-width: var(--simple-slide-menu-min-width, 100px);
                    background: var(--simple-slide-menu-bg-color, #FFF);
                    height: 100%;
                    transform: translateX(-100%);
                    will-change: transform;
                    transition: transform 300ms ease-in;
                    box-shadow: 1px 0 10px rgba(51,51,51,0.8); 
					border: var(--simple-slide-menu-border, 1px solid #000);                 
                }
				
				
                .title {
                    display: flex;
                    flex-direction: row;
                    min-height: 3.2em;
                    font-size: var(--simple-slide-menu-title-size, 1.5em);
                    background-color: var(--simple-slide-menu-title-bg-color, #F1F1F1);
                    color: var(--simple-slide-menu-title-color, #fff);
					border: var(--simple-slide-menu-title-border, 1px solid #000);
					border-width: var(--simple-slide-menu-title-border-width, 0px 0px 1px 0px); 
                }
				
                .title .title-content {
                    flex-grow: 1;
                    display: flex;
                    align-items: center;
                    padding-left: 1em;             
                }
				
                .close {
                    flex-basis: 100px;
                    flex-grow: 0;
                    flex-shrink: 0;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    user-select: none;
                }
				
                .frame.open {     
                    pointer-events: auto;
                    background-color: rgba(0, 0, 0, 0.25);
                }
				
                :host([backdrop="false"]) .frame.open {
                    pointer-events: none;
                    background-color: inherit;
                }
				
                :host([backdrop="false"]) .frame.open .container {
                    pointer-events: auto;
                }
				
                .frame.open .container {
                    transform: none;
                }
				
                .content-slot::slotted(a) {
                    display: block;
                    font-size: 1.2em;
                    text-decoration: none;
                    line-height: 2.5em;
                    padding: 0.5em;
                    border-bottom: solid 1px #F1F1F1;
                    color: #666;
                }
				
                .content-slot::slotted(a:hover) {
                    color: #000;
                }
				
                /* THEMES */
                /* --RED */
                :host([theme="red"]) .title {
                    background-color: #E23F24;
                    color: white;
                }
				
                :host([theme="red"]) .content-slot::slotted(a:hover) {
                    color: #E23F24;
                }
				
                /* --BLUE */
                :host([theme="blue"]) .title {
                    background-color: #0d152d;
                    color: white;
                }
				
                :host([theme="blue"]) .content-slot::slotted(a:hover) {
                    color: #0d152d;
                }
				
            </style>
			
			<div class="burger-container"></div>
            <div class="frame">
                <nav class="container">
                    <div class="title">
                        <div class="title-content">
                            <slot name="title">Menu</slot>
                        </div>
                        <a class="close" data-close="true">&#10006;</a>
                    </div>
                    <div class="content">
                        <slot class="content-slot"></slot>
                    </div>
                </nav>
            </div>
			
        `;
		
        this._frame = this.shadowRoot.querySelector(".frame");
		
        this._frame.addEventListener("click", (event) => {
            if (event.target.dataset.close === "true") {
                this.open = false;
            }
        });
		

		this._burgercontainer = this.shadowRoot.querySelector('.burger-container');
		
		let pathArray = window.location.pathname.split('/');
		let newPathname = "";
		for(let i = 0; i < pathArray.length - 1; i++)
		{
			newPathname += pathArray[i];
			newPathname += "/"
		}
	
		this._burgercontainer.innerHTML = "<img class='burger' src='" + newPathname + "components/SimpleSlideMenu/burger-sym.svg' />";

		this._burgercontainer.addEventListener("mouseup", (event) => {
			this.open = true;
        });
		
		this._burgercontainer.addEventListener("touchend", (event) => {
			this.open = true;
        });
		
    }
	
	
    _render() {
        if (this._frame !== null) {
            if (this._open === true) {
                this._frame.classList.add("open");
                this.dispatchEvent(new CustomEvent("menu-opened"));
            } else {
                this._frame.classList.remove("open");
                this.dispatchEvent(new CustomEvent("menu-closed"));
            }
        }
    }
	
	
}

