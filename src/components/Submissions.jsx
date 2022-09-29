import React, {useState} from "react";
import "../submissions.css";
import Markdown from 'markdown-to-jsx';


const response = await fetch('http://localhost:1337/api/submissions');
const data = await response.json();
const type = data.data;


// console.log(type);



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
	}
	

	return (

		<main>
		<div className='navbar'>
			<div>
				<div className='logo'>
					<a href='/'>
						<img src='/Logo.svg'></img>
					</a>
					<h2 className='interact-text'>
						INTERACT <br/> 2023
					</h2>
				</div>
	
				<div className="nav-items bottom-border">
					<a href='/cfp' class="go-back" id='0'><img src="/public/Polygon 1.svg" alt=""/>Submissions</a>
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

		</div>

			<Content section={value}/>

		</main>
	
	)
  }

  const Content = ({section}) =>{
	console.log(section);
	var title = type[section].attributes.title;
	var desc = type[section].attributes.descriptions;
	var detail = marked.parse(type[section].attributes.details);           

	return(
		<div>
				<section className='anonymity-content-1' id="ac1">
	
							<div className="top">
								<div className="flex">
									<div className="left">
										<h2 className="title">
											{title}
										</h2>
										<button class="submit-button">
											Submit
										</button>
									</div>

									<div className="right">
										<h2>
											Essential Documents
										</h2>
										<div className="downloads">
											<div className="file">
												<img src="/pdf.png" alt="" />
												<p>
													The Permission and Release Form for Photography, Video and Broadcasting
												</p>
											</div>

											<div className="file">
												<img src="/pdf.png" alt="" />
												<p>
													Copyright Form
												</p>
											</div>
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
