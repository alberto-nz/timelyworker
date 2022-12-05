document.addEventListener("DOMContentLoaded", function() {
  const ui = new firebaseui.auth.AuthUI(firebase.auth());

  ui.start("#firebaseui-auth-container", {
    queryParameterForWidgetMode: "mode",
    queryParameterForSignInSuccessUrl: "signInSuccessUrl",
    signInSuccessUrl: "/dashboard.html",
    signInFlow: "popup",

    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: true
      }
    ],
    callbacks: {
      signInSuccessWithAuthResult: function(
        currentUser,
        credential,
        redirectUrl
      ) {
        window.location.href = "/dashboard.html";
        return true;
      }
    }
  });
});
