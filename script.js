function getHeadingsType() {
	let report = '';
	let headings = ['','','','','',''];
	let headingsCount = [0,0,0,0,0,0];
	let i = 1;
	
	document.body.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(function(elem){
		let headingArrayIndex = parseInt(elem.tagName.substring(1))-1;
		elem.style.border = "2px dotted #F00";
		elem.dataset.headingext = i;
		headings[headingArrayIndex] += '<li class="'+elem.tagName.toLowerCase()+'"><span class="report_title" data-headingext="'+i+'">'+elem.tagName+'</span>'+elem.innerHTML.replaceAll('<', '&lt;').replaceAll('>', '&gt;')+'</li>';
		headingsCount[headingArrayIndex]++;
		i++;
	});
	
	headings.forEach(function(headingReport, index){
		report += '<div class="report_section">H'+(index+1)+' ('+headingsCount[index]+')<ul>'+headingReport+'</ul></div>';
	});
	
	return report;
}

function getHeadingsOrder() {
	let report = '';
	let i = 1;
	report += '<div class="report_section"><ul>';
	document.body.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(function(elem){
		report += '<li class="order '+elem.tagName.toLowerCase()+'"><span class="report_title" data-headingext="'+i+'">'+elem.tagName+'</span>'+elem.innerHTML.replaceAll('<', '&lt;').replaceAll('>', '&gt;')+'</li>';
		i++;
	});
	report += '</ul></div>';
	
	return report;
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

function goToHeading(number){
	chrome.tabs.executeScript({
		code: 'var headingNumber = ' + number
	}, function() {
		chrome.tabs.executeScript({	code: '(' + scrollToHeading + ')();' });
	});
}
function scrollToHeading(){
	document.body.querySelector('[data-headingext="'+headingNumber+'"]').scrollIntoView();
}

document.querySelectorAll('#start, #refresh').forEach(function(elem){
	elem.addEventListener('click', () => {
		chrome.tabs.executeScript({
			code: '(' + getHeadingsType + ')();'
		}, (results) => {
			document.querySelector('#start-page').style.display = 'none';
			document.querySelector('#report-type').innerHTML = results[0];
			document.querySelectorAll('.report_title').forEach(function(elem2){
				elem2.addEventListener('click', () => {
					goToHeading(elem2.dataset.headingext);
				});
			});
		});
		
		chrome.tabs.executeScript({
			code: '(' + getHeadingsOrder + ')();'
		}, (results) => {
			document.querySelector('#report-order').innerHTML = results[0];
			document.querySelectorAll('.report_title').forEach(function(elem2){
				elem2.addEventListener('click', () => {
					goToHeading(elem2.dataset.headingext);
				});
			});
		});
	});
});