<template>
  <div>
    <h1>Hi {{account.user.firstName}}!</h1>
    <p>You're logged in with Vue + Vuex & JWT!!</p>
    <h3>Users from secure api end point:</h3>
    <em v-if="users.loading">Loading users...</em>
    <span v-if="users.error" class="text-danger">ERROR: {{users.error}}</span>
    <ul v-if="users.items">
      <li v-for="user in users.items" :key="user.id">
        {{user.firstName + ' ' + user.lastName}}
        <span v-if="user.deleting">
          <em>- Deleting...</em>
        </span>
        <span v-else-if="user.deleteError" class="text-danger">- ERROR: {{user.deleteError}}</span>
        <span v-else>
          -
          <a @click="deleteUser(user.id)" class="text-danger">Delete</a>
        </span>
      </li>
    </ul>
    <p>
      <router-link to="/login">Logout</router-link>
    </p>

    <div id="app">
      <div class="main">
        <div v-if="users.items">
          <div v-for="user in users.items" :key="user.id">
            <h5
              v-bind:style="{ backgroundColor: user.color}"
            >{{user.firstName + ' ' + user.lastName}}</h5>
          </div>
        </div>
        <canvas v-canvas></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import canvas from "./canvas.directive.js";

export default {
  name: "app",
  directives: {
    canvas
  },
  data: {
    message: "Hello Vue.js!"
  },

  computed: {
    ...mapState({
      account: state => state.account,
      users: state => state.users.all
    })
  },

  created() {
    this.getAllUsers();
  },
  methods: {
    ...mapActions("users", {
      getAllUsers: "getAll",
      deleteUser: "delete"
    })
  }
};
</script>


<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
canvas {
  background: navy;
}
.main {
  display: flex;
  justify-content: center;
}

.color-guide {
  margin: 20px 40px;
}

h5 {
  margin-bottom: 10px;
}

.user {
  padding: 7px 15px;
  border-radius: 4px;
  color: white;
  font-size: 13px;
  font-weight: bold;
  background: red;
  margin: 10px 0;
}

.guest {
  background: greenyellow;
  color: black;
}
</style>
