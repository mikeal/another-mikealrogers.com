<template>
  <ClientOnly>
    <div class="control_wrapper" v-if="treemap">
      <ejs-treemap id="treemap" :height='treemap.height' :dataSource='treemap.dataSource' :weightValuePath='treemap.weightValuePath' :equalColorValuePath='treemap.equalColorValuePath' :leafItemSettings='treemap.leafItemSettings'></ejs-treemap>
    </div>
  </ClientOnly>
</template>

<script>
const distinctColors = require('distinct-colors')
 
export default {
  props: ['csv'],
  data: function() {
    return { treemap: false }
  },
  mounted: async function () {
    const Vue = (await import('vue')).default
    const TreeMapPlugin = (await import('@syncfusion/ej2-vue-treemap')).TreeMapPlugin
    Vue.use(TreeMapPlugin)

    const complete = results => {
      let fields = results.meta.fields
      if (fields.length !== 2) throw new Error('TreeMap only takes two fields')
      let dataSource = results.data.filter(d => d && d[fields[0]]).map(d => {
        let k = fields[0]
        d[k] = d[k] + '<br>[' + d[fields[1]] + ']'
        return d
      })
      let keys = dataSource.map(d => d[fields[0]])
      console.log(keys)
      
      const colorMapping = distinctColors({count: dataSource.length}).map((color, i) => {
        return { value: keys[i], color: color.hex() }
      })

      this.$data.treemap = {
        height: '350px',
			  dataSource,
	    	weightValuePath: fields[1],
			  equalColorValuePath: fields[0],
		  	leafItemSettings: {
	  			labelPath: fields[0],
          colorMapping
        },
        tooltipSettings: {
          visible: true,
          format: '${' + fields[0] + '} : ${' + fields[1] + '}'
        }
      }
    }

    const Papa = (await import('papaparse')).default
    Papa.parse(this.csv, { download: true, header: true, complete })
  }
}
</script>
<style>
@import '../../../node_modules/@syncfusion/ej2-base/styles/material.css';
</style>

