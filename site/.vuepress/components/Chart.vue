<template>
  <div id="chart">
    <ClientOnly v-if="series">
      <apexchart type=area height=350 :options="chartOptions" :series="series" />
    </ClientOnly>
  </div>
</template>

<script>
const createSeries = records => {
  let [x, name, y] = Object.keys(records[0])
  let lines = {}
  records.forEach(record => {
    let line = record[name]
    if (!lines[line]) lines[line] = { name: line, data: [] }
    lines[line].data.push([ record[x], record[y] ])
  })
  return Object.values(lines)
}

export default {
  props: [ 'csv' ],
  data () {
   return { loaded: false, series: false }
  },
  computed: {
    chartOptions () {
      let options = {
        chart: {
          stacked: true,
        },
        colors: ['#008FFB', '#00E396', '#CED4DC'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        fill: {
          type: 'gradient',
          gradient: {
            opacityFrom: 0.6,
            opacityTo: 0.8,
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left'
        },
        xaxis: {
          type: 'datetime'
        }
      }
      return options
    }
  },
  mounted: async function () {
    let VueApexCharts = (await import('vue-apexcharts')).default
    let Vue = (await import('vue')).default
    let parse = (await import('papaparse')).parse
    Vue.use(VueApexCharts)
    Vue.component('apexchart', VueApexCharts)
    let csv = await fetch(this.$props.csv).then(resp => resp.text())
    let { data } = await parse(csv)
    let series = createSeries(data)
    this.$data.series = series
  }
}
</script>

