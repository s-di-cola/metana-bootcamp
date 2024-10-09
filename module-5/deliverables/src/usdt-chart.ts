import ApexCharts from "apexcharts";
import { Utils } from "alchemy-sdk";
import {
  fetchTotalTransferVolumeForRecentBlocks,
  listenForNewTransactions,
} from "./usdt-tx";

(async function () {
  const blockTransactions = await fetchTotalTransferVolumeForRecentBlocks(10);
  console.log("Block Transactions:", blockTransactions);

  const labels = blockTransactions.map((tx) => tx.block.toString());
  const totalValues = blockTransactions.map((tx) =>
    parseFloat(Utils.formatUnits(tx.totalValue, 6)),
  );
  const transactionCounts = blockTransactions.map((tx) => tx.transactions);
  const baseFees = blockTransactions.map((tx) => tx.baseFee / 1e9); // Convert to Gwei
  const gasRatio = blockTransactions.map((tx) => tx.gasUsedOverLimit);

  const createChart = (
    elementId: string,
    series: { name: string; data: number[] }[],
    yAxisTitles: any[],
    chartTypes: string[],
    height = 350,
  ) => {
    const options = {
      series: series,
      chart: {
        height: height,
        type: "line",
        stacked: false,
        id: elementId.replace("#", ""),
        group: "txStats",
        zoom: {
          type: "x",
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: "zoom",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      xaxis: {
        categories: labels,
        title: {
          text: "Block Number",
        },
      },
      yaxis: yAxisTitles.map((title, index) => ({
        title: {
          text: title,
        },
        opposite: index !== 0,
        labels: {
          formatter: function (value: number) {
            return value.toFixed(2);
          },
        },
      })),
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y: number) {
            if (typeof y !== "undefined") {
              return y.toFixed(2);
            }
            return y;
          },
        },
      },
      legend: {
        position: "top",
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      markers: {
        size: 1,
      },
      colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560"],
    };

    if (chartTypes) {
      options.series = options.series.map((s, i) => ({
        ...s,
        type: chartTypes[i],
      }));
    }

    const chart = new ApexCharts(document.querySelector(elementId), options);
    chart.render();
    return chart;
  };

  const mainChart = createChart(
    "#chart1",
    [
      { name: "Total Value (USDT)", data: totalValues },
      { name: "Number of Transactions", data: transactionCounts },
    ],
    ["Total Value (USDT)", "Number of Transactions"],
    ["line", "column"],
    400,
  );

  const baseFeeChart = createChart(
    "#chart2",
    [{ name: "Base Fee (Gwei)", data: baseFees }],
    ["Base Fee (Gwei)"],
    ["line"], // chartTypes
    350, // height
  );

  const gasRatioChart = createChart(
    "#chart3",
    [{ name: "Gas Used Over Limit (%)", data: gasRatio }],
    ["Gas Used Over Limit (%)"],
    ["line"], // chartTypes
    350, // height
  );

  listenForNewTransactions(async (data) => {
    console.log("New Block Transaction:", data);
    const newLabel = data.block.toString();
    const newTotalValue = parseFloat(Utils.formatUnits(data.totalValue, 6));
    const newBaseFee = data.baseFee / 1e9; // Convert to Gwei

    mainChart.appendData([
      { data: [newTotalValue] },
      { data: [data.transactions] },
    ]);
    baseFeeChart.appendData([{ data: [newBaseFee] }]);
    gasRatioChart.appendData([{ data: [data.gasUsedOverLimit] }]);

    [mainChart, baseFeeChart, gasRatioChart].forEach((chart) => {
      chart.updateOptions({
        xaxis: {
          categories: [...labels, newLabel],
        },
      });
    });

    labels.push(newLabel);
  });
})();
