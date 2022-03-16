import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";

const sdk = new ChartsEmbedSDK({
  baseUrl: "https://charts.mongodb.com/charts-team10-zpnrs" //REPLACE with your Atlas Charts base URL
});

const shiptypeChart = sdk.createChart({
  chartId: "6230e742-1a35-4481-8e2c-45c3c28ca2ca", //REPLACE with your chartId
  theme: "dark"
});

const gaugeChart = sdk.createChart({
  chartId: "6230fce0-5885-423c-8d42-918f35a59673", //REPLACE with your chartId
  theme: "dark"
});

const heatmapChart = sdk.createChart({
  chartId: "d1b34399-6c03-431d-8c4b-858536a61919", //REPLACE with your chartId
  theme: "dark"
})


const clickHandlerGauge = (payload) => {
  shiptypeChart.setFilter({"mil_flag": true});
  heatmapChart.setFilter({"mil_flag": true});

};

const clickHandlerShips = (payload) => {
  shiptypeChart.setHighlight(payload.selectionFilter);
  heatmapChart.setFilter(payload.selectionFilter);
  
};

function addEventListeners() {

  document
    .getElementById("refresh-button")
    .addEventListener("click", async function () {
      await gaugeChart.refresh();
      await shiptypeChart.refresh();
      await heatmapChart.refresh();
    });
    shiptypeChart.addEventListener("click", clickHandlerShips);
    gaugeChart.addEventListener("click", clickHandlerGauge);
}

async function renderDashboard() {
  await gaugeChart.render(document.getElementById("chart1"));
  await shiptypeChart.render(document.getElementById("chart2"));
  await heatmapChart.render(document.getElementById("chart3"));
  addEventListeners();

}

renderDashboard().catch((e) => window.alert(e.message));
