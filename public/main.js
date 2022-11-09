document.addEventListener('DOMContentLoaded', function() {
    const loadEl = document.querySelector('#load');
   
     firebase.database().ref('usuarios').on('value', snapshot => {const data = snapshot.val()
      console.log(data) });
  
  });