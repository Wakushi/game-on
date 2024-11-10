export default class Header {
  constructor() {
    this.header = document.querySelector("header")
    this.#bindEvents()
  }

  #bindEvents() {
    this.header
      .querySelector(".hamburger")
      .addEventListener("click", () => this.#toggleNav())
    this.header
      .querySelector(".close")
      .addEventListener("click", () => this.#toggleNav())
  }

  #toggleNav() {
    this.header.querySelector(".main-navbar").classList.toggle("active")
  }
}
