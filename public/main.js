document.addEventListener("DOMContentLoaded", function() {
  firebase
    .database()
    .ref("usuarios")
    .on("value", snapshot => {
      const data = snapshot.val();
      console.log(data);
      const email = document.getElementById("email");
      const name = document.getElementById("name");
      data.forEach(element => {
        email.innerHTML += `<li>${element.email}</li>`;
        name.innerHTML += `<li>${element.first_name} ${element.last_name}</li>`;
      });
    });
});
