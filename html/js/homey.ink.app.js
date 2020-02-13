var CLIENT_ID = '5cbb504da1fc782009f52e46';
var CLIENT_SECRET = 'gvhs0gebgir8vz8yo2l0jfb49u9xzzhrkuo1uvs8';

window.addEventListener('load', function () {

  var homey;
  var me;

  var $textLarge = document.getElementById('text-large');
  var $textSmall = document.getElementById('text-small');
  var $logo = document.getElementById('logo');
  var $weatherTemperature = document.getElementById('weather-temperature');
  var $weatherState = document.getElementById('weather-state');
  var $TempraturesInner = document.getElementById('Tempratures-inner');
  var $devicesInner = document.getElementById('devices-inner');

  $logo.addEventListener('click', function () {
    window.location.reload();
  });

  renderText();
  later.setInterval(function () {
    renderText();
  }, later.parse.text('every 1 hour'));

  var api = new AthomCloudAPI({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  });

  var token = getQueryVariable('token');
  token = atob(token);
  token = JSON.parse(token);
  api.setToken(token);

  api.isLoggedIn().then(function (loggedIn) {
    if (!loggedIn)
      throw new Error('Token Expired. Please log-in again.');
  }).then(function () {
    return api.getAuthenticatedUser();
  }).then(function (user) {
    return user.getFirstHomey();
  }).then(function (homey) {
    return homey.authenticate();
  }).then(function (homey_) {
    homey = homey_;

    renderHomey();
    later.setInterval(function () {
      renderHomey();
    }, later.parse.text('every 1 hour'));
  }).catch(console.error);

  function renderHomey() {
    homey.users.getUserMe().then(function (user) {
      me = user;
      me.properties = me.properties || {};
      me.properties.favoriteDevices = me.properties.favoriteDevices || [];

      homey.weather.getWeather().then(function (weather) {
        return renderWeather(weather);
      }).catch(console.error);


        var devicesArray = homey.devices.getDevices();
        // weersensoren
        devicesArray.then(function (devices) {
          var temperatureDevices = Object.keys(devices).map(
            function (key) {
              return devices[key];
            }
          ).filter(
            function (device) {
              return device.capabilitiesObj.measure_temperature !== undefined
                && device.capabilitiesObj.measure_temperature.value !== null;
            }
          );
          renderTemperature(temperatureDevices);
        }).catch(console.error);

        devicesArray.then(function (devices) {
          var favoriteDevices = me.properties.favoriteDevices.map(function (deviceId) {
            return devices[deviceId];
          }).filter(function (device) {
            return !!device;
          }).filter(function (device) {
            if (!device.ui) return false;
            if (!device.ui.quickAction) return false;
            return true;
          });

          favoriteDevices.forEach(function (device) {
            device.makeCapabilityInstance(device.ui.quickAction, function (value) {
              var $device = document.getElementById('device-' + device.id);
              if ($device) {
                $device.classList.toggle('on', !!value);
              }
            });
          });

          return renderDevices(favoriteDevices);
        }).catch(console.error);
      }).catch(console.error);
    }

  function renderWeather(weather) {
        $weatherTemperature.innerHTML = Math.round(weather.temperature);
        $weatherState.innerHTML = weather.state;
      }

  function renderTemperature(tempratureDevices) {
        $TempraturesInner.innerHTML = '';
        tempratureDevices.forEach(function (device) {
          console.log(device);
          var $flow = document.createElement('div');
          $flow.id = 'temp-' + device.id;
          $flow.classList.add('device');
          $flow.classList.add('on');
          $TempraturesInner.appendChild($flow);

          var $temp = document.createElement('div');
          $temp.classList.add('temp');
          $temp.innerHTML = device.capabilitiesObj.measure_temperature.value + '°C';
          $flow.appendChild($temp);

          var $humid = document.createElement('div');
          $humid.classList.add('humid');
          $humid.innerHTML = device.capabilitiesObj.measure_humidity.value + '%';
          $flow.appendChild($humid);

          var $name = document.createElement('div');
          $name.classList.add('name');
          $name.innerHTML = device.name;
          $flow.appendChild($name);
        });
      }

  function renderDevices(devices) {
        $devicesInner.innerHTML = '';
        devices.forEach(function (device) {
          var $device = document.createElement('div');
          $device.id = 'device-' + device.id;
          $device.classList.add('device');
          $device.classList.toggle('on', device.capabilitiesObj && device.capabilitiesObj[device.ui.quickAction] && device.capabilitiesObj[device.ui.quickAction].value === true);
          $device.addEventListener('click', function () {
            var value = !$device.classList.contains('on');
            $device.classList.toggle('on', value);
            homey.devices.setCapabilityValue({
              deviceId: device.id,
              capabilityId: device.ui.quickAction,
              value: value,
            }).catch(console.error);
          });
          $devicesInner.appendChild($device);

          var $icon = document.createElement('div');
          $icon.classList.add('icon');
          $icon.style.webkitMaskImage = 'url(https://icons-cdn.athom.com/' + device.iconObj.id + '-128.png)';
          $device.appendChild($icon);

          var $name = document.createElement('div');
          $name.classList.add('name');
          $name.innerHTML = device.name;
          $device.appendChild($name);
        });
      }

  function renderText() {
        var now = new Date();
        var hours = now.getHours();

        var tod;
        if (hours >= 18) {
          tod = 'evening';
        } else if (hours >= 12) {
          tod = 'afternoon';
        } else if (hours >= 6) {
          tod = 'morning';
        } else {
          tod = 'night';
        }

        $textLarge.innerHTML = 'Good ' + tod + '!';
        $textSmall.innerHTML = 'Today is ' + moment(now).format('dddd[, the ]Do[ of ]MMMM YYYY[.]');
      }
});