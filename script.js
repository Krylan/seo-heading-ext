function getHeadings() {
	let report = ['',''];
	let headings = ['','','','','',''];
	let headingsCount = [0,0,0,0,0,0];
	let i = 1;
	const ghostIcon = '<span class="label hidden" title="This heading is non-visible (directly or by parents\' styles)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.885 14.988l3.104-3.098.011.11c0 1.654-1.346 3-3 3l-.115-.012zm8.048-8.032l-3.274 3.268c.212.554.341 1.149.341 1.776 0 2.757-2.243 5-5 5-.631 0-1.229-.13-1.785-.344l-2.377 2.372c1.276.588 2.671.972 4.177.972 7.733 0 11.985-8.449 11.985-8.449s-1.415-2.478-4.067-4.595zm1.431-3.536l-18.619 18.58-1.382-1.422 3.455-3.447c-3.022-2.45-4.818-5.58-4.818-5.58s4.446-7.551 12.015-7.551c1.825 0 3.456.426 4.886 1.075l3.081-3.075 1.382 1.42zm-13.751 10.922l1.519-1.515c-.077-.264-.132-.538-.132-.827 0-1.654 1.346-3 3-3 .291 0 .567.055.833.134l1.518-1.515c-.704-.382-1.496-.619-2.351-.619-2.757 0-5 2.243-5 5 0 .852.235 1.641.613 2.342z"/></svg></span>';
	
	report[1] += '<div class="report_section"><ul>';
	document.body.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(function(elem){
		let headingArrayIndex = parseInt(elem.tagName.substring(1))-1;
		let ghost = '';

		if(elem.style.display == 'none'){ elem.style.display = 'block';ghost = ghostIcon; }
		if(elem.style.visibility == 'hidden'){ elem.style.display = 'visible';ghost = ghostIcon; }
		for (let i = elem.parentNode; i !== document; i = i.parentNode ) {
			let style = window.getComputedStyle(i);
			if(style.display == 'none'){ ghost = ghostIcon; }
			if(style.visibility == 'hidden'){ ghost = ghostIcon; }
		}
		elem.style.border = "2px dotted #F00";
		elem.dataset.headingext = i;
		headings[headingArrayIndex] += '<li class="'+elem.tagName.toLowerCase()+'"><span class="report_title" data-headingext="'+i+'">'+elem.tagName+'</span>'+ghost+elem.innerHTML.replaceAll('<', '&lt;').replaceAll('>', '&gt;')+'</li>';
		
		report[1] += '<li class="order '+elem.tagName.toLowerCase()+'"><span class="report_title" data-headingext="'+i+'">'+elem.tagName+'</span>'+ghost+elem.innerHTML.replaceAll('<', '&lt;').replaceAll('>', '&gt;')+'</li>';
		
		headingsCount[headingArrayIndex]++;
		i++;
	});
	report[1] += '</ul></div>';
	
	headings.forEach(function(headingReport, index){
		report[0] += '<div class="report_section">H'+(index+1)+' ('+headingsCount[index]+')<ul>'+headingReport+'</ul></div>';
	});
	
	if(!document.querySelector('style#seo-heading-ext')){
		let style = document.createElement("style");
		style.setAttribute('id', 'seo-heading-ext');
		style.innerText += 'h1:before, h2:before, h3:before, h4:before, h5:before, h6:before{ background-color:#F00;color:#FFF;font-size:12px;margin-top:-18px;padding:2px 4px;position: absolute;border-radius:4px;border-radius:4px;z-index: 1000;line-height: initial; }';
		style.innerText += 'h1:before{ content: "H1"; }h2:before{ content: "H2"; }h3:before{ content: "H3"; }h4:before{ content: "H4"; }h5:before{ content: "H5"; }h6:before{ content: "H6"; }';
		document.head.appendChild(style);
	}
	
	return report;
}

function goToHeading(number){
	chrome.tabs.executeScript({
		code: 'var headingNumber = ' + number
	}, function() {
		chrome.tabs.executeScript({	code: '(' + scrollToHeading + ')();' });
	});
}
function scrollToHeading(){
	const element = document.body.querySelector('[data-headingext="'+headingNumber+'"]');
	const y = element.getBoundingClientRect().top + window.pageYOffset - 100;
	window.scrollTo({top: y, behavior: 'smooth'});
}

function generateReport(){
	chrome.tabs.executeScript({
		code: '(' + getHeadings + ')();'
	}, (results) => {
		if(results === undefined){
			document.querySelector('#error').style.display = 'block';
		}else{
			document.querySelector('#error').style.display = 'none';
			document.querySelector('#report-type').innerHTML = results[0][0];
			document.querySelector('#report-order').innerHTML = results[0][1];
			document.querySelectorAll('.report_title').forEach(function(elem){
				elem.addEventListener('click', () => {
					goToHeading(elem.dataset.headingext);
				});
			});
		}
	});
}

document.querySelector('#tab-type').addEventListener('click', () => {
	document.querySelector('#report-order').style.display = 'none';
	document.querySelector('#report-type').style.display = 'block';
	document.querySelector('#tab-order').classList.remove('active');
	document.querySelector('#tab-type').classList.add('active');
});

document.querySelector('#tab-order').addEventListener('click', () => {
	document.querySelector('#report-order').style.display = 'block';
	document.querySelector('#report-type').style.display = 'none';
	document.querySelector('#tab-order').classList.add('active');
	document.querySelector('#tab-type').classList.remove('active');
});

document.querySelector('#refresh').addEventListener('click', () => {
	generateReport();
});

window.onload = function() {
	generateReport();
};