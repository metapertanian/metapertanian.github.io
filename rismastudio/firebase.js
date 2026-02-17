<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyC1wbXRXclBcMg9AXgV9iiPuj0M3HWgaHc",
    authDomain: "rismastudio.firebaseapp.com",
    projectId: "rismastudio",
    storageBucket: "rismastudio.firebasestorage.app",
    messagingSenderId: "960041733958",
    appId: "1:960041733958:web:53ebe755ff45885b905f47",
    measurementId: "G-0EE5RDBB7F"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>