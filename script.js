"use strict";

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, pace) {
    super(coords, distance, duration);
    this.pace = pace;
    this.calcPace();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, speed) {
    super(coords, distance, duration);
    this.speed = speed;
    this.calcSpeed();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

//////////////////////////

let form = document.querySelector(".form");
let inputDistance = document.querySelector(".form__input--distance");
let inputCadence = document.querySelector(".form__input--cadence");
let inputDuration = document.querySelector(".form__input--duration");
let inputElevation = document.querySelector(".form__input--elevation");
let inputType = document.querySelector(".form__input--type");
let map, mapEvent;

class App {
  #map;
  #mapEvent;
  constructor() {
    this._getPositions();
    form.addEventListener("submit", this._newWorkout.bind(this));
    inputType.addEventListener("change", this._toggleElevationField);
    this._showForm();
  }

  _getPositions() {
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        alert(`we dont know where you are`);
      }
    );
  }

  _loadMap(position) {
    let { latitude } = position.coords;
    let { longitude } = position.coords;

    const coords = [latitude, longitude];

    this.#map = L.map("map").setView(coords, 14);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _toggleElevationField(e) {
    e.preventDefault();
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(e) {
    e.preventDefault();

    const validInputs = (...inputs) => inputs.every(inp=> Number.isFinite(inp))
    const posNumbers = (...inputs) => inputs.every(inp=> inp > 0)

    //get data from the form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    //if workout running, create running object
    if (type === "running") {
      const cadence = +inputCadence.value;

      //check if data is valid
      if (
        // !Number.isFinite(cadence) ||
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration)

        !validInputs(cadence, distance, duration) ||
        !posNumbers(cadence, distance, duration)
      )
        alert(`inputs has to be positive numbers`);
    }

    //if workout cycling, create cycling object
    if (type === "cycling") {
      const elevation = +inputElevation.value;

      if (
        // !Number.isFinite(cadence) ||
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration)

        !validInputs(elevation, distance, duration) ||
        !posNumbers(distance, duration)
      )
        alert(`inputs has to be positive numbers`);
    }

    //add new object to workout array

    //render workout ON map as marker
    let { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 50,
          autoClose: false,
          closeOnClick: false,
          className: "running-popup",
        })
      )
      .setPopupContent("Current location")
      .openPopup();

    //render workout on list

    //Hide form + clear input fields
    inputDuration.value = inputCadence.value = inputDistance.value = "";
  }
}
const app = new App();

// navigator.geolocation.getCurrentPosition ასე ვიძახებთ ახლანდელ პოზიციას და getCurrentPosition-ს გადაეცემა ორი ფუნქცია
// რომლებიც მოქმედებენ შემდეგ ნაირად, თუ ახლანდელ ადგილს იპოვნის უპრობლეოდ მაშინ შევდა პირველ ფუნქციაში, სადაც ჩვენ გვაქვს
// პარამეტრად position-ი, რომელიც საშუალებას გვაძლევს ვიმოქმედოთ დაბრუნებულ ლოკაციებზე. და თუ ვერ იპოვის ახლანდელ ადგილს,~
// მაშინ შევა მეორე ფუნქციაში და გამოიტანას შეცდომას. ასევე ამ კონკრეტულ ფუნქციაში ვაკეთებთ დესტრუქტურირებას და კოორდინატებიდან ვიღებთ
// გრძედს და განედს. ასევე შემდეგ ვლოგავთ ჩვენს კონკრეტულ ადგილს მათი გამოყენებით, ოღონდ ვაკოპირებთ google.map-დან და კოორდინატების ადგილას
// ვწერთ ჩვენს კონკრეტულ კოორდინატებს.
