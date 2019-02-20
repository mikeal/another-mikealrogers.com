<template>
  <div id="chart">
    <ClientOnly v-if="series">
      <apexchart type=area height=350 :options="chartOptions" :series="series" />
    </ClientOnly>
  </div>
</template>

<script>
const createSeries = (records, limit) => {
  let [x, name, y] = Object.keys(records[0])
  let lines = {}
  records.forEach(record => {
    let line = record[name]
    if (!lines[line]) lines[line] = { name: line, data: [] }
    lines[line].data.push({ x: record[x], y: record[y] })
  })
  lines = Object.values(lines)
  if (limit) {
    lines.forEach(line => {
      line.data = line.data.splice(-limit)
    })
  }
  return lines
}

export default {
  props: [ 'csv' ],
  data () {
   return { loaded: false, series: false, xaxis: false }
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
    let { data } = await parse(csv, {header: true})
    let series = createSeries(data, 12)
    this.$data.series = series
  }
}
</script>

