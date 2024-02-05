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
  }

  closeModal() {
    this.modal.style.display = "none"
  }
}

class SignUpFormElement {
  constructor() {
    this.formElement = document.querySelector(".signin-form")
    this.userInputList = document.querySelectorAll(".text-control")
    this.termsCheckbox = document.querySelectorAll("#checkbox1")
    this.locationRadios = document.querySelectorAll("input[name='location']")
    this.form = new Form("signin-form")
    this._bindEvents()
  }

  _bindEvents() {
    this.form.addEventListener("submit", (e) => this.onSubmit(e))
  }
}

class Form {
  errors = []

  constructor(formHook) {
    this.form = document.querySelector(formHook)
    this.#registerInputs()
  }

  #registerInputs() {
    this.inputs = this.form.querySelectorAll("input")
    console.log(this.inputs)
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
    // const event = new CustomEvent("formError", { detail: this.errors })
    // document.dispatchEvent(event)
  }
}

class FormError {
  //   constructor(field) {
  //     this.field = field
  //     this.message = this.getErrorMessage()
  //     this.hook = document.querySelector(`.${field}-error`)
  //   }
  //   render() {
  //     this.hook.innerText = this.message
  //   }
  //   reset() {
  //     this.hook.innerText = ""
  //   }
  //   getErrorMessage() {
  //     switch (this.field) {
  //       case "firstName":
  //         return "Le prénom doit contenir au moins 2 caractères"
  //       case "lastName":
  //         return "Le nom doit contenir au moins 2 caractères"
  //       case "email":
  //         return "L'email n'est pas valide"
  //       case "contestAmount":
  //         return "Veuillez choisir un nombre de concours"
  //       case "location":
  //         return "Veuillez choisir une ville"
  //       case "terms":
  //         return "Veuillez accepter les conditions d'utilisation"
  //       default:
  //         return "Erreur inconnue"
  //     }
  //   }
}

class App {
  static init() {
    new SignUpModalElement()
  }
}

App.init()

document.addEventListener("modalLaunched", (e) => {
  console.log("Modal launched", e.detail)
})
