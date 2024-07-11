
const decodeBtn = document.querySelector("#decode");
const encodeBtn = document.querySelector("#encode");
const fileForm = document.querySelector("#fileform");
const uploadFile = document.querySelector("#uploadfile")
const submitBtn = document.querySelector("#submitbtn");
const alertSection = document.querySelector(".alert");
const progress = document.querySelector(".progress");



isSubmitted = false;

const showAlert = ( message, type="success") => {
	alertSection.innerHTML = null;
	switch (type) {
		case 'danger':
			alertSection.className = "alert alert-dismissible alert-danger my-2"
			break;
		case 'success':
			alertSection.className = "alert alert-dismissible alert-success my-2"
			break;
		case 'warn':
			alertSection.className = "alert alert-dismissible alert-warning my-2"
			break;
		case 'null':
			alertSection.className = "alert my-2"
			break;
	}

	const mesg = document.createElement("div");
	mesg.innerHTML = message;
	alertSection.appendChild(mesg);

	const closeBtn = document.createElement("button");
	closeBtn.className = "btn-close";
	closeBtn.setAttribute( "data-bs-dismiss", "alert" );
	closeBtn.onclick = () => {
		alertSection.innerHTML = null;
		alertSection.className = "alert";
	}
	alertSection.appendChild(closeBtn);
}

// when submit button is clicked
submitBtn.onclick = function () {
	var uploadedFile = uploadFile.files[0];
	if (uploadedFile === undefined) {
		showAlert("No file uploaded.\nPlease upload a valid .txt file and try again!", "danger");
		return;
	}
	let nameSplit = uploadedFile.name.split('.');
	var extension = nameSplit[nameSplit.length - 1].toLowerCase();
	if (extension != "txt") {
		showAlert("Invalid file type (." + extension + ") \nPlease upload a valid .txt file and try again!", "danger");
		return;
	}				
	showAlert("File submitted!", "success");
	isSubmitted = true;		
	showAlert("Done!! File uploaded !", "success");
}

/// when compress button is clicked
encodeBtn.onclick = async function () {
	var uploadedFile = uploadFile.files[0];
	if (uploadedFile === undefined) {
		showAlert("No file uploaded.\nPlease upload a file and try again!", "danger");
		return;
	}
	if (isSubmitted === false) {
		showAlert("File not submitted.\nPlease click the submit button on the previous step\nto submit the file and try again!", "danger");
		return;
	}
	
	showAlert("Done!! Your file will be Compressed", "success");
	showProgress("Compressing your file ...");
	
	var fileReader = new FileReader();
	fileReader.onload = function (fileLoadedEvent) {
		let text = fileLoadedEvent.target.result;
		let [encodedString, outputMsg] = window.api.encode(text)
		showProgress("Compressing your file ...");
		myDownloadFile(uploadedFile.name.split('.')[0] + "_compressed.txt", encodedString);
		showAlert(outputMsg);
	}
	fileReader.readAsText(uploadedFile, "UTF-8");
}

// when decompress button is clicked
decodeBtn.onclick = function () {
	console.log("decode onclick");
	var uploadedFile = uploadFile.files[0];
	if (uploadedFile === undefined) {
		alert("No file uploaded.\nPlease upload a file and try again!");
		return;
	}
	if (isSubmitted === false) {
		alert("File not submitted.\nPlease click the submit button on the previous step\nto submit the file and try again!");
		return;
	}
	showAlert("Done!! Your file will be De-compressed");
	var fileReader = new FileReader();
	fileReader.onload = function (fileLoadedEvent) {
		let text = fileLoadedEvent.target.result;
		let [decodedString, outputMsg] = window.api.decode(text);
		showProgress("De-compressing your file ...", "Decompressed");
		myDownloadFile(uploadedFile.name.split('.')[0] + "_decompressed.txt", decodedString);
		showAlert(outputMsg);
	}
	fileReader.readAsText(uploadedFile, "UTF-8");
}

// show the progressbar
function showProgress(secMsg) {
	const prog = document.createElement("div");
	prog.className = "progress-bar progress-bar-striped bg-success";
	prog.setAttribute("role", "progressbar");
	prog.setAttribute("aria-valuemax", "100");
	prog.setAttribute("aria-valuemin", "0");
	prog.setAttribute("aria-valuenow", '5');
	prog.setAttribute("style", `width: 5%;`);
	progress.appendChild(prog);
	
	let val = 0

	const doProgress = setInterval(() => {
		val += 20;
		console.log(val);
		prog.setAttribute("style", `width: ${val}%;`);
		prog.setAttribute("ari-valuenow", (val).toString());
		prog.setAttribute("ari-valuenow", `${val}`);
		progress.innerHTML = null;
		progress.appendChild(prog);
		console.log('val', val)
	}, 200);
	
	setTimeout(() => clearInterval(doProgress), 1000);


	decodeBtn.disabled = true;
	encodeBtn.disabled = true;
	showAlert(secMsg, "seccess");
}

/// function to download file
function myDownloadFile(fileName, text) {
	const link = document.createElement("a");
	const file = new Blob([text], { type: 'text/plain' });
	link.href = URL.createObjectURL(file);
	link.download = fileName;
	link.click();
	URL.revokeObjectURL(link.href);
}
