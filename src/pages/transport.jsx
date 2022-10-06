
const posts = await Astro.glob('./transports/*.md');
const bruv = posts;
var output;

console.log(bruv[0].compiledContent());

function changeSection(section){
	output = posts[section].compiledContent;

		
	
}





				<div class="selection">
					<input id="leeds" type="radio" name="type" value="manchester"  checked>
					<label id="leeds-label" for="leeds" >Leeds Bradford</label>
					
					<input id="manchester" type="radio" name="type" value="manchester">
					<label id="manchester-label" for="manchester">Manchester</label>
					
					<input id="london" type="radio" name="type" value="london">
					<label id="london-label" for="london">London</label>
				</div>

				<div class="directions">

					<p>
						{bruv[0].compiledContent()}

					</p>

				</div>
				


<style>

	:root {
		--astro-gradient: linear-gradient(0deg, #4f39fa, #da62c4);
	}

	main{
		display: flex;
		flex-direction: row;
		overscroll-behavior: none;
		/* overflow-y: scroll */
		/* height: 300vh;
		padding-left: 14em; */
		/* margin-left: 14em; */
		/* position: absolute; */
	}

	

	content{
		width: 100%;
	}

	.venue-card{
		display: flex;
		margin: auto;
		background-color: #fff;
		border-radius: 30px;
		margin-top: 2em;
		/* padding-top: 2em; */
		/* width: 70%; */
		/* height: 500px; */
	}

	/* .image{
		width: 300px;
	} */

	

	.venue-content-1{
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		/* width: 100%; */
		/* justify-content: space-between; */
		/* height: 100vh; */
		/* width: 100%; */
		padding: 3em;
		border-bottom: 1px solid #002C38;
		/* padding-left: 16em; */
	}

	h1{
		font-weight: 100;
	}

	.venue-content-2 h1{
		margin: 0%;
		padding: 0%;
		font-size: 2em;
	}

	.about-section{
		padding: 2em;
	}

	.venue-details{
		display: flex;
		flex-direction: column;
		min-width: 8em;
		padding: 1.5em;
		padding-right: 1em;
		border-radius: 30px;
		background-color: #fff;
		justify-content: space-between;
	}

	.venue-details img{
		padding-bottom: 0.5em;
		max-width: 180px;
		/* width: 300px; */
	}

	.venue-details h3{
		font-family: 'AH-B';
		font-weight: 100;
		padding-top: 0.5em;
		margin: 0%;
		border-top: 2px solid #002C38;
	}

	.venue-details p, .venue-details h4{
		margin: 0%;
	}

	.venue-image{
		display: flex;
		width: 80%;
		padding: 1em;
		/* max-width: 600px; */
		/* overflow: hidden; */
		/* background-image: url(/RCH.jpg); */
		/* width: 300px; */
	}

	.venue-image img{
		width: 100%;
		object-fit: cover;
		border-radius: 30px;
	}

	.bottom{
		margin: 0%;
		padding-top: 3em;
	}

	.center{
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.button-padding h2{
		padding: 0.1em 1em;
		border-radius: 50px;
	}

	.center *{
		margin: auto;
	}

	.sub-types{
		background-color: #002C38;
		color: #FCF7EB;
		border-radius: 30px;
		padding: 0.5em 0em 0.5em 0em ;
		margin-bottom: 1em;
		margin-top: 1em;
		display: flex;
		flex-direction: column;
		/* width: max-content; */
		/* height: 100%; */
		/* width: 100%; */
	}



	/* Click to select */

	.selection{
		margin: auto;
		margin-top: 0%;
		width: 100%;
		max-width: 1000px;
		display: flex;
		justify-content: space-between;
		
		
		/* flex-wrap: wrap; */
	}

	.selection input{
		display: none;
		/* flex-wrap: wrap; */
	}
	
	label{
		caret-color: #ffffff00;
		/* margin: 0.5em; */
		width: 100%;
		text-align: center;
		align-content: center;

		padding: 0.6em;
		border: 2px solid #002C38;
		/* border-radius: 50px; */
		font-family: "AH-B";
	}

	label:hover{
		cursor: pointer;
	}

	#leeds-label{
		border-radius: 30px 0px 0px 0px;
		border-right: 0px;
	}

	#london-label{
		border-radius: 0px 30px 0px 0px;
		border-left: 0px;
	}

	#leeds:checked ~ #leeds-label{
		color: #FCF7EB;
		background-color: #002C38;
	}

	#manchester:checked ~ #manchester-label{
		color: #FCF7EB;
		background-color: #002C38;
	}

	#london:checked ~ #london-label{
		color: #FCF7EB;
		background-color: #002C38;
	}

	.directions{
		border: 2px solid #002C38;
		border-top: #002C38;
		border-radius: 0px 0px 30px 30px;
		padding: 1.5em;
	}

	.directions p{
		align-items: flex-start;
		text-align: left;
	}

	.sub-types h3{
		margin: 0px;
		padding: 0.2em;
		padding-left: 1em;
		padding-bottom: 0.5em;
		font-family: 'AH-B'
	}


	.sub-details{
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-left: 1em;
	}

	.submissions{
		position: relative;
		justify-content: center;
		align-items: center;
	}

	.venue-content-2{
		align-content: center;
		justify-content: center;
		display: flex;
		flex-direction: column;
		padding: 4em;
		border-bottom: 1px solid #002C38;
		height: 100vh;
		/* padding-left: 16em; */
	}

	.venue-content-2 h2{
		padding-top: 2em;
		margin: 0%;
	}

	.venue-content-2{
		padding-right: 1em;
	}

	.venue-content-3{
		justify-content: center;
		text-align: center;
		display: flex;
		flex-direction: column;
		padding: 2em;
		border-bottom: 1px solid #002C38;
		/* height: 100vh; */
		/* padding-left: 16em; */
	}

	.venue-content-4{
		justify-content: center;
		text-align: center;
		display: flex;
		flex-direction: row;
		padding: 2em;
		border-bottom: 1px solid #002C38;
		height: 100vh;
	}


	.venue-content-3 h1, .venue-content-4 h1{
		/* padding-top: 1em; */
		padding-bottom: 1em;
		margin: 0%;
		/* font-family: 'S-B'; */
		font-size: 2.5em;
	}

	.input-field{
		padding-top: 1em;
		display: flex;
		flex-direction: column;
		width: 50%;
	}

	.input-field input, .input-field textarea{
		all: unset;
		padding: 0.5em;
		border-radius: 0.5em;
		border: 2px solid #002C38;
		font-family: sans-serif;
	}

	.input-field label{
		padding-bottom: 0.2em;
		
	}

	h2{
		font-weight: 100;
		/* padding-top: 2em; */
	}

	.venue-details h4{
		margin: 0%;
		font-family: 'AH-B';
	}

	.venue-details p{
		margin-top: 0%;
	}

	.juries-details{
		display: flex;
	}

	.juries-section{
		display: flex;
		display: block;
		align-content: space-between;
		padding-bottom: 4em;
	}

	.juries-section:last-child{
		display: flex;
		display: block;
		align-content: space-between;
		padding-bottom: 0%;
	}

	.text-details{
		justify-content: center;
		align-content: center;
		text-align: center;
	}

	.nav-container{
		width: 14em;
	}

	.img-mask{
		max-height: 450px;
		overflow: hidden;
	}

	.rch{
		width: 100%;
		/* max-height: 473px; */
		object-fit: cover;
	}

	.stretch{
		box-sizing: border-box;
		display: flex;
		width: 100%;
		/* height: 100%; */
	}

	.pill{
		font-family: 'AH-B';
		font-size: 1em;
		margin: 0px;
		display: flex;
		padding: 0.2em 0.5em 0.2em 0.5em ;
		background-color: #002C38;
		color: #FCF7EB;
		border-radius: 50px;
		align-items: center;
		width: fit-content;
	}

	.pill img{
		margin: 0%;
		padding-right: 0.5em;
		width: 1em;
		height: 1em;
	}

	.location-detail{
		align-items: flex-end;
		margin-top: auto;
		margin-bottom: 0%;
		margin-left: 2em;
		white-space: nowrap;
		width: max-content;
	}

	.title{
		font-family: 'S-B';
		font-size: 2.5em;
		/* height: 50%; */
		margin: 0%;
		
		overflow: hidden;
		/* width: 200%; */
	}

	.title h3{
		font-family: 'S-B';
		font-size: 1.2em;
		padding-bottom: 0.2em;
		/* height: 50%; */
		margin: 0%;
	}

	.venue-content-5 h1{
		padding-top: 1em;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0%;
		font-family: 'S-B';
		font-size: 2.5em;
	}

	.venue-content-2 h3{
		margin: 0%;
		padding-top: 1em;
		font-family: 'AH-B';
		
		/* font-size: 2.5em; */
	}
	
	.conditions{
		padding-top: 2em;
	}

	.content-container{
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 2em;
		/* height: 60%; */
		border-radius: 30px;
		border: solid 5px #002C38;
		overflow: hidden;
		
	}

	.map-embed{
		width: 100%;
		height: 100%;
		justify-self: center;
		border-bottom: 5px solid #002C38;
	}

	.direction-links{
		width: 100%;
		/* padding: 1em; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		
	}


	.direction-links button{
		margin: 0.5em;
		width: 100%;
		background-color: var(--color-bg);
		border-radius: 0px;
		color: #002C38;
		font-size: 100;
		font-family: 'AH-R';
		caret-color: transparent;
	}

	.direction-links button:hover{
		text-decoration: underline;
		background-color: var(--color-bg);
	}


	/* Presets */

	.bold{
		font-family: 'AH-B';
	}

	.thin-text{
		font-family: 'AH-R';
	}

	.thin{
		font-family: 'S-R';
	}

	.no-border{
		border: 0px solid #000;
	}

	

</style>