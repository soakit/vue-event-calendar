<template>
  <div class="wrapper">
    <h3 class="title">{{event.title}}</h3>
  </div>
</template>
<script>
export default {
  data () {
    return {
        
    }
  },
  props: {
    event: {
        type: Object,
        required: true
    },
    index: {
        type: Number
    }
  },
  methods: {

  }
}
</script>
