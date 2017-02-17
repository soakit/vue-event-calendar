<template>
  <div class="cal-wrapper">
    <div class="cal-header">
      <div class="l" @click="preMonth">
        <div class="arrow-left icon">&nbsp</div>
      </div>
      <div class="title">{{curYearMonth}}</div>
      <div class="r" @click="nextMonth">
        <div class="arrow-right icon">&nbsp</div>
      </div>
    </div>
    <div class="cal-body">
      <div class="weeks">
        <span v-for="dayName in i18n[calendar.options.locale].dayNames" class="item">{{dayName}}</span>
      </div>
      <div class="dates">
        <div v-for="(date, index) in dayList" class="item" :class="{today: today === date.date, 
                                                                    event: date.status ? (date.title !== undefined) : false, 
                                                                    active: activeIndex === index, 
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
        i18n,
        activeIndex: -1
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
      }
    },
    computed: {
      dayList() {
        let firstDay = new Date(this.calendar.params.curYear + '/' + (this.calendar.params.curMonth + 1) + '/01')
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
            date: `${item.getFullYear()}/${item.getMonth()+1}/${item.getDate()}`,
            status: status
          }
          this.events.forEach((event) => {
            if (isEqualDateStr(event.date, tempItem.date, this.calendar.options.separator)) {
              tempItem.title = event.title
              tempItem.desc = event.desc || ''
            }
          })
          tempArr.push(tempItem)
        }
        return tempArr
      },
      today() {
        let dateObj = new Date()
        return `${dateObj.getFullYear()}/${dateObj.getMonth()+1}/${dateObj.getDate()}`
      },
      curYearMonth() {
        let tempDate = Date.parse(new Date(`${this.calendar.params.curYear}/${this.calendar.params.curMonth+1}/01`))
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
      nextMonth() {
        this.$EventCalendar.nextMonth()
      },
      preMonth() {
        this.$EventCalendar.preMonth()
      },
      handleChangeCurday(date, index) {
        this.activeIndex = index;
        this.$emit('cur-day-changed', date.date)
        // if(!date.status){
        //   this.$EventCalendar.toDate(date.date);
        //   return;
        // }
      }
    }
  }
</script>