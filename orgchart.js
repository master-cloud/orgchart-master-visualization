// Codul complet pentru orgchart.js

google.charts.load('current', { packages: ['orgchart'] });
google.charts.setOnLoadCallback(loadData);

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTmxAF6tY8qazYHtrd1Qxfe2sM4SRDlbbYgFdB5n4tf03rDXi69uif_BK4QyP7_91lnMOJVeQuKFPkS/pub?output=csv";

// CULORI PE DEPARTAMENT
const DEPT_COLORS = {
  "Growth": "#2E8B57",
  "Performance": "#0F6C7A",
  "Performance (Data)": "#c96ade",
  "Support": "#6A5ACD",
  "Communication": "#C46A00"
};

function loadData() {
  fetch(CSV_URL)
    .then(r => r.text())
    .then(parseCSV)
    .then(drawChart)
    .catch(err => {
      console.error("Eroare la încărcarea CSV:", err);
    });
}

function parseCSV(text) {
  const rows = text.trim().split("\n").map(r =>
    r.split(",").map(c => c.replace(/^"|"$/g, "").trim())
  );

  const headers = rows[0];
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i] || "");
    return obj;
  });
}

function drawChart(dataRows) {
  const data = new google.visualization.DataTable();
  data.addColumn('string', 'Name');
  data.addColumn('string', 'Manager');
  data.addColumn('string', 'Tooltip');

  dataRows.forEach(row => {
    const name = row["Nume intern"];
    const manager = row["Reports to"] || "";
    const role = row["Rol"];
    const dept = row["Departament"];

    const color = DEPT_COLORS[dept] || "#607D8B";

    const html = `
      <div class="node" style="background:${color}">
        <div class="name">${name}</div>
        <div class="role">${role}</div>
        <div class="dept">${dept}</div>
      </div>
    `;

    data.addRow([
      { v: name, f: html },
      manager,
      `${name} – ${role}`
    ]);
  });

  const chart = new google.visualization.OrgChart(
    document.getElementById('orgchart')
  );

  chart.draw(data, {
    allowHtml: true,
    allowCollapse: true,
    size: 'large'
  });

  // Afișarea modalului atunci când se face click pe un nume
  google.visualization.events.addListener(chart, 'select', function() {
    const selectedItem = chart.getSelection()[0];
    if (!selectedItem) return;

    const name = data.getValue(selectedItem.row, 0);  // Obține numele din linia selectată
    const role = data.getValue(selectedItem.row, 1);  // Obține rolul
    const dept = data.getValue(selectedItem.row, 2);  // Obține departamentul

    console.log("Selected:", name, role, dept);  // Debugging log pentru click

    // Actualizează modalul cu informațiile respective
    document.getElementById('modal-name').textContent = name;
    document.getElementById('modal-role').textContent = role;

    // Preia responsibilitățile dintr-o sursă (CSV sau alte surse)
    fetchResponsibilities(name);

    // Afișează modalul
    document.getElementById('modal').style.display = "block";
  });
}

// Functia care preia responsabilitățile
function fetchResponsibilities(name) {
  const tasks = {
    "Mădă": ["Gestionează campanii Google Ads", "Analizează evoluția performanței"],
    "Răzvan": ["Supraveghează echipa de performance", "Coordonează implementările în campanii"]
  };

  const tasksContainer = document.getElementById("modal-tasks");
  tasksContainer.innerHTML = ''; // Golește containerul anterior
  if (tasks[name]) {
    tasks[name].forEach(task => {
      const taskDiv = document.createElement("div");
      taskDiv.textContent = task;
      tasksContainer.appendChild(taskDiv);
    });
  } else {
    tasksContainer.textContent = "Nu s-au găsit responsabilități pentru această persoană.";
  }
}

// Închide modalul atunci când se face click pe "×"
document.getElementById('close').onclick = function() {
  document.getElementById('modal').style.display = "none";
}

// Închide modalul dacă se face click în afacerea acestuia
window.onclick = function(event) {
  if (event.target === document.getElementById('modal')) {
    document.getElementById('modal').style.display = "none";
  }
};
