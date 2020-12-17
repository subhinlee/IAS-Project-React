<template>
  <div id="app">
    <div id="nav">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">
          <img src="./assets/logo.png" width="30" height="30" alt="">
        </a>
        <ul class="nav">
          <li class="nav-item">
            <a class="nav-link active" href="#"><router-link to="/">Home</router-link></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#"><router-link to="/about">About</router-link></a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#"><router-link to="/SamsungHealth">SamsungHealth</router-link></a>
          </li>
        </ul>
      </nav>
    </div>
    <router-view/>
  </div>
</template>

<style>
</style>
