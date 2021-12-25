import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase.config";
const initializeAutoraization = () =>{
    initializeApp(firebaseConfig)
}
export default initializeAutoraization;