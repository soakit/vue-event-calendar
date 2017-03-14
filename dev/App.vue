<template>
  <div id="app">
    <h1>vue-event-calendar</h1>
    <h2 class="t-center">Defalut template</h2>
    <vue-event-calendar :month-changed="handleChangeMonth" :events="demoEvents" :can-select-othr-month="false">
    </vue-event-calendar>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      demoEvents: [{
        date: '2016/12/15',
        title: 'eat',
        desc: 'longlonglong description'
      },{
        date: '2017/02/12',
        title: 'this is a title'
      }]
    }
  },
  methods: {
    handleChangeMonth(){

    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 30px;
}

h1, h2, h3 {
  font-weight: normal;
  margin: 0;
  padding: 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.t-center{
  text-align: center;
  margin: 20px;
}
</style>
