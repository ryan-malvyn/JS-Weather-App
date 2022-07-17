//Defining Components;
const userInput = document.querySelector('.inputBox');
const submitButton = document.querySelector('.click-to-submit');
const weatherOutput = document.querySelector('.weatherResult');
const skinFeel = document.querySelector('.feelsLike');
const city = document.querySelector('.targetCity');
const currentCity = document.querySelector('.currentCity');
const icon = document.querySelector('#weatherIcon');
const imperial = document.querySelector('#fahrenheit');
const metric = document.querySelector('#celcius');
const radioInputs = document.querySelectorAll('input[name="metricOrImperial"]');

//Fetching API Data;
async function getWeatherdata() {
    const cityName = userInput.value;
    const APILink = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=186ddcae65d8d1ffd52e6cc67277b2e8`
    const response = await fetch(`${APILink}`)
    var data = await response.json()

    //Handling API Error;
    if(data.message == 'city not found'){
        alert('Please enter a correct city name.')
        userInput.value='';
    }

    //Getting Icons
        //Weather Condition
        const iconCode = data.weather[0].main
        let iconCodeArr = []
        switch (iconCode) {
            case 'Clear':
                iconCodeArr.push('01')
            break;
            
            case 'Clouds':
                iconCodeArr.push('02')
            break;

            case 'Rain':
                iconCodeArr.push('10')
            break;

            case 'Drizzle':
                iconCodeArr.push('09')
            break;

            case 'Thunderstorm':
                iconCodeArr.push('11')
            break;

            case 'Snow':
                iconCodeArr.push('13')
            break;

            default:
                iconCodeArr.push('50')
        }

        //Time of API Call
        var timeOfDay = new Date().getHours();
        if(timeOfDay <= 12 || iconCodeArr[0] !== '01'){
            iconCodeArr.push('d')
        } else if (timeOfDay >= 12 && iconCodeArr[0] == '01'){
            iconCodeArr.push('n')
        } else if (timeOfDay >= 12 && iconCodeArr[0] == '02'){
            iconCodeArr.push('n')
        }

        //Creating Link from Collected URL Data
        const openWeatherIconCode = iconCodeArr.join('')
        const fetchIconLink = await fetch(`http://openweathermap.org/img/wn/${openWeatherIconCode}@2x.png`);
        const iconURL = fetchIconLink.url

        //Looping through all radio buttons
        let metricImperial;
        for( const rb of radioInputs) {
                if(rb.checked){
                    metricImperial = rb.value;
                    break;
                }
        }

    //Temperature Data
    const currentTemp = data.main.temp
    const currentFeel = data.main.feels_like

    //Converting to Celcius
    const celciusTemp = Math.floor(currentTemp - 273.15);
    const celciusFeel = Math.floor(currentFeel - 273.15);

    //Converting to Fahrenheit
    const fahrenheitTemp = Math.floor((currentTemp - 273)*(9/5))+32
    const fahrenheitFeel = Math.floor((currentFeel - 273)*(9/5))+32

    //If the city entered is all lowercase
    const displayString = cityName.charAt(0).toUpperCase() + cityName.slice(1);

    //Displaying Celcius or Fahrenheit
    if(metricImperial == 'celcius'){
        weatherOutput.innerText = `It is currently ${celciusTemp} Degrees Celcius in `
        skinFeel.innerText = `Feels like : ${celciusFeel} Degrees Celcius in ${cityName}`

    } else if (metricImperial == 'fahrenheit'){
        weatherOutput.innerText = `It is currently ${fahrenheitTemp} Degrees Fahrenheit in `
        skinFeel.innerText = `Feels like : ${fahrenheitFeel} Degrees Fahrenheit in ${cityName}`
    }

    //Edge Cases
    if(userInput.value = null){
        alert('Please type in a city!');
    }

    //Updating Display
    icon.src=`${iconURL}`
    currentCity.innerText = `${displayString}`
    city.innerText = `${cityName}`
    userInput.value=''
}

//Updating Display & Event Listeners

userInput.addEventListener('keypress',function(e) {
    if(e.keyCode==13){
        getWeatherdata()
    }
});

submitButton.addEventListener('click',getWeatherdata);
