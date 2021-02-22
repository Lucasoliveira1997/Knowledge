<template>
  <div class="user-dropdown">
    <div class="user-button">
      <span class="d-none d-sm-block">{{ user.name }}</span>
      <div class="user-dropdown-img">
          <Gravatar :email="user.email" alt="User" />
      </div>
      <i class="fa fa-angle-down"></i>
    </div>
    <div class="user-dropdown-content">
        <router-link to="/admin"><i class="fa fa-cogs">Administração</i></router-link>
        <a href="#"><i class="fa fa-sign-out">Sair</i></a>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Gravatar from "vue-gravatar";

export default {
  name: "UserDropDown",
  components: { Gravatar },
  computed: mapState(["user"]),
};
</script>

<style>
    .user-button {
        display: flex;
        align-items: center;
        color: #fff;
        font-weight: 100;
        height: 100%;
        padding: 0 20px;
    }

    .user-dropdown {
        height: 100%;
        position: relative;
    }

    .user-dropdown:hover {
        background-color: rgba(0, 0, 0, 0.2);
    }

    .user-dropdown-img {
        margin: 0 10px;
    }

    .user-dropdown-img > img {
        max-height: 37px;
        border-radius: 5px;
    }

    .user-dropdown-content {
        position: absolute;
        right: 0px;
        background-color: #f9f9f9;
        min-width: 170px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);

        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: center;

        padding: 10px;
        z-index: 1;
        visibility: hidden; 
        opacity: 0;
        transition: visibility 0s, opacity 0.5s linear; 
    }

    .user-dropdown:hover .user-dropdown-content {
        visibility: visible;
        opacity: 1;
    }

    .user-dropdown-content a {
        text-decoration: none;
        color: #111;
        padding: 10px;
    }

    .user-dropdown-content a:hover {
        background-color: #ededed;
    }
</style>