import Header from "./components/header.js"
import SignUpModalElement from "./components/signup-modal.js"

export default class App {
  static init() {
    new SignUpModalElement()
    new Header()
  }

  static toggleScroll() {
    document.body.classList.toggle("no-scroll")
  }
}

App.init()
