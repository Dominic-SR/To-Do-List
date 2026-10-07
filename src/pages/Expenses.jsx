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
 return <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200" onClick={notify}>Send notification</button>;

}

export default Expenses