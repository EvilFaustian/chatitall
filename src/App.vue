<template>
<div v-if="!isLoggedIn" class="container d-flex justify-content-around">
  <div class="in d-flex justify-content-center flex-column mt-5 text-center">
    Not logged In
  <br>
    <button type="button" @click="signInWithGoogle" class="btn btn-primary btn-sm">Login With Google</button>
  </div>
  </div>
  <div v-else class="container-fluid">
    <div class="row">
      <div class="col d-flex justify-content-center">
        <div class="chat-body">
          <header>
          <button class="btn btn-info" @click="handleSignOut" >LogOut</button>
          </header>
          <div class="chat" id="messageBody">
              <div v-for="message in chatMessages" :key="message" class="chat-text d-flex flex-row justify-content-between">
              <div class="messageWrapper d-flex flex-row justify-content-left">
                <span class="sender">{{message.author}}: </span>
              <p class="message">{{message.message}}</p>
              </div>
              <p class="message-date-time">{{message.datesent}}</p>
            </div>
          </div>
          <div class="chatinfo">
            <p>{{chatInfo}}</p>
          </div>
          <div class="chat-actions">
            <div class="input-group">
              <input v-model="message" type="text" @keyup.enter="sendMessage" class="form-control" maxlength="50" placeholder="Send messagge.." aria-label="Username" aria-describedby="basic-addon1">
              <button type="button" @click="sendMessage" class="btn btn-primary btn-sm">Send</button>
            </div>
          </div>
          <footer class="d-flex flex-row justify-content-between">
            <span class="f_username">
              Username<br>{{username}} <br>
            </span>
            <button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#exampleModal" >User Settings</button>
            <!-- Button trigger modal -->

              <!-- Modal -->
              <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <div class="container modal-con">
                        <span>Username </span>
                        <input v-model="newUsername" maxlength="12" type="text">
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="button" class="btn btn-primary" @click="SaveSettings" data-bs-dismiss="modal">Save changes</button>
                    </div>
                  </div>
                </div>
              </div>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import db from "./firebase"
import 'firebase/firestore';
import { getFirestore } from "firebase/firestore";
import { signInWithPopup, onAuthStateChanged, signOut, GoogleAuthProvider, getAuth } from "firebase/auth"
import { onValue, addDoc, collection, getDocs, getDoc, doc, setDoc, query, where, onSnapshot} from "firebase/firestore";
import { onMounted, ref, refs, watch} from 'vue'; 
/* var messageBody = document.querySelector('#messageBody');
messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight; //Keep scroll-bar bottom */
const isLoggedIn = ref(false);
let username = ref("");
let chatInfo = ref("")
let timepassed = ref(true)
let newUsername = username;
let message = ref("");
let chatMessages = ref({});
let auth;
const db2 = getFirestore(); // get databse
onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
      preLoad()
    } else {
      isLoggedIn.value = false;
    }
  });
});

const preLoad = async () => {
  const docRef = doc(db2, "users", getAuth().currentUser.uid);
  const docSnap = await getDoc(docRef);
  username.value = docSnap.data().username;
  console.log(docSnap.data().username)
  await updateChat()
  updateChatOnce()
}

const updateChat = async () => {
  const docMsg = doc(db2, "message-room1", 'messages');
  const msgSnap = await getDoc(docMsg);
  const unsub = onSnapshot(doc(db2, "message-room1", "messages"), (doc) => {
    chatMessages.value = doc.data();
    scrollChatBottom()
  });
}

const updateChatOnce = async () => {
  const docMsg = doc(db2, "message-room1", 'messages');
  const msgSnap = await getDoc(docMsg);
  const unsub = onSnapshot(doc(db2, "message-room1", "messages"), (doc) => {
    chatMessages.value = doc.data();
    scrollChatBottom()
  });
}

const scrollChatBottom = async () => {
  var element = document.getElementById('messageBody');
  element.scrollTop = (element.scrollHeight);
}

const SaveSettings = async () => {
        const userDoc = await setDoc(doc(db2, 'users', getAuth().currentUser.uid), {
        username: newUsername.value,
      }, {merge: true});
      username.value = newUsername.value;
}

const sendMessage = async () => {
  if (timepassed.value) {
      if (message.value == "" || message.value == null) {
      return
    } else {
      const docRef = doc(db2, "message-room1", 'messageNumber');
        timepassed.value = false;
        const chatTime = setTimeout(setTimepassed, 2000)
        const docSnap = await getDoc(docRef);
        const newDate = new Date();
        let messageNumber = docSnap.data().messageNumber;
        let date = newDate.getFullYear()+'-'+(newDate.getMonth()+1)+'-'+newDate.getDate();
        let time = newDate.getHours() + ":" + newDate.getMinutes() + ":" + newDate.getSeconds();
        let datetime = date + " " + time;
        const userDoc1 = await setDoc(doc(db2, 'message-room1', 'messages'), {
          [messageNumber]: {
            datesent: datetime,
            message: message.value,
            messageNumber: messageNumber,
            author: username.value,
          }
        }, {merge: true});
        const userDoc2 = setDoc(doc(db2, 'message-room1', 'messageNumber'), {
          messageNumber: ++messageNumber,
        }, {merge: true});
        message.value = "";
        updateChat()
    }
  } else {
    //Do something if time has not passed
    chatInfo.value = "You must wait 2 seconds before seding another message"
  }   

}
/* 
const chatTime = setTimeout(timepassed.value == true, 3000) */

const setTimepassed = () => {
  timepassed.value = true;
}

const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(getAuth(), provider)
    .then((result) => {
        loginChecks()
      });   
};

const handleSignOut = () => {
  signOut(auth).then(() => {
    //Do something after logout
  });
};

const loginChecks = async () => {
  const docRef = doc(db2, "users", getAuth().currentUser.uid);
  const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const newDate = new Date();
      username.value = docSnap.data().username;
      const userDoc = setDoc(doc(db2, 'users', getAuth().currentUser.uid), {
        lastLogin: {
          date: newDate.getFullYear()+'-'+(newDate.getMonth()+1)+'-'+newDate.getDate(),
          time: newDate.getHours() + ":" + newDate.getMinutes() + ":" + newDate.getSeconds(),
        }
      }, {merge: true});
    } else {
      const newDate = new Date();
      const userDoc = setDoc(doc(db2, 'users', getAuth().currentUser.uid), {
        username: getAuth().currentUser.displayName,
        uid: getAuth().currentUser.uid,
        lastLogin: {
          date: newDate.getFullYear()+'-'+(newDate.getMonth()+1)+'-'+newDate.getDate(),
          time: newDate.getHours() + ":" + newDate.getMinutes() + ":" + newDate.getSeconds(),
        }
      }, {merge: true});
     }

/*   const q = query(collection(db2, "users"), where("uid", "==", getAuth().currentUser.uid));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc)
    }); */
    
}

</script>

<style lang="scss">
.modal-con {
  margin-right: 5px;
}

.messageWrapper {
  width: 100%;
  display: inline-block;
}
.chatinfo {
  color: red;
  padding-left: 5px;
  padding-right: 5px;
}
.chat-body {
  max-height: fit-content !important;
  width: 80%;
  max-width: 800px; 
  border-radius: 5px;
  padding: 5px;
  margin-top: 3rem;
  min-width: 400px !important;
  background-color: aquamarine;
  header {
    padding: 5px;
    margin: 5px;
  }
  .chat {
    height: 400px;
    border-radius: 5px;
    padding: 5px;
    margin: 5px;
    overflow: auto;
    background-color: white;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
    .chat-text {
      width: 100%;
      height: fit-content !important;
      border-bottom: 1px solid gray;
      height: 50px;
      .sender {
        max-height: fit-content;
        padding: 5px;
        margin-bottom: 5px;
      }
      .message {
        max-height: fit-content;
        word-break: break-word;
        margin-left: 5px;
        padding: 5px;
        max-width: fit-content;
      }
      .message-date-time {
        font-size: .8em;
        padding: 5px;
        color: gray;
        text-align: right;
      }
    }
  }
  .chat-actions {
    padding: 5px;
    margin: 5px;
    input {
    }
    button {
      width: 70px;
    }
  }
  footer {
    padding: 5px;
    margin: 5px;
    .f_username {
      box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
      padding-top: 6px;
      border-radius: 5px;
      padding: 5px;
      padding-top: 5px;
      background-color: white;
      text-align: center;
    }
  }
}

</style>
