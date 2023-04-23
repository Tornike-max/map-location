"use strict";


let form = document.querySelector('.form');
let inputDistance = document.querySelector('.form__input--distance')
let inputCadence = document.querySelector('.form__input--cadence');
let inputDuration = document.querySelector('.form__input--duration');
let inputElevation = document.querySelector('.form__input--elevation')
let inputType = document.querySelector('.form__input--type');
let map,mapEvent;
// navigator.geolocation.getCurrentPosition ასე ვიძახებთ ახლანდელ პოზიციას და getCurrentPosition-ს გადაეცემა ორი ფუნქცია
// რომლებიც მოქმედებენ შემდეგ ნაირად, თუ ახლანდელ ადგილს იპოვნის უპრობლეოდ მაშინ შევდა პირველ ფუნქციაში, სადაც ჩვენ გვაქვს
// პარამეტრად position-ი, რომელიც საშუალებას გვაძლევს ვიმოქმედოთ დაბრუნებულ ლოკაციებზე. და თუ ვერ იპოვის ახლანდელ ადგილს,~
// მაშინ შევა მეორე ფუნქციაში და გამოიტანას შეცდომას. ასევე ამ კონკრეტულ ფუნქციაში ვაკეთებთ დესტრუქტურირებას და კოორდინატებიდან ვიღებთ
// გრძედს და განედს. ასევე შემდეგ ვლოგავთ ჩვენს კონკრეტულ ადგილს მათი გამოყენებით, ოღონდ ვაკოპირებთ google.map-დან და კოორდინატების ადგილას
// ვწერთ ჩვენს კონკრეტულ კოორდინატებს.
navigator.geolocation.getCurrentPosition(
  function (position) {
    let { latitude } = position.coords;
    let { longitude } = position.coords;

    const coords = [latitude, longitude]

    map = L.map("map").setView(coords, 14);
  

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    
    map.on('click', function(mapE){
        mapEvent = mapE;
        form.classList.remove('hidden')
        inputDistance.focus()
    })
  },
  function () {
    alert(`we dont know where you are`);
  }
);


form.addEventListener('submit', function(e){
  e.preventDefault();

  inputDuration.value = inputCadence.value = inputDistance.value = ''

  let { lat, lng } = mapEvent.latlng
  L.marker([lat,lng])
  .addTo(map)
  .bindPopup(
      L.popup({
          maxWidth: 250,
          minWidth:50,
          autoClose:false,
          closeOnClick:false,
          className:'running-popup'
      })
  )
  .setPopupContent('Current location')
  .openPopup();
})


inputType.addEventListener('change', function(e){
  e.preventDefault();
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
})