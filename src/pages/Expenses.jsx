import React,{useState, useEffect} from 'react'

const Expenses = () => {
   useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

   const notify = async () => {
const permission = await Notification.requestPermission();
console.log("Permission:", permission); // "denied" or "default"
if (permission !== "granted") return alert("Notifications " + permission);

    const reg = await navigator.serviceWorker.ready;
    reg.showNotification("Hello!", {
      body: "This is a simple notification.",
      icon: "/logo192.png",
    });
  };
 return <button onClick={notify}>Send notification</button>;

}

export default Expenses