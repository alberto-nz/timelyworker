let registerUser;
let registerUserName;
let dataResult;
let userExist = false;              //Declaramos las variables
let countOnline = 0;
let countOffline = 0;
let countBreak = 0;
let data;
initApp = function() {
  firebase.auth().onAuthStateChanged(
    function(user) {
      if (user) {
        // User is signed in.
        registerUser = user.email;
        user.getIdToken().then(function(accessToken) {
          document.getElementById("userSigned").textContent = `${registerUser}`;
        });
      } else {
        // User is signed out.
        console.log("user is signed out");
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
        if (user.email === registerUser) {            //si el usuario introducido es un usuario registrado
          // console.log(user);
          document.getElementById(
            "username"
          ).textContent = `${user.first_name} ${user.last_name}`;
          document.getElementById(
            "userStatus"
          ).textContent = `${user.position.toUpperCase()}`;
          document.getElementById("userEmail").textContent = `${user.email}`;
          document.getElementById("userNif").textContent = `NIF: ${user.nif}`;
          document.getElementById(
            "nameInitial"
          ).textContent = `${user.first_name.charAt(0)}`;
          document.getElementById(
            "surnameInitial"
          ).textContent = `${user.last_name.charAt(0)}`;
          if (!user.admin) {
            window.location.href = "/signing.html";
          }
          userExist = true;
        }
        if (user.status === "online") {     
          countOnline++;                  //Hacemos la cuenta para saber cuantos están online, offline o de descanso
        }
        if (user.status === "offline") {
          countOffline++;
        }
        if (user.status === "break") {
          countBreak++;
        }
        document.getElementById("countOnline").textContent = `${countOnline}`;
        document.getElementById("countOffline").textContent = `${countOffline}`;
        document.getElementById("countBreak").textContent = `${countBreak}`;
      });
      if (!userExist) {
        Swal.fire({         //sweetalert
          title: "Error!",
          text: "El usuario no está disponible en nuestra base de datos",
          icon: "warning"
        });
        setTimeout(() => {
          signout();
        }, 5000);
      }
      data.forEach(user => {
        document.getElementById("tableBody").innerHTML += `
          <tr>
            <td>
              <div class="d-flex px-2 py-1">
                <div class="avatar avatar-xl position-relative">
                <div
                  class="icon-shape d-flex text-light bg-gradient-faded-success shadow-info text-center rounded-5 text-2xl mt-n4 justify-content-center align-items-center"
                >
                  <span>${user.first_name.charAt(0)}</span>   
                  <span>${user.last_name.charAt(0)}</span>
                </div>
              </div>
              <div
                class="d-flex flex-column justify-content-center"
              >
                <h6 class="mb-0 text-sm"> ${user.first_name.toUpperCase()}  ${user.last_name.toUpperCase()}</h6>
                <p class="text-xs text-secondary mb-0">
                  ${user.email}
                </p>
              </div>
            </div>
          </td>
          <td>
            <p class="text-xs text-secondary mb-0"> ${user.position.toUpperCase()}</p>

          </td>
          <td class="align-middle text-center text-sm">
            <span class="badge badge-sm ${user.status === "online" &&
              " bg-gradient-success"}  ${user.status === "offline" &&
          " bg-gradient-danger"} ${user.status === "break" &&
          " bg-gradient-warning"}"
              > ${user.status}</span
            >
          </td>
          <td class="align-middle text-center">
            <span class="text-secondary text-xs font-weight-bold"
              > ${new Date(user.date).toLocaleString("es-ES")}</span
            >
          </td>
        </tr>`;
      });
    });
};
function signout() {
  firebase
    .auth()
    .signOut()
    .then(function() {
      console.log("Sign-out successful");
      window.location.href = "/index.html";
    })
    .catch(function(error) {
      console.error(error);
    });
}

window.addEventListener("load", function() {
  initApp();
});

function submitForm(e) {              //formulario para agregar usuarios
  let name = e.target["input_first_name"].value;
  let lastName = e.target["input_last_name"].value;
  let dni = e.target["input_dni"].value;
  let email = e.target["input_email"].value;
  let position = e.target["input_position"].value;
  let form = document.getElementById("myForm");
  var postData = {
    first_name: name,
    last_name: lastName,
    date: new Date(),
    nif: dni,
    email: email,
    position: position,
    status: "offline",
    admin: false,
    id: dataResult.length + 1
  };
  var newPostKey = dataResult.length;
  var updates = {};
  updates["/usuarios/" + newPostKey] = postData;

  return firebase
    .database()
    .ref()
    .update(updates);

  form.reset();
}
