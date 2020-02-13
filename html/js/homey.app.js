var CLIENT_ID = '5cbb504da1fc782009f52e46';
var CLIENT_SECRET = 'gvhs0gebgir8vz8yo2l0jfb49u9xzzhrkuo1uvs8';

window.addEventListener('load', function () {
  var homey; // type = "HomeyAPI" - https://api.developer.athom.com/HomeyAPI.html
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

    renderUsername();
    later.setInterval(function () {
      renderHomey();
    }, later.parse.text('every 1 hour'));
  }).catch(console.error);

  function renderHomey() {
    homey.users.getUserMe().then(function(user) {
      // user = type "HomeyAPI.ManagerUsers.User" - https://api.developer.athom.com/HomeyAPI.ManagerUsers.User.html
      // console.log(user);
      document.getElementById('homeyname').innerHTML = user.name;
    }).catch(console.error);
  }
});