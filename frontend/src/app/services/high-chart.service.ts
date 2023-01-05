import { Injectable } from '@angular/core';
import * as Highcharts from 'highcharts';
@Injectable({
  providedIn: 'root'
})
export class HighChartService {

  createChart(el: any, cfg:any, type:any) {
    // this.preparePieChart(cfg, el);
    this.barChart(el, cfg, type);
  }

  preparePieChart(res: any, el:any){
    let label = res.labels;
    let data = res.datasets[0].data; 
   let defaultOptions: any = {
      chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
      },
      tooltip: {
          pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                  style: {
                      color: (Highcharts.theme) || 'black'
                  }
              },
              showInLegend: true
          }
      },
      series: [{
          name: 'Brands',
          colorByPoint: true,
          
      }]
  }
  defaultOptions.title = res.title;
defaultOptions.series[0].data = label.map((key:any, i: any) =>{
  const object:any = {};
  object['name'] = key;
  object['y'] = data[i];
  return object;
}) 

Highcharts.chart(el, defaultOptions)
console.log('charts data',defaultOptions);
  }
  barChart(elRef: any, res:any, type: any){
    const chartData:any = {
   /*    chart: {
        type: 'pie'
    }, */
    xAxis: {
      categories: []
  },
  
    plotOptions: {
      series: {
          allowPointSelect: true
      }
  },
  series: [{
    data: []
}]
    };
    if (type === 'pie'){
      chartData.chart = {
        type: 'pie'
    };
    
    }else if (type === 'bar' ){
      chartData.chart= {
        type: 'bar',
        marginLeft: 50,
        marginBottom: 90
    };
    chartData.plotOptions= {
      series: {
          stacking: 'normal'
      }
  }
    }
    chartData.title = {
    text: res.title
  },
    chartData. xAxis.categories = res.labels;
    chartData.series[0].data = res.datasets[0].data;

      Highcharts.chart(elRef, chartData);
    }
  

}
