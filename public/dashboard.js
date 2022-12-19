//Declaración de variables
let registerUser;
let registerUserName;
let dataResult;
let userExist = false;              
let countOnline = 0;
let countOffline = 0;
let countBreak = 0;
let data;
//Inicialización de aplicación firebase
initApp = function() {    
  firebase.auth().onAuthStateChanged(
    function(user) {
      if (user) {
        // El usuario inicia sesión
        registerUser = user.email;
        user.getIdToken().then(function(accessToken) {
          document.getElementById("userSigned").textContent = `${registerUser}`;
        });
      } else {
        // El usuario cierra sesión
        console.log("user is signed out");
      }
    },
    //Capturamos error si lo hubiese y lo mostramos por consola
    function(error) {
      console.error(error);
    }
  );

  //Inicialización de la BBDD

  firebase
    .database()
    .ref("usuarios")
    .on("value", snapshot => {
      const data = snapshot.val();
      dataResult = data;
      //Comprobamos si el correo coincide con el usuario registrado seteamos los datos de usuario
      data.forEach(user => {
        if (user.email === registerUser) {            
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
          //Si el usuario no tiene rol de administrador redireccionamos a la pantalla de login
          if (!user.admin) {
            window.location.href = "/signing.html";
          }
          userExist = true;
        }
        //Hacemos la cuenta para saber cuantos están online, offline o de descanso
        if (user.status === "online") {     
          countOnline++;                  
        }
        if (user.status === "offline") {
          countOffline++;
        }
        if (user.status === "break") {
          countBreak++;
        }
        //Seteamos los contadores de status de usuarios
        document.getElementById("countOnline").textContent = `${countOnline}`;
        document.getElementById("countOffline").textContent = `${countOffline}`;
        document.getElementById("countBreak").textContent = `${countBreak}`;
      });
      //Si el usuario no existe lanzamos una alerta con el plugin sweetalert
      if (!userExist) {
        Swal.fire({         
          title: "Error!",
          text: "El usuario no está disponible en nuestra base de datos",
          icon: "warning"
        });
        setTimeout(() => {
          signout();
        }, 5000);
      }
      //Seteamos los datos de la tabla
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
//Función de cerrar sesión. Promesa
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
//Listener para cuando la página esté cargada iniciamos la aplicación
window.addEventListener("load", function() {
  initApp();
});

//formulario para agregar usuarios
function submitForm(e) {              
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
