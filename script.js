"use strict";

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }

  _setDescription(){
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 
    'September', 'October', 'December']

    this.description = `${this.type.slice(0)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`
  }
}

class Running extends Workout {
  type = "Running";
  constructor(coords, distance, duration, pace) {
    super(coords, distance, duration);
    this.pace = pace;
    this.calcPace();
    this._setDescription()
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = "Cycling";
  constructor(coords, distance, duration, speed) {
    super(coords, distance, duration);
    this.speed = speed;
    this.calcSpeed();
    this._setDescription()
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
  #workouts = [];
  constructor() {
    this._getPositions();
    form.addEventListener("submit", this._newWorkout.bind(this));
    inputType.addEventListener("change", this._toggleElevationField);
   
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
    console.log(coords);
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

    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));
    const posNumbers = (...inputs) => inputs.every((inp) => inp > 0);

    //get data from the form
    const type = inputType.value;
    const distance = Number(inputDistance.value);
    const duration = Number(inputDuration.value);
    let workout;
    let { lat, lng } = this.#mapEvent.latlng;
    console.log(this.#mapEvent);
    //if workout running, create running object
    if (type === "Running") {
      const cadence = Number(inputCadence.value);

      //check if data is valid
      if (
        !validInputs(cadence, distance, duration) ||
        !posNumbers(cadence, distance, duration)
      )
        alert(`inputs has to be positive numbers`);
      workout = new Running([lat, lng], distance, duration, cadence);
    }
    this.#workouts.push(workout);
    console.log(workout);

    //if workout cycling, create cycling object
    if (type === "Cycling") {
      const elevation = Number(inputElevation.value);

      if (
        !validInputs(elevation, distance, duration) ||
        !posNumbers(distance, duration)
      )
        alert(`inputs has to be positive numbers`);
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    //add new object to workout array
    this.#workouts.push(workout);
    console.log(workout);

    //render workout ON map as marker
    this._renderWorkoutMarker(workout);

    //render workout on list
    this._renderWorkout(workout)

    //Hide form + clear input fields
    inputDuration.value = inputCadence.value = inputDistance.value = "";
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 50,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${workout.type}💯`)
      .openPopup();
  }

  _renderWorkout(workout) {
    let html = `
         <li class="workout workout--${workout.type}" data-id="1234567890">
         <h2 class="workout__title">Running on April 14</h2>
      <div class="workout__details">
         <span class="workout__icon">${workout.type === 'Running' ? '🏃‍♂️' : '🚵'}</span>
         <span class="workout__value">${workout.distance}</span>
         <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
      </div>
      `;

      if(workout.type === 'Running'){
        html += `
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.pace}</span>
        <span class="workout__unit">min/km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value">${workout.cadence}</span>
        <span class="workout__unit">spm</span>
      </div>
        `

        if(workout.type === 'Cycling'){
          html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevation}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>
          `;

          form.insertAdjacentHTML('afterend', html)
        }
      }
  }

}
const app = new App();

// navigator.geolocation.getCurrentPosition ასე ვიძახებთ ახლანდელ პოზიციას და getCurrentPosition-ს გადაეცემა ორი ფუნქცია
// რომლებიც მოქმედებენ შემდეგ ნაირად, თუ ახლანდელ ადგილს იპოვნის უპრობლეოდ მაშინ შევდა პირველ ფუნქციაში, სადაც ჩვენ გვაქვს
// პარამეტრად position-ი, რომელიც საშუალებას გვაძლევს ვიმოქმედოთ დაბრუნებულ ლოკაციებზე. და თუ ვერ იპოვის ახლანდელ ადგილს,~
// მაშინ შევა მეორე ფუნქციაში და გამოიტანას შეცდომას. ასევე ამ კონკრეტულ ფუნქციაში ვაკეთებთ დესტრუქტურირებას და კოორდინატებიდან ვიღებთ
// გრძედს და განედს. ასევე შემდეგ ვლოგავთ ჩვენს კონკრეტულ ადგილს მათი გამოყენებით, ოღონდ ვაკოპირებთ google.map-დან და კოორდინატების ადგილას
// ვწერთ ჩვენს კონკრეტულ კოორდინატებს.
