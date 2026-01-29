google.charts.load('current', { packages: ['orgchart'] });
google.charts.setOnLoadCallback(draw);

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT2odMcWmB4-T7bDO7JcLbK9YfvmwT08uD8I8n-8Te1-tXP8jlEPW7gvIo1YTmtaH0Y40OKNE8UUSHc/pub?gid=105198555&single=true&output=csv";

function draw() {
  fetch(CSV_URL)
    .then(r => r.text())
    .then(text => buildChart(parseCSV(text)));
}

function parseCSV(text) {
  const rows = text
    .split("\n")
    .map(r => r.split(",").map(c => c.trim().replace(/^"|"$/g, "")));

  const headers = rows.shift();

  return rows
    .filter(r => r.length === headers.length)
    .map(r => {
      let obj = {};
      headers.forEach((h, i) => obj[h] = r[i]);
      return obj;
    });
}

function buildChart(data) {
  const table = new google.visualization.DataTable();
  table.addColumn('string', 'Name');
  table.addColumn('string', 'Manager');
  table.addColumn('string', 'ToolTip');

  data.forEach(row => {
    const name = row["Nume intern"];
    const manager = row["Reports to"] || null;

    const html = `
      <div class="node">
        <div class="name">${row["Nume intern"]}</div>
        <div class="role">${row["Rol"]}</div>
        <div class="dept">${row["Departament"]}</div>
      </div>
    `;

    table.addRow([{ v: name, f: html }, manager, row["Rol"]]);
  });

  const chart = new google.visualization.OrgChart(
    document.getElementById("orgchart")
  );

  chart.draw(table, {
    allowHtml: true,
    size: "medium"
  });
}
