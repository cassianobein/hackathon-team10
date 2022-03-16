import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
// var config = require('../config')

const sdk = new ChartsEmbedSDK({
  baseUrl: "https://charts.mongodb.com/charts-team10-zpnrs"
});

// Read https://dochub.mongodb.org/core/charts-dashboards-embedded-dashboard-options for more options
// const dashboard = sdk.createDashboard({
//   dashboardId: "f7a4db31-769c-4574-994a-11d950170e9d",
//   theme: "dark",
//   widthMode: "scale",
//   heightMode: "scale"
// });

const shiptypeChart = sdk.createChart({
  chartId: "6230e742-1a35-4481-8e2c-45c3c28ca2ca",
  theme: "dark"
});

const locationChart = sdk.createChart({
  chartId: "6230ea2a-56bd-4d00-811b-d8c93e6295c4",
  theme: "dark"
});

const gaugeChart = sdk.createChart({
  chartId: "6230fce0-5885-423c-8d42-918f35a59673",
  theme: "dark"
});

const heatmapChart = sdk.createChart({
  chartId: "6230fe75-5885-4e6e-8849-918f35a68de1",
  theme: "dark"
})


const clickHandlerGauge = (payload) => {
  gaugeChart.setHighlight({});
  shiptypeChart.setFilter({"mil_flag": true});
  locationChart.setFilter({"mil_flag": true});
  heatmapChart.setFilter(
    {
      'ground_truth.detections.label':{
        $in:['potted plant', 'tv']
      }
    }
  );

};

const clickHandlerShips = (payload) => {
  shiptypeChart.setHighlight(payload.selectionFilter);
  locationChart.setFilter(payload.selectionFilter);
  heatmapChart.setFilter(
    {
      'ground_truth.detections.label':{
        $in:['potted plant']
      }
    }
  );
  
};

function addEventListeners() {
  /* Refresh button */
  document
    .getElementById("refresh-button")
    .addEventListener("click", async function () {
      await dashboard.refresh();
    });

  /* Theme toggle */
  document
    .getElementById("theme")
    .addEventListener("change", async function () {
      await dashboard.setTheme(this.checked ? "dark" : "light");

      const currentTheme = await dashboard.getTheme();
      document.getElementById("currentTheme").innerText =
        currentTheme === "light" ? "dark" : "light";
    });

  /* Max Data Age select */
  document
    .getElementById("max-data-age")
    .addEventListener("change", async (e) => {
      const maxDataAge = e.target.value;
      const defaultMaxDataAge = 3600;
      await dashboard.setMaxDataAge(Number(maxDataAge) ?? defaultMaxDataAge);
    });

  /* Height Mode select */
  document
    .getElementById("height-mode")
    .addEventListener("change", async (e) => {
      const heightMode = e.target.value;
      await dashboard.setHeightMode(heightMode);
    });

  /* Width Mode select */
  document
    .getElementById("width-mode")
    .addEventListener("change", async (e) => {
      const widthMode = e.target.value;
      await dashboard.setWidthMode(widthMode);
    });

  /* Charts Background select */
  document
    .getElementById("charts-background")
    .addEventListener("change", async (e) => {
      const chartsBackground = e.target.value;
      await dashboard.setChartsBackground(chartsBackground);
    });

    shiptypeChart.addEventListener("click", clickHandlerShips);
    gaugeChart.addEventListener("click", clickHandlerGauge);
}

async function renderDashboard() {
  //await dashboard.render(document.getElementById("dashboard"));
  await gaugeChart.render(document.getElementById("chart1"));
  await shiptypeChart.render(document.getElementById("chart2"));
  await heatmapChart.render(document.getElementById("chart3"));
  await locationChart.render(document.getElementbyId("chart4"));
  addEventListeners();

  // const charts = await dashboard.getAllCharts();
  // charts.forEach((chart) => {
  //   chart.addEventListener("click", clickHandler);
  // });

}

renderDashboard().catch((e) => window.alert(e.message));
