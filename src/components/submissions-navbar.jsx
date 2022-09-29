import React, {useState} from "react";
// import * as ReactDOM from 'react-dom';
import "../submissions.css";
import { marked } from "marked";
import Markdown from 'markdown-to-jsx';
import SubNavbar from '../components/submissions-navbar'

const response = await fetch('http://localhost:1337/api/submissions');
const data = await response.json();
const type = data.data;



console.log(type);

export default function SubNavbarJsx() {

	return (

		<div class='navbar'>
			<div>
				<div class='logo'>
					<a href='/'>
						<img src='/Logo.svg'></img>
					</a>
					<h2 class='interact-text'>
						INTERACT <br/> 2023
					</h2>
				</div>
	
				<div class="nav-items bottom-border go-back">
					<a href='/cfp' id='0'>Submissions</a>
				</div>
	
				<ul class='nav-items' id="nav-items">
					
					<li><a class="section-change" onClick={setValue(0)} id='0'>Full Papers</a></li>
					<li><a class="section-change" id='1'>Short Papers</a></li>
					<li><a class="section-change" id='2'>Courses</a></li>
					<li><a class="section-change" id='3'>Workshops</a></li>
					<li><a class="section-change" id='4'>Interactive Demos</a></li>
					<li><a class="section-change" id='5'>Posters</a></li>
					<li><a class="section-change" id='6'>Industrial Experiences</a></li>
					<li><a class="section-change" id='7'>Doctoral Consortium</a></li>
					<li><a class="section-change" id='8'>Panels</a></li>
				</ul>
			</div>
		</div>


	
	)
  }
	




