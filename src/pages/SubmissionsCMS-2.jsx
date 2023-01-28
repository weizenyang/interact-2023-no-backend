import React, {useState} from "react";
import "../submissions.css";
import Markdown from 'markdown-to-jsx';
import { render } from "astro/dist/runtime/server";
// import items from '/data/submissions-data'


// await fetch('/data/submissions-data.json')
// .then(r => console.log(r));

// console.log(items.length);

// await fetch('/data/submissions-data')
// .then(r => console.log(r));

//Receives data from /public/content.json
var url = window.location.pathname;
console.log(url);
const response = await fetch('/content-copy.json');
const data = await response.json();
const type = data;


// console.log(type);

// function getData(id){
// 	for(let i=0; i<Object.keys(type.submissions_data).length; i++){
// 		if(type.submissions_data[i].id == section){
// 			section = i;
// 			console.log("selected link" + type.submissions_data[i].id);
// 			return type.submissions_data[i]
// 		}
// 	}
// }



export function Navbar(){
	console.log(type.length)
}

export function SubNavbarJsx({id}) {

	var section = 1;

	if(id == null){
		section = idMatchedIndex(1);
	} else {
		section = idMatchedIndex(id);
		
	}

	console.log("section: " + section);

	

	

	const [value, setValue] = useState(section);


	// async function printFiles () {
	// 	// const files = await fetch('/data/submissions-data');
	// 	var url = window.location.pathname;
	// 	console.log(url);
	  
	// 	for (const file of files) {
	// 	  const contents = await fs.readFile(file, 'utf8');
	// 	  console.log(contents);
	// 	}
	//   }

	//   printFiles()

	

	function changeValue(e){
		section = e.target.id;
		setValue(section);
		console.log(value);
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		  });
		  
	}
	

	return (

		<main>
		<div className='navbar'>
			
				<div className='logo'>
					<a href='/'>
						<img src='/Logo.svg'></img>
					
					<h2 className='interact-text'>
						INTERACT <br/> 2023
					</h2>

					</a>
				</div>
			
				<div className="bottom-border">
					<a href='/cfp' className="go-back"><img src="/Polygon 1.svg" alt=""/> Submissions</a>
				</div>
	
				<ul className='nav-items' id="nav-items">
					
						{/* <h2><span className="large-pill">Submissions Open:</span></h2>
						<li><a className="section-change highlight" onClick={changeValue} id='0'>Full Papers</a></li>
						<li><a className="section-change highlight" onClick={changeValue} id='6'>Workshops</a></li>
					<div className="bottom-border go-back"></div>
						
		
					

					<li><a className="section-change" onClick={changeValue} id='1'>Short Papers</a></li>
					<li><a className="section-change" onClick={changeValue} id='2'>Posters</a></li>
					<li><a className="section-change" onClick={changeValue} id='3'>Panels</a></li>
					<li><a className="section-change" onClick={changeValue} id='4'>Interactive Demos</a></li>
					<li><a className="section-change" onClick={changeValue} id='5'>Courses</a></li>
					<li><a className="section-change" onClick={changeValue} id='7'>Doctoral Consortium</a></li>
					<li><a className="section-change" onClick={changeValue} id='8'>Industrial <br/> Experiences</a></li> */}

					<li><a className="section-change" onClick={changeValue} id='1'>Full Papers</a></li>
					<li><a className="section-change" onClick={changeValue} id='2'>Short Papers</a></li>
					<li><a className="section-change" onClick={changeValue} id='3'>Posters</a></li>
					<li><a className="section-change" onClick={changeValue} id='4'>Panels</a></li>
					<li><a className="section-change" onClick={changeValue} id='5'>Interactive Demos</a></li>
					<li><a className="section-change" onClick={changeValue} id='6'>Courses</a></li>
					<li><a className="section-change" onClick={changeValue} id='7'>Workshops</a></li>
					<li><a className="section-change" onClick={changeValue} id='8'>Doctoral Consortium</a></li>
					<li><a className="section-change" onClick={changeValue} id='9'>Industrial <br/> Experiences</a></li>
					
				</ul>
			

		</div>

			<Content section={value}/>

		</main>
	
	)
  }


  const idMatchedIndex = (targetId) => {
	const arrayIndex = type.submissions_data.findIndex(function(element, i){
		return element.id == targetId;
	})
	return arrayIndex
};


  export function Content({section}){
	// try {
		// let val = idMatchedIndex(section).then(arrayIndex => {return arrayIndex});

		var title = type.submissions_data[section].title;
		var desc = type.submissions_data[section].descriptions;
		var detail = type.submissions_data[section].details;
		var link = type.submissions_data[section].link;

		var buttonClassName;
		var anchorTagClassName;

		if(link != ""){
			buttonClassName = "submit-button"
			anchorTagClassName = ""
		} else {
			buttonClassName = "submit-button less-emphasis not-allowed"
			anchorTagClassName = "unclickable"
		}

		var imgLocation = "/" + title + ".svg";
			console.log(imgLocation);
	// } catch (err){
	// 	console.log(err);
	// }
	

	

	// const index = this.state.Index?.map((index, i) => {});
	// console.log(index);
return (
	<div>
			<section className='anonymity-content-1' id="ac1">

						<div className="top">
							<div className="flex">
								<div className="left">
									<div className="title">
									<img className="icon" src={imgLocation} alt="" />
										<h2>
											{title}
										</h2>

										
									</div>
									<a href={link} className={anchorTagClassName}>
										<button className={buttonClassName}>
											Submit
										</button>
									</a>
									
								</div>

								<div className="right">
									<h2>
										Essential Resources
									</h2>
									<div className="downloads">
										{/* <a className="file">
										<div className="info">
											<img src="/pdf.png" alt="" />
											<p>
												The Permission and Release Form for Photography, Video and Broadcasting
											</p>
											</div>
										</a> */}

										

										<a className="file" href="https://www.interact2021.org/templates/Springer_Guidelines_for_Authors_of_Proceedings_CS.pdf" target="_blank">

											<div className="info">
												<img src="/website.svg" alt="External Page" />
												<p>
													Springer Author Guidelines
												</p>
											</div>
											
											<img className="external" src="/external.svg" alt="External Page" />
										</a>

										<a className="file" href="https://www.interact2021.org/templates/splnproc1703.zip" target="_blank">

											<div className="info">
												<img src="/zip.svg" alt="External Page" />
												<p>
													Springer Word Templates
												</p>
											</div>
											
											<img className="external" src="/download.svg" alt="External Page" />
										</a>

										<a className="file" href="https://resource-cms.springernature.com/springer-cms/rest/v1/content/19238648/data/v6" target="_blank">

											<div className="info">
												<img src="/zip.svg" alt="External Page" />
												<p>
													Springer LaTeX Template
												</p>
											</div>
											
											<img className="external" src="/download.svg" alt="External Page" />
										</a>

									</div>
								</div>
							</div>
							<p className="description">
							<Markdown>{desc}</Markdown>
							</p>
						</div>
						
						<div className="bottom">
							<p className="details">
								<Markdown>{detail}</Markdown>
							</p>
						</div>
							
			</section>

		</div>
)
};

  export default SubNavbarJsx;
