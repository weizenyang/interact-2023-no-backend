import React, {useState} from "react";
import "../submissions.css";
import Markdown from 'markdown-to-jsx';


await fetch('/data/submission-details.yml')
.then(r => console.log(r));


const response = await fetch('/content.json');
const data = await response.json();
const type = data.data;


// console.log(type);

export function Navbar(){
	console.log(type.length)
}

export function SubNavbarJsx({id}) {

	var section = 0;

	if(id == null){
		section = 0;
	} else {
		section = id;
	}

	const [value, setValue] = useState(section);


	

	// console.log(value);

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
					<a href='/cfp' class="go-back" id='0'><img src="/Polygon 1.svg" alt=""/> Submissions</a>
				</div>
	
				<ul className='nav-items' id="nav-items">
					
					<li><a className="section-change" onClick={changeValue} id='0'>Full Papers</a></li>
					<li><a className="section-change" onClick={changeValue} id='1'>Short Papers</a></li>
					<li><a className="section-change" onClick={changeValue} id='2'>Posters</a></li>
					<li><a className="section-change" onClick={changeValue} id='3'>Panels</a></li>
					<li><a className="section-change" onClick={changeValue} id='4'>Interactive Demos</a></li>
					<li><a className="section-change" onClick={changeValue} id='5'>Courses</a></li>
					<li><a className="section-change" onClick={changeValue} id='6'>Workshops</a></li>
					<li><a className="section-change" onClick={changeValue} id='7'>Doctoral Consortium</a></li>
					<li><a className="section-change" onClick={changeValue} id='8'>Industrial <br/> Experiences</a></li>
					
				</ul>
			

		</div>

			<Content section={value}/>

		</main>
	
	)
  }

  const Content = ({section}) =>{
	console.log(section);
	var title = type[section].attributes.title;
	var desc = type[section].attributes.descriptions;
	var detail = type[section].attributes.details;
	var imgLocation = "/" + title + ".svg";
	      console.log(imgLocation)  ;

	return(
		<div>
				<section className='anonymity-content-1' id="ac1">
	
							<div className="top">
								<div className="flex">
									<div className="left">
										<div class="title">
										<img class="icon" src={imgLocation} alt="" />
											<h2>
												{title}
											</h2>

											
										</div>
										
										<button class="submit-button less-emphasis">
											Submit
										</button>
									</div>

									<div className="right">
										<h2>
											Essential Resources
										</h2>
										<div className="downloads">
											{/* <a className="file">
											<div class="info">
												<img src="/pdf.png" alt="" />
												<p>
													The Permission and Release Form for Photography, Video and Broadcasting
												</p>
												</div>
											</a> */}

											<a className="file" href="https://www.springernature.com/gp/authors/campaigns/latex-author-support" target="_blank">

												<div class="info">
													<img src="/website.svg" alt="External Page" />
													<p>
														LaTeX Springer Template
													</p>
												</div>
												
												<img class="external" src="/external.svg" alt="External Page" />
											</a>

											<a className="file" href="https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines" target="_blank">

												<div class="info">
													<img src="/website.svg" alt="External Page" />
													<p>
														Springer LNCS Template
													</p>
												</div>
												
												<img class="external" src="/external.svg" alt="External Page" />
											</a>

											<a className="file" href="https://www.interact2021.org/templates/splnproc1703.zip" target="_blank">

												<div class="info">
													<img src="/PDF.svg" alt="External Page" />
													<p>
														Word Format and Template
													</p>
												</div>
												
												<img class="external" src="/download.svg" alt="External Page" />
											</a>
										</div>
									</div>
								</div>
								<p className="description">
								{desc}
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

  }

// function Page() {

// 	return (
		
// 			<SubNavbarJsx />
// 			<Content section='1' />
		

	
// 	)
//   }

  export default SubNavbarJsx;
