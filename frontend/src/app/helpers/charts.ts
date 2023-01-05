import {
  Chart,
  ChartItem,
  ChartConfiguration,
  ChartOptions,
  registerables,
  ScaleOptionsByType,
  CartesianScaleTypeRegistry,
} from 'chart.js';
import { LegendItem } from 'chart.js';
import { DeepPartial, _DeepPartialObject } from 'chart.js/types/utils';
import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels';
import { merge } from './common';
import 'chartjs-adapter-date-fns';
type ChartTypes = 'line' | 'bar' | 'pie' | 'doughnut' | 'radar';

export const chartTypes = [
  {
    label: 'Doughnut Chart',
    type: 'doughnut',
  },
  {
    label: 'Pie Chart',
    type: 'pie',
  },
  {
    label: 'Bar  Chart',
    type: 'bar',
  },
  {
    label: 'Grouped Bar Chart',
    type: 'group-bar',
  },
  {
    label: 'Stacked Bar Chart',
    type: 'stacked-bar',
  },
  {
    label: 'Line Chart',
    type: 'line',
  },
  // {
  //   label: 'Radar Chart',
  //   type: 'radar',
  // },
  {
    label: 'Grid Chart',
    type: 'grid',
  },
];

export const initCharts = () => {
  try {
    Chart.register(...registerables, ChartDataLabels);
  } catch (error) {
    console.log(error);
  }
};

export const createChart = (
  selector: string,
  type: ChartTypes,
  data: any,
  options: any
) => {
  try {
    let config = {
      type,
      data,
      plugins: [ChartDataLabels, bgPlugin],
      options: merge([defaultOptions[type], options]),
    };
    return new Chart(
      document.getElementById(selector) as ChartItem,
      config as ChartConfiguration
    );
  } catch (error) {
    console.log(error);
    return error;
  }
};

const scales: _DeepPartialObject<{
  [key: string]: ScaleOptionsByType<
    'radialLinear' | keyof CartesianScaleTypeRegistry
  >;
}> = {
  x: {
    ticks: {
      minRotation: 0,
      maxRotation: 90,
    },
  },
};

const commonOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  // layout: {},
  // onResize: (something: AnyObject) => {
  //   console.log(something)
  // },
  scales: {},
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      formatter: (value: any, context: any) => {
        return `${
          context?.chart?.reportData?.labels[context.dataIndex]
        }\n${value}`;
      },
      align: 'center',
      color: '#606060',
      font: (context: any) => {
        var w = context.chart.width;
        return {
          size: w < 300 ? 10 : 12,
          weight: w < 300 ? 'normal' : 900,
        };
      },
    },
    tooltip: {
      enabled: true,
      position: 'nearest',
    },
  },
};

const defaultOptions: any = {
  // const defaultOptions: { [key: string]: ChartOptions } = {
  line: merge([
    commonOptions,
    {
      plugins: {
        datalabels: {
          formatter: (value: any, context: any) => {
            if (typeof value === 'object' && value.y) return value.y;
            return `${value}`;
          },
          backgroundColor: (context: Context) => {
            return context?.dataset?.borderColor || 'red';
          },
          color: (context: Context) => {
            return 'white';
          },
          borderRadius: 5,
          font: (context: any) => {
            var w = context.chart.width;
            return {
              weight: w < 300 ? 'normal' : 'bold',
              size: w < 300 ? 10 : 12,
            };
          },
          // color: '#000',
          align: 'top',
          anchor: 'start',
        },
      },
      layout: {
        padding: (context: Context) => {
          return {
            right: 16,
            left: 8,
          };
        },
      },
      scales,
      elements: {
        line: {
          fill: false,
          tension: 0.4,
        },
      },
      interaction: {
        intersect: false,
        axis: 'x',
      },
    },
  ]),
  bar: merge([
    commonOptions,
    {
      plugins: {
        legend: {
          display: false,
          position: 'right',
        },

        tooltips: {
          callbacks: {
            label: function (tooltipItem: any) {
              return '$' + Number(tooltipItem.yLabel) + ' and so worth it !';
            },
          },
        },
        title: {
          display: true,
          position: 'top',
        },
        datalabels: null,
        // datalabels: {
        //   labels: {
        //     title: {
        //       color: '#fff'
        //     }
        //   }
        // }
      },
      scales,
      interaction: {
        intersect: false,
        axis: 'x',
      },
    },
  ]),
  pie: merge([
    commonOptions,
    {
      plugins: {
        legend: {
          display: true,
          position: 'right',
        },
        datalabels: {
          align: 'center',
          formatter: (value: any, context: any) => {
            let sum = 0;
            let dataArr = context.chart.data.datasets[0].data;
            dataArr.map((data: any) => {
              sum += data;
            });
            let percentage = ((value * 100) / sum).toFixed(0) + '%';
            return percentage;
          },
        },
      },
    },
  ]),
  doughnut: merge([
    commonOptions,
    {
      plugins: {
        legend: {
          display: true,
          position: 'right',
        },
        datalabels: {
          align: 'center',
          formatter: (value: any, context: any) => {
            let sum = 0;
            let dataArr = context.chart.data.datasets[0].data;
            dataArr.map((data: any) => {
              sum += data;
            });
            let percentage = ((value * 100) / sum).toFixed(0) + '%';
            return percentage;
          },
        },
      },
    },
  ]),
  radar: merge([
    // commonOptions,
    {
      scale: {
        // angleLines: {
        //   display: false,
        // },
        // ticks: {
        //   suggestedMin: 50,
        //   suggestedMax: 100,
        // },
      },
      elements: {
        line: {
          borderWidth: 3,
        },
        // line: {
        //   fill: true
        // },
        // point: {
        //   pointStyle: 'round'
        // }
      },
      plugins: {
        legend: {
          display: true,
          position: 'right',
        },
        datalabels: {
          display: false,
        },
      },
    },
  ]),
};

export const CHART_COLORS = {
  red: 'rgb(0,0,128)',
  orange: 'rgb(25,154,183)',
  yellow: 'rgb(237, 125, 49)',
  green: 'rgb(6,18,78)',
  blue: 'rgb(255,192,0)',
  purple: 'rgb(8,64,86)',
  grey: 'rgb(10, 255, 240)',
};

export const CHART_COLORS_ARRAY = [
  'rgb(0,0,128)',
  'rgb(25,154,183)',
  'rgb(237, 125, 49)',
  'rgb(6,18,78)',
  'rgb(255,192,0)',
  'rgb(8,64,86)',
  'rgb(10, 255, 240)',
];

const bgPlugin = {
  id: 'custom_canvas_background_color',
  beforeDraw: (chart: any) => {
    const ctx = chart.canvas.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};