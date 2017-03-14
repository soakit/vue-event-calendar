<template>
    <div class="events-wrapper" id="calEventWrap">
        <div class="cal-events">
            <div v-for="(index, event) in events" class="event-item">
                <cal-event-item :event="event" :index="index" :locale="locale"></cal-event-item>
            </div>
        </div>
    </div>
</template>

<script>
    import i18n from '../i18n.js'
    import {dateTimeFormatter} from '../tools.js'
    import calEventItem from './cal-event-item.vue'
    var scrollFunc = require('perfect-scrollbar');
    export default {
        name: 'cal-events',
        data () {
            return {
                i18n
            }
        },
        components: {
            'cal-event-item': calEventItem
        },
        props: {
            showEvents: {
                type: Array
            },

            dayEvents: {
                type: Object,
                required: true
            },
            locale: {
                type: String,
                required: true
            },
            color: {
                type: String,
                required: true
            }
        },
        ready(){
            let calEventWrap = document.getElementById('calEventWrap');
            scrollFunc.initialize(calEventWrap,{
                wheelSpeed: 1,
                minScrollbarLength: 10,
            });
        },
        computed: {
            events () {
                return this.dayEvents.events
            },
            bgColor () {
                return {backgroundColor: this.color}
            }
        },
        methods: {
            dateTimeFormatter
        }
    }
</script>
<style scoped>
    #calEventWrap{
        position: relative;
    }
</style>
