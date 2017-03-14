<template>
  <div class="cal-wrapper">
    <div class="cal-header">
      <div class="l" @click="changeMonth(0)">
        <div class="arrow-left icon">&nbsp</div>
      </div>
      <div class="title">{{curYearMonth}}</div>
      <div class="r" @click="changeMonth(1)">
        <div class="arrow-right icon">&nbsp;</div>
      </div>
    </div>
    <div class="cal-body">
      <div class="weeks">
        <span v-for="dayName in i18n[calendar.options.locale].dayNames" class="item">{{dayName}}</span>
      </div>
      <div class="dates">
        <div v-for="(index, date) in dayList" class="item" v-bind:style="{cursor: date.status || canSelectOtherMonth ?'pointer':'default'}" 
                                                           :class="{today: today === date.date, 
                                                                    event: date.status ? (date.title !== undefined) : false, 
                                                                    active: activeDate === date.date, 
                                                                    gray: !date.status }">
          <p class="date-num" @click="handleChangeCurday(date, index)">{{ date.date.split(calendar.options.separator)[2] }}</p>
          <template v-if="date.status">
            <span class="is-active"></span>
            <span v-if="today==date.date" class="is-today" :style="style.todayStyle"></span>
            <span v-if="date.title != undefined" class="is-event" :style="style.eventStyle" ></span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    import i18n from '../i18n.js'
    import {
        dateTimeFormatter,
        isEqualDateStr
    } from '../tools.js'

    const inBrowser = typeof window !== 'undefined'
    export default {
        name: 'cal-panel',
        data() {
            return {
                i18n
            }
        },
        props: {
            events: {
                type: Array,
                required: true
            },
            calendar: {
                type: Object,
                required: true
            },
            today: {
                type: String,
                required: true
            },
            activeDate: {
                type: String,
                required: true
            },
            mapping: {
                type: Object
            },
            canSelectOtherMonth: {
                type: Boolean,
                default: false  
            },
        },
        watch: {
        },
        ready() {
            const date = new Date();
            let curYear, curMonth;
            curYear = date.getFullYear();
            curMonth = date.getMonth();
            const isLeapYear = ((curYear % 4 == 0) && (curYear % 100 != 0)) || (curYear % 400 == 0);
            const daysArr = [31, isLeapYear?29:28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            this.$emit('month-changed', dateTimeFormatter(new Date(curYear, curMonth, 1), this.fullFormat), 
                                            dateTimeFormatter(new Date(curYear, curMonth, daysArr[curMonth]), this.fullFormat))
        },
        computed: {
            fullFormat() {
                return this.i18n[this.calendar.options.locale].fullFormat
            },
            dayList() {
                let firstDay = new Date(this.calendar.params.curYear, this.calendar.params.curMonth, 1)
                let startTimestamp = firstDay - 1000 * 60 * 60 * 24 * firstDay.getDay()
                let item, status, tempArr = [],
                    tempItem

                for (let i = 0; i < 42; i++) {
                    item = new Date(startTimestamp + i * 1000 * 60 * 60 * 24)
                    if (this.calendar.params.curMonth === item.getMonth()) {
                        status = 1
                    } else {
                        status = 0
                    }
                    tempItem = {
                        date: dateTimeFormatter(item, this.fullFormat),
                        status: status
                    }
                    this.events.forEach((event) => {
                        const mapping = this.mapping;
                        if (!event) {
                            return;
                        }
                        for (let j in mapping) {
                            event[j] = event[mapping[j]]
                        }
                        if (isEqualDateStr(event.date, tempItem.date, this.calendar.options.separator)) {
                            tempItem.title = event.title
                            tempItem.desc = event.desc || ''
                        }
                    })
                    tempArr.push(tempItem)
                }
                return tempArr;
            },
            curYearMonth() {
                let tempDate = new Date(this.calendar.params.curYear, this.calendar.params.curMonth, 1)
                return dateTimeFormatter(tempDate, this.i18n[this.calendar.options.locale].format)
            },
            style() {
                let style = {
                    todayStyle: {
                        borderColor: this.calendar.options.color
                    },
                    eventStyle: {
                        backgroundColor: this.calendar.options.color,
                        borderColor: this.calendar.options.color
                    }
                }
                return style
            }
        },
        methods: {
            changeMonth(type) {
                if (type) {
                    this.$EventCalendar.nextMonth()    
                } else {
                    this.$EventCalendar.preMonth()
                }
                let {curYear, curMonth} = this.calendar.params;
                const isLeapYear = ((curYear % 4 == 0) && (curYear % 100 != 0)) || (curYear % 400 == 0);
                const daysArr = [31, isLeapYear?29:28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                this.$emit('month-changed', dateTimeFormatter(new Date(curYear, curMonth, 1), this.fullFormat), 
                                            dateTimeFormatter(new Date(curYear, curMonth, daysArr[curMonth]), this.fullFormat))
            },
            handleChangeCurday(date, index) {
                if (!this.canSelectOtherMonth) {
                    if (date.status) {
                        this.activeDate = date.date;
                        this.$emit('cur-day-changed', date.date)
                    }
                } else {
                    this.activeDate = date.date;
                    this.$emit('cur-day-changed', date.date)
                    this.$EventCalendar.toDate(date.date);
                }
            }
        }
    }

</script>
