// INITIALIZATION
// entry point to websocket interface
var gateway = 'ws://${window.location.hostname}/ws';

// add event listener: opened connection
socket.addEventListener('open', function (event){
    console.log('Connected to websocket server');
});

// add event listener: message from server
socket.addEventListener('message', function (event){
    const rx_message = JSON.parse(event.data);
    console.log('Received message: ', rx_message);
    display_value(rx_message);
});

// add event listener: websocket error
socket.addEventListener('error', function (event){
    console.error('Websocket error: ', event)
});

// add event listener: closed connection
socket.addEventListener('close', function (event) {
    console.log('Connection closed');
});

//_________________________________________________________________

// DISPLAY CURRENT VALUES SECTION
function display_value(rx_message) {
    const fieldsMap = {
      'temp_in': 'inside_temperature_field',
      'temp_out': 'outside_temperature_field',
      'humd_in': 'inside_humidity_field',
      'humd_out': 'outside_humidity_field',
      'csms1': 'moisture_sens1_field',
      'csms2': 'moisture_sens2_field',
      'csms3': 'moisture_sens3_field'
    };
  
    for (const key in rx_message) {
      if (fieldsMap.hasOwnProperty(key)) {
        const fieldId = fieldsMap[key];
        const element = document.getElementById(fieldId);
        if (element) {
          element.value = rx_message[key];
        } else {
          console.error(`Element with ID '${fieldId}' not found.`);
        }
      }
    }
  }
  

// RADIO BUTTONS - Growlight position selection
// selects all radio buttons with common name atrribute
const radioButtons_growlight_position = document.querySelectorAll('input[name="growlight_position"]');
// add change event listener to each radio button
radioButtons_growlight_position.forEach(button => {
    button.addEventListener('change', function() {
    // get value of selected radio button
    const selectedOption = document.querySelector('input[name="growlight_position"]:checked').value;
    // create JSON object containing selected option
    const positionValues = {
      "position1": 1,
      "position2": 2,
      "position3": 3,
      "position4": 4,
      "position5": 5
    };
    var stage_position_value = positionValues[selectedOption] || 0;
    const data = {
        "stage_position": stage_position_value
    };
    // convert to JSON string
    const jsonString = JSON.stringify(data);
    // send JSON string over websocket
    socket.send(jsonString);    
    });
});

// TOGGLE SWITCHES
// Growlights
function addGrowlightToggleListener(growlightId) {
  // create object on element id
  const growlight_toggle = document.getElementById(growlightId);
  const growlightNumber = {
    "growlight1_toggle": 1,
    "growlight2_toggle": 2,
    "growlight3_toggle": 3,
    "growlight4_toggle": 4,
    "growlight5_toggle": 5,
  }
  var growlight_number = growlightNumber[growlight_toggle] || 0;
  // add event listener 'change'
  const isSwitchOn = "";
  growlight_toggle.addEventListener('change', function() {
      if (growlight_toggle.checked){
        isSwitchOn = "on"
      } else {isSwitchOn = "off"}
      const data = {
          "growlight": growlight_number,
          "state": isSwitchOn
      };
      // convert to JSON string
      const jsonString = JSON.stringify(data);
      // send JSON string over websocket
      socket.send(jsonString);
  });
}
// Fans
function addFanToggleListener(fanId) {
  // create object on element id
  const fan_toggle = document.getElementById(fanId);
  // add event listener 'change'
  fan_toggle.addEventListener('change', function() {
      const isSwitchOn = fan_toggle.checked;
      const data = {
          "fan": isSwitchOn //! write key-/values
      };
      // convert to JSON string
      const jsonString = JSON.stringify(data);
      // send JSON string over websocket
      socket.send(jsonString);
  });
}
// Add event listeners for each growlight and fan toggle switch
addGrowlightToggleListener("growlight1_toggle");
addGrowlightToggleListener("growlight2_toggle");
addGrowlightToggleListener("growlight3_toggle");
addToggleListener("fan1_toggle");
addToggleListener("fan2_toggle");
addToggleListener("fan3_toggle");

// Main switches




// CONFIGURATIONS
function send_gltoggleconfig(component) {
    const gl1_on = document.getElementById('gl1_on').value;
    const gl1_off = document.getElementById('gl1_off').value;
    const gl2_on = document.getElementById('gl2_on').value;
    const gl2_off = document.getElementById('gl2_off').value;
    const gl3_on = document.getElementById('gl3_on').value;
    const gl3_off = document.getElementById('gl3_off').value;
    // Create a JSON object with the numeric value
    const data = {
    value: parseFloat(numericValue) //! write key-/values
    };
    // Convert JSON object to string before sending
    const jsonData = JSON.stringify(data);
    // Send the data over the WebSocket connection
    socket.send(jsonData);
};

function send_fantoggleconfig(component) {
    const fan1_on = document.getElementById('fan1_on').value;
    const fan1_off = document.getElementById('fan1_off').value;
    const fan2_on = document.getElementById('fan2_on').value;
    const fan2_off = document.getElementById('fan2_off').value;
    const fan3_on = document.getElementById('fan3_on').value;
    const fan3_off = document.getElementById('fan3_off').value;
    // Create a JSON object with the numeric value
    const data = {
    value: parseFloat(numericValue) //! write key-/values
    };
    // Convert JSON object to string before sending
    const jsonData = JSON.stringify(data);
    // Send the data over the WebSocket connection
    socket.send(jsonData);
};

