<template>
    <div class="__vev_calendar-wrapper">
        <cal-panel :events="events" :today="today" :calendar="calendarOptions" :can-select-other-month="canSelectOtherMonth"
            @cur-day-changed="handleChangeCurDay" @month-changed="monthChanged" :active-date.sync="activeDate" :mapping="mapping">
        </cal-panel>
        <cal-events :day-events="selectdDayEvents" :locale="calendarOptions.options.locale" :color="calendarOptions.options.color">
        </cal-events>
    </div>
</template>

<script>
    import i18n from './i18n.js'
    import {
        dateTimeFormatter,
        isEqualDateStr
    } from './tools.js'

    import calEvents from './components/cal-events.vue'
    import calPanel from './components/cal-panel.vue'

    const inBrowser = typeof window !== 'undefined'
    export default {
        name: 'vue-event-calendar',
        components: {
            'cal-events': calEvents,
            'cal-panel': calPanel
        },
        data() {
            return {
                i18n,
                selectdDayEvents: {
                    date: this.today,
                    events: this.events.filter((event) => {
                        return isEqualDateStr(event.date, this.today, this.calendarOptions.options.separator)
                    })
                },
                activeDate: '',
            }
        },
        props: {
            events: {
                type: Array,
                required: true
            },
            canSelectOtherMonth: {
                type: Boolean,
                default: false
            },
            mapping: {
                type: Object
            },
            monthChanged: {
                type: Function,
                required: true
            }
        },
        computed: {
            calendarOptions() {
                let dateObj = new Date()
                if (inBrowser) {
                    return window.VueCalendarBarEventBus.CALENDAR_EVENTS_DATA
                } else {
                    return {
                        options: {
                            locale: 'en', //zh
                            color: ' #1f91f4'
                        },
                        params: {
                            curYear: dateObj.getFullYear(),
                            curMonth: dateObj.getMonth(),
                            curDate: dateObj.getDate(),
                            curEventsDate: 'all'
                        }
                    }
                }
            },
            calendarParams() {
                let dateObj = new Date()
                if (inBrowser) {
                    return window.VueCalendarBarEventBus.CALENDAR_EVENTS_DATA.params
                } else {
                    return {
                        curYear: dateObj.getFullYear(),
                        curMonth: dateObj.getMonth(),
                        curDate: dateObj.getDate(),
                        curEventsDate: dateString
                    }
                }
            },
            today() {
                return dateTimeFormatter(new Date(), this.i18n[this.calendarOptions.options.locale].fullFormat) 
            },
        },
        created() {
            if (this.calendarParams.curEventsDate !== 'all') {
                this.handleChangeCurDay(this.calendarParams.curEventsDate)
            }
        },
        methods: {
            handleChangeCurDay(date) {
                this.selectdDayEvents = {
                    date: date,
                    events: this.events.filter((event) => {
                        return isEqualDateStr(event.date, date, this.calendarOptions.options.separator)
                    })
                }
            }
        },
        watch: {
            calendarParams() {
                if (this.calendarParams.curEventsDate !== 'all') {
                    this.handleChangeCurDay(this.calendarParams.curEventsDate)
                }
            },
            events() {
                const date = this.activeDate || this.today;
                this.selectdDayEvents = {
                    date,
                    events: this.events.filter((event) => {
                        return isEqualDateStr(event.date, date, this.calendarOptions.options.separator)
                    })
                }
            }
        }
    }
</script>
<style lang="less">
    .scheduleWrap .title{
        border: none !important;
    }
    @base: #1f91f4;
    @white: #ffffff;
    @gray: #e0e0e0;
    @gray-dark: #b1b1b1;
    @large-padding: 15px;
    @small-padding: 10px;
    @gray2: #cac6ca;
    @icon-border-size: 1px;
    .__vev_calendar-wrapper {
        position: relative;
        overflow: hidden;
        width: 100%;
        * {
            box-sizing: border-box;
        }
        .cal-wrapper {
            padding: 0 8px;
            .cal-header {
                position: relative;
                width: 100%;
                background-color: @white;
                // box-shadow: 0 6px 5px rgba(0,0,0,.1);
                font-weight: 500;
                overflow: hidden;
                &>div {
                    float: left;
                    line-height: 20px;
                    padding: @large-padding;
                }
                .title {
                    width: 60%;
                    text-align: center;
                }
                .l {
                    text-align: left;
                    width: 20%;
                    cursor: pointer;
                    user-select: none;
                    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                }
                .r {
                    text-align: right;
                    width: 20%;
                    cursor: pointer;
                    user-select: none;
                    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                }
            }
            .cal-body {
                width: 100%;
                .weeks {
                    width: 100%;
                    overflow: hidden;
                    text-align: center;
                    font-size: 12px;
                    .item {
                        line-height: 50px;
                        float: left;
                        width: 14.285%;
                    }
                }
                .dates {
                    width: 100%;
                    overflow: hidden;
                    text-align: center;
                    font-size: 14px;
                    .item {
                        cursor: pointer;
                        user-select: none;
                        position: relative;
                        float: left;
                        display: block;
                        width: 14.285%;
                        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                        height: 35px;
                        line-height: 35px;
                        &:hover,
                        &.active {
                            color: @white;
                            .is-active {
                                display: block;
                            }
                        }
                        &.gray {
                            color: @gray2;
                            cursor: default;
                        }
                        .is-active,
                        .is-today {
                            border-radius: 50%;
                            width: 27px;
                            height: 27px;
                            position: absolute;
                            content: '';
                            left: 50%;
                            top: 50%;
                            z-index: 1;
                            margin-left: -13.5px;
                            margin-top: -13.5px;
                        }
                        .is-today {
                            border: 1px solid @base;
                        }
                        .is-active {
                            display: none;
                            background-color: @base;
                        }
                        .date-num {
                            position: relative;
                            z-index: 3;
                        }
                        .is-event {
                            content: '';
                            border: 1px solid @base;
                            background-color: #fff;
                            border-radius: 50%;
                            width: 4px;
                            height: 4px;
                            position: absolute;
                            z-index: 2;
                            bottom: -2px;
                            left: 50%;
                            margin-left: -2px;
                        }
                    }
                }
            }
        }
        .events-wrapper {
            max-height:97px;
            overflow:hidden;
            padding:0 20px;
            .cal-events {
                height: 100%;
            }
            .date {
                width: 40%;
                min-width: 200px;
                text-align: center;
                color: @white;
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 20px;
                margin: 0 auto;
                font-size: 22px;
            }
            .event-item {
                line-height: 47px;
                background-color: #fff;
                border-radius: 5px;
                color: #323232;
                position: relative;
                border-bottom:1px solid #eee;
                .title {
                    height: 47px;
                    line-height: 47px;
                    color: #666;
                    font-size: 14px;
                    position: relative;
                    padding-left: 12px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .title:before{
                    content: '';
                    display: inline-block;
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    border-radius: 100%;
                    background: #1f91f4;
                    top:22px;
                    left: 0;
                }
                .time {
                    position: absolute;
                    right: 30px;
                    top: 17px;
                    color: #666;
                    font-size: 14px;
                }
                .desc {
                    color: #666;
                    font-size: 14px;
                    padding: 7px 0;
                }
            }
        }
    }
    .cal-events .event-item:last-child{
        border-bottom: none !important;
    }
    .arrow-left.icon {
        color: #000;
        position: absolute;
        left: 6%;
        margin-top: 10px;
    }

    .arrow-left.icon:before {
        content: '';
        position: absolute;
        left: 1px;
        top: -5px;
        width: 10px;
        height: 10px;
        border-top: solid @icon-border-size currentColor;
        border-right: solid @icon-border-size currentColor;
        -webkit-transform: rotate(-135deg);
        transform: rotate(-135deg);
    }

    .arrow-right.icon {
        color: #000;
        position: absolute;
        right: 6%;
        margin-top: 10px;
    }

    .arrow-right.icon:before {
        content: '';
        position: absolute;
        right: 1px;
        top: -5px;
        width: 10px;
        height: 10px;
        border-top: solid @icon-border-size currentColor;
        border-right: solid @icon-border-size currentColor;
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
    }

    h3,
    p {
        margin: 0;
        padding: 0;
    }

</style>

