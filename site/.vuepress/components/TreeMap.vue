<template>
  <ClientOnly>
    <div class="control_wrapper" v-if="treemap">
      <ejs-treemap id="treemap" :height='treemap.height' :dataSource='treemap.dataSource' :weightValuePath='treemap.weightValuePath' :equalColorValuePath='treemap.equalColorValuePath' :leafItemSettings='treemap.leafItemSettings'></ejs-treemap>
    </div>
  </ClientOnly>
</template>

<script>
export default {
  data: function() {
    return { treemap: false }
  },
  mounted: async function () {
    const Vue = (await import('vue')).default
    const TreeMapPlugin = (await import('@syncfusion/ej2-vue-treemap')).TreeMapPlugin
    Vue.use(TreeMapPlugin)
    
   
    this.$data.treemap = {
     height: '350px',
			dataSource: [
				{ Title: 'State wise International Airport count in South America', State: "Brazil", Count: 25 },
				{ Title: 'State wise International Airport count in South America', State: "Colombia", Count: 12 },
				{ Title: 'State wise International Airport count in South America', State: "Argentina", Count: 9 },
				{ Title: 'State wise International Airport count in South America', State: "Ecuador", Count: 7 },
				{ Title: 'State wise International Airport count in South America', State: "Chile", Count: 6 },
				{ Title: 'State wise International Airport count in South America', State: "Peru", Count: 3 },
				{ Title: 'State wise International Airport count in South America', State: "Venezuela", Count: 3 },
				{ Title: 'State wise International Airport count in South America', State: "Bolivia", Count: 2 },
				{ Title: 'State wise International Airport count in South America', State: "Paraguay", Count: 2 },
				{ Title: 'State wise International Airport count in South America', State: "Uruguay", Count: 2 },
				{ Title: 'State wise International Airport count in South America', State: "Falkland Islands", Count: 1 },
				{ Title: 'State wise International Airport count in South America', State: "French Guiana", Count: 1 },
				{ Title: 'State wise International Airport count in South America', State: "Guyana", Count: 1 },
				{ Title: 'State wise International Airport count in South America', State: "Suriname", Count: 1 },
		  ],
			weightValuePath: 'Count',
			equalColorValuePath: 'Count',
			leafItemSettings: {
				labelPath: 'State',
				colorMapping: [
					{
						value: 25,
						color: '#634D6F'
				  },
					{
					  value: 12,
						color: '#B34D6D'
					},
					{
						value: 9,
						color: '#557C5C'
					},
					{
						value: 7,
						color: '#44537F'
					},
					{
						value: 6,
						color: '#637392'
					},
					{
						value: 3,
						color: '#7C754D'
					},
					{
						value: 2,
						color: '#2E7A64'
					},
					{
						value: 1,
						color: '#95659A'
					},
			  ]
		  }
	  }
  }
}
</script>
<style>
@import '../../../node_modules/@syncfusion/ej2-base/styles/material.css';
</style>

