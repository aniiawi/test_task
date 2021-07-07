let pixelPerDay = 20;

function getText(url){
// read text from URL location
	var request = new XMLHttpRequest();
	request.open('GET', url, false);
	request.send(null);
	if (request.status === 200) {
        return request.responseText;
	}
	console.log('ERROR: ' + url);
}

// get json
let jsonData = getText('/data.json');
// parse json
let fdata = JSON.parse(jsonData);

//calculate start and end times 
let beginTime = Number.MAX_SAFE_INTEGER;
let endTime = 0;
for (let eventCntr in fdata) {
    fdata[eventCntr].startDate = new Date(fdata[eventCntr].start_date);
    fdata[eventCntr].endDate = new Date(fdata[eventCntr].end_date);
    let eventStartTime = fdata[eventCntr].startDate.getTime();
	if (beginTime > eventStartTime) {
		beginTime = eventStartTime;
	}
	let eventEndTime = fdata[eventCntr].endDate.getTime();
	if (endTime < eventStartTime) {
		endTime = eventEndTime;
	}
}

// calculate how many days between start time and end time
// one day in milliseconds
const day = 1000 * 60 * 60 * 24;
endTime += day; 
let daysCount = Math.floor((endTime - beginTime) / day);

// fill block with dates
let dateList = document.getElementById('hour');
let dateCntr = new Date();

for (i = 0; i < daysCount; i++){
	// calculating days in a month
	dateCntr.setTime(beginTime + day * i);
	// creating div
	let newDiv = document.createElement('div');
	// set classname for style
	newDiv.className = 'dur-div hour-div';
	// format dates (DD.MM) 
	newDiv.innerHTML = dateCntr.getDate() + '.' + (dateCntr.getMonth() + 1);
	// append div to page
	dateList.appendChild(newDiv);
}

let eventContainer = document.getElementById('event-list');
for (let eventCntr in fdata) {
	// row container
	let contDiv = document.createElement('div');
	contDiv.className = 'desc';
	contDiv.id = 'task' + fdata[eventCntr].id;
	// name element 
	let nameDiv = document.createElement('div');
	nameDiv.innerHTML = fdata[eventCntr].name;
	nameDiv.className = 'event';
	contDiv.appendChild(nameDiv);
	// each date has 1 div, if its task day - blue, else white
	dateCntr = new Date();
	for (i = 0; i < daysCount; i++){ 
		dateCntr.setTime(beginTime + day * i);
		let timeDiv = document.createElement('div');
		timeDiv.className = 'dur-div';
		//check if current date is in task period
		if (fdata[eventCntr].startDate <= dateCntr && fdata[eventCntr].endDate >= dateCntr) {
			timeDiv.style.background = 'blue';
			timeDiv.style.height = '16px';
		}
 		// appending this to contDiv
		contDiv.appendChild(timeDiv);
	}
	// appending div to page
	eventContainer.appendChild(contDiv);
}