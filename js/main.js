const buttonNext = document.querySelector('.button-next');
const buttonBack = document.querySelector('.button-back');
let currentStep = 1;
const form = document.querySelector('form');

buttonNext.addEventListener('click', function () {
	if (currentStep === 7) {
		dg.toast({
			type: 'neutral',
			html: '<p>Form submitted successfully</p>'
		})
		setTimeout(() => {
			form.submit();
		}, 1000);
		return;
	}

	currentStep++;

	if (currentStep !== 1) {
		buttonBack.style.opacity = '1';
	}

	if (currentStep === 4 && !isValidEmail(email.value)) {
		email.parentElement.classList.add('has-error');
		currentStep = 3;
		return;
	}
	email.parentElement.classList.remove('has-error');

	if (currentStep === 6 && !hasCheckedStatus()) {
		document.querySelector(`[data-step="${currentStep - 1}"]`).classList.add('has-error');
		currentStep = 5;
		return;
	}
	document.querySelector(`[data-step="${currentStep - 1}"]`).classList.remove('has-error');

	if (currentStep === 7 && !isValidTextAreaValue(cstRequest.value)) {
		cstRequest.parentElement.classList.add('has-error');
		currentStep = 6;
		return;
	}
	cstRequest.parentElement.classList.remove('has-error');

	if (currentStep === 7) {
		buttonNext.innerText = 'Submit appplication';
		resetSummaryData();
		fillSummary();
	}

	setPreviousProgressStyles();
	document.querySelector(`[data-step="${currentStep - 1}"]`).style.display = 'none';
	document.querySelector(`[data-step="${currentStep}"]`).style.display = 'block';
});

buttonBack.addEventListener('click', function () {
	if (currentStep === 1) {
		return;
	}

	currentStep--;
	resetNextProgressStyles();
	buttonNext.innerText = 'Next step';
	document.querySelector(`[data-step="${currentStep + 1}"]`).style.display = 'none';
	document.querySelector(`[data-step="${currentStep}"]`).style.display = 'block';
});

email.addEventListener('change', function () {
	if (!isValidEmail(email.value)) {
		email.parentElement.classList.add('has-error');
		currentStep = 3;
		return;
	}
	email.parentElement.classList.remove('has-error');
});

cstRequest.addEventListener('change', function () {
	if (!isValidTextAreaValue(cstRequest.value)) {
		cstRequest.parentElement.classList.add('has-error');
		currentStep = 6;
		return;
	}
	cstRequest.parentElement.classList.remove('has-error');
});

const isValidEmail = field => Boolean(field.trim()) && String(field)
	.toLowerCase()
	.match(
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	);

const hasCheckedStatus = () => {
	if (!student.checked && !employed.checked && !unemployed.checked) {
		return false;
	}
	return true;
};

const isValidTextAreaValue = field => Boolean(field.trim());


const getCountries = () => {
	axios.get('https://restcountries.com/v3.1/all')
		.then((response) => {
			const selectOption = document.querySelector('select');
			response.data.forEach((country) => {
				const option = document.createElement('option');
				option.value = country.name.common;
				option.innerText = country.name.common;
				selectOption.appendChild(option);
			});
		})
		.catch(error => console.error(error));
};
getCountries();

const setPreviousProgressStyles = () => {
	let step = currentStep;
	while (step > 1) {
		step--;
		const currentElement = document.querySelector(`[data-step-number="${step}"]`);
		currentElement.className = 'steps-completed';
		currentElement.children[0].className = 'material-icons steps-icon';
		currentElement.children[0].innerText = 'check';
		document.querySelector(`[data-step-number="${currentStep}"]`).className = 'steps-ongoing steps-selected';
	}
};

const resetNextProgressStyles = () => {
	let step = currentStep;
	while (step < 7) {
		step++;
		const currentElement = document.querySelector(`[data-step-number="${currentStep}"]`);
		const nextElement = document.querySelector(`[data-step-number="${step}"]`);
		currentElement.className = 'steps-ongoing steps-selected';
		currentElement.children[0].className = 'steps-number';
		currentElement.children[0].innerText = currentStep;
		nextElement.className = '';
		nextElement.children[0].className = 'steps-number';
		nextElement.children[0].innerText = step;
	}
};

const resetSummaryData = () => {
	document.querySelectorAll('[data-field]').forEach((element) => {
		element.innerText = '';
	});
};

const fillSummary = () => {
	const data = new FormData(form);
	for (const [key, value] of data.entries()) {
		const listItem = document.querySelector(`[data-field="${key}"]`);
		listItem.innerText = Boolean(listItem.innerText) ? listItem.innerText + ', ' + value : value;
	}
};
