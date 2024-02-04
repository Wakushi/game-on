class SignUpModalElement {
	constructor() {
		this.modal = document.querySelector(".bground")
		this.modalBtn = document.querySelectorAll(".modal-btn")
		this.clodeModalBtn = document.querySelector(".close")
		this._bindEvents()
	}

	_bindEvents() {
		this.modalBtn.forEach((btn) =>
			btn.addEventListener("click", () => this.launchModal())
		)
		this.clodeModalBtn.addEventListener("click", () => this.closeModal())
	}

	launchModal() {
		this.modal.style.display = "block"
		this.signUpForm = new SignUpFormElement()
		const event = new CustomEvent("modalLaunched", {
			detail: { coucou: "toto" }
		})
		document.dispatchEvent(event)
	}

	closeModal() {
		this.modal.style.display = "none"
	}
}

class SignUpFormElement {
	constructor() {
		this.form = document.querySelector(".signin-form")
		this.inputList = document.querySelectorAll(".text-control")
		this._bindEvents()
	}

	_bindEvents() {
		this.form.addEventListener("submit", (e) => this.onSubmit(e))
	}

	onSubmit(e) {
		e.preventDefault()
		const formData = {}
		const selectedLocation = document.querySelector(
			'input[name="location"]:checked'
		)
		const termsCheckbox = document.querySelector("#checkbox1")
		this.inputList.forEach((input) => {
			formData[input.name] = input.value
		})
		formData.location = selectedLocation?.value || null
		formData.terms = termsCheckbox?.checked

		const {
			firstName,
			lastName,
			email,
			birthdate,
			contestAmount,
			location,
			terms
		} = formData

		const form = new Form(
			firstName,
			lastName,
			email,
			birthdate,
			contestAmount,
			location,
			terms
		)
		console.clear()

		console.log("formData :", formData)
		console.log("Form :", form)

		if (form.isValid()) {
			console.log("Form is valid")
		} else {
			console.log("Form is not valid")
			console.log("Errors :", form.errors)
		}
	}
}

class FormError {
	constructor(field) {
		this.field = field
		this.message = this.getErrorMessage()
		this.hook = document.querySelector(`.${field}-error`)
	}

	render() {
		this.hook.innerText = this.message
	}

	reset() {
		this.hook.innerText = ""
	}

	getErrorMessage() {
		switch (this.field) {
			case "firstName":
				return "Le prénom doit contenir au moins 2 caractères"
			case "lastName":
				return "Le nom doit contenir au moins 2 caractères"
			case "email":
				return "L'email n'est pas valide"
			case "contestAmount":
				return "Veuillez choisir un nombre de concours"
			case "location":
				return "Veuillez choisir une ville"
			case "terms":
				return "Veuillez accepter les conditions d'utilisation"
			default:
				return "Erreur inconnue"
		}
	}
}

class Form {
	errors = []

	constructor(
		firstName,
		lastName,
		email,
		birthdate,
		contestAmount,
		location,
		terms
	) {
		this.firstName = firstName
		this.lastName = lastName
		this.email = email
		this.birthdate = birthdate
		this.contestAmount = contestAmount
		this.location = location
		this.terms = terms
	}

	isValid() {
		this.errors = []
		let isValid = true

		if (!this._isFirstNameValid()) isValid = false
		if (!this._isLastNameValid()) isValid = false
		if (!this._isEmailValid()) isValid = false
		if (!this._isContestAmountValid()) isValid = false
		if (!this._isLocationValid()) isValid = false
		if (!this._isTermsValid()) isValid = false
		this._renderErrors()
		return isValid
	}

	_renderErrors() {
		this.errors.forEach((error) => error.render())
	}

	resetErrors() {
		this.errors.forEach((error) => error.reset())
		this.errors = []
	}

	_isFirstNameValid() {
		if (!this.firstName.length || this.firstName.length < 2) {
			this._registerFormError(new FormError("firstName"))
			return false
		}
		return true
	}

	_isLastNameValid() {
		if (!this.lastName.length || this.lastName.length < 2) {
			this._registerFormError(new FormError("lastName"))
			return false
		}
		return true
	}

	_isEmailValid() {
		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
		if (!this.email.match(emailRegex)) {
			this._registerFormError(new FormError("email"))
			return false
		}
		return true
	}

	_isContestAmountValid() {
		if (!this.contestAmount) {
			this._registerFormError(new FormError("contestAmount"))
			return false
		}
		return true
	}

	_isLocationValid() {
		if (!this.location) {
			this._registerFormError(new FormError("location"))
			return false
		}
		return true
	}

	_isTermsValid() {
		if (!this.terms) {
			this._registerFormError(new FormError("terms"))
			return false
		}
		return true
	}

	_registerFormError(error) {
		this.errors.push(error)
		const event = new CustomEvent("formError", { detail: this.errors })
		document.dispatchEvent(event)
	}
}

class App {
	static init() {
		new SignUpModalElement()
	}
}

App.init()

document.addEventListener("formError", (e) => {
	console.log("Form error :", e.detail)
	if (e.detail.length > 0) {
		console.log("form invalide")
	}
})
// function editNav() {
// 	var x = document.getElementById("myTopnav")
// 	if (x.className === "topnav") {
// 		x.className += " responsive"
// 	} else {
// 		x.className = "topnav"
// 	}
// }
