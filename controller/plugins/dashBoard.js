export default class content {
    constructor() {
      // this.init();
    }
  
    createStackedChart(element, data, xkey, ykeys, labels, lineColors) {
      Morris.Bar({
          element: element,
          data: data,
          xkey: xkey,
          ykeys: ykeys,
          stacked: true,
          labels: labels,
          hideHover: 'auto',
          barSizeRatio: 0.4,
          preUnits:"$",
          resize: true,
          gridLineColor: '#eeeeee',
          barColors: lineColors,
          formatter: function (value) {
              return '$' + value.toLocaleString(); 
          }
      });
  }
  
    // createDonutChart(element, data, colors) {
    //   Morris.Donut({
    //     element: element,
    //     data: data,
    //     resize: true,
    //     colors: colors
    //   });
    // }
  
    createAreaChart(element, data, color) {
      const options = {
        chart: {
          type: 'area',
          height: 60,
          sparkline: { enabled: true }
        },
        series: [{ data: data }],
        stroke: { curve: 'smooth', width: 3 },
        colors: [color],
        tooltip: {
          fixed: { enabled: false },
          x: { show: false },
          y: {
            title: {
              formatter: function () {
                return '';
              }
            }
          },
          marker: { show: false }
        }
      };
      new ApexCharts(document.querySelector(element), options).render();
    }
  
    init() {
      // Datos para el gráfico de barras apiladas
      const stackedData = [
        { y: '2006', a: 180, b: 45, c: 70 },
        { y: '2007', a: 220, b: 55, c: 65 },
      ];
      this.createStackedChart(
        'morris-bar-stacked',
        stackedData,
        'y',
        ['a', 'b', 'c'],
        ['Series A', 'Series B', 'Series C'],
        ['#23cbe0', '#0e86e7', '#745af1']
      );
  
      // Datos para el gráfico de dona
      const donutData = [
        { label: "Download Sales", value: 20 },
        { label: "In-Store Sales", value: 50 },
        { label: "Mail-Order Sales", value: 30 }
      ];
      // this.createDonutChart('morris-donut-example', donutData, ['#0e86e7', '#23cbe0', '#745af1']);
  
      // Ejemplo de gráficos de área
      this.createAreaChart("#chart1", [24, 66, 42, 88, 62, 24, 45, 12, 36, 10], '#0e86e7');
      this.createAreaChart("#chart2", [54, 12, 24, 66, 42, 25, 44, 12, 36, 9], '#fbb131');
      this.createAreaChart("#chart3", [10, 36, 12, 44, 63, 24, 44, 12, 56, 24], '#23cbe0');
      this.createAreaChart("#chart4", [34, 66, 42, 33, 62, 24, 45, 16, 48, 10], '#fb4365');
    }
  }