"use strict";


let form = document.querySelector('.form');
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
    let curLoc = `https://www.google.com/maps/@${latitude},${longitude}`;
    console.log(curLoc);
    const coords = [latitude, longitude]

    map = L.map("map").setView(coords, 13);
    console.log(map)

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    
    map.on('click', function(mapE){
        mapEvent = mapE;
        form.classList.remove('hidden')
    })
  },
  function () {
    alert(`we dont know where you are`);
  }
);

form.addEventListener('submit', function(e){
    e.preventDefault()
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


