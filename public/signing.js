let registerUser;
let userActive = [];            
let userId;
initApp = function() {
  firebase.auth().onAuthStateChanged(
    function(user) {
      if (user) {
        registerUser = user.email;        
        let displayName = user.displayName;
        document.getElementById("user").innerHTML = displayName;
      }
    },
    function(error) {
      console.log(error);
    }
  );

  firebase
    .database()
    .ref("usuarios")
    .on("value", snapshot => {
      const data = snapshot.val();
      dataResult = data;
      data.forEach(user => {
        if (user.email === registerUser) {
          userId = user.id - 1;
          userActive.push(user);
        }
      });
      document.getElementById("status").innerHTML = `${userActive[0].status}`;
      let el = document.getElementById("status-container");
      if (userActive[0].status === "online") {
        el.classList.add("bg-success");
      } else if (userActive[0].status === "offline") {
        el.classList.add("bg-danger");
      } else if (userActive[0].status === "break") {
        el.classList.add("bg-warning");
      }
    });
};
function signout() {
  firebase
    .auth()
    .signOut()
    .then(function() {
      window.location.href = "/index.html";
    })
    .catch(function(error) {
      console.error(error);
    });
}
window.addEventListener("load", function() {
  initApp();
});

function setStatus(status) {
  firebase
    .database()
    .ref("usuarios/" + userId)
    .update({
      status,
      date: new Date()
    });
}
