import{t as e}from"./index-Csmq466-.js";var t=`<!-- This is the main page we first arrive at. Since guest experience is priority, this page should work whether or not you are logged in -->
<!-- Therefore the layout should be: -->
<!-- Just a basic centered horizontal list of cards displaying the 3 most recently created lists by this guest/user. -->
<!-- On the right of these is a card with a "+" Icon, which can be selected to start creating a new rankup. -->
<!-- Hovering or keying between any of these should leave a blue border around the selection and populate some centered text below showing either the title of the rankup or 'create new' -->
<!-- If less than 3 recent rankups exist for this guest/user, then only those will be shown and then the '+' card. If none, then just the plus card -->
<section class="page-view home-view">
	<div id="cardbox">
		<button id="placeholder-1" class="placeholder-card home-cards" type="button">Placeholder 1</button>
		<button id="placeholder-2" class="placeholder-card home-cards" type="button">Placeholder 2</button>
		<button id="create-new-rankup-card" class="home-cards" type="button" aria-label="Create a new RankUp">
			<img id="icon-plus" alt="" />
		</button>
	</div>
</section>
`,n=`/assets/icon_plus-C2tQjR3N.png`;function r(r){r.innerHTML=t;let i=document.getElementById(`icon-plus`);i?i.src=n:console.error(`Error: Failed to locate #icon-plus element to attach image source.`);let a=document.getElementById(`create-new-rankup-card`);if(!a)throw Error(`Fatal Error: Failed to locate #create-new-rankup-card element to attach listener.`);a.addEventListener(`click`,t=>e(`RankUp`))}export{r as renderHomePage};