<template>
  <div id="chart">
    <ClientOnly v-if="series">
      <apexchart type=line height=350 :options="chartOptions" :series="series" />
    </ClientOnly>
  </div>
</template>

<script>
export default {
  props: [ 'csv' ],
  data () {
   return { loaded: false, series: false, xaxis: false }
  },
  computed: {
    chartOptions () {
      let options = {
        chart: {
          type: 'line',
          // stacked: true,
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
    const [ Vue, Line, getcsv ] = await Promise.all([
      import('vue').then(r => r.default),
      import('vue-chartjs').then(r => r.Line),
      import('./lib/getcsv').then(r => r.default)
    ])
    Vue.use(Line)
    Vue.

    let results = await getcsv(this.csv)

    import { Line } from 'vue-chartjs'
    
    let VueApexCharts = (await import('vue-apexcharts')).default
    let Vue = (await import('vue')).default
    let parse = (await import('papaparse')).parse
    Vue.use(VueApexCharts)
    Vue.component('apexchart', VueApexCharts)
    let csv = await fetch(this.$props.csv).then(resp => resp.text())
    let { data } = await parse(csv, {header: true})
    let series = createSeries(data, 25)
    this.$data.series = series
  }
}
</script>

