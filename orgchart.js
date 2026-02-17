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

      google.visualization.events.addListener(chart, 'select', function() {
        const selectedItem = chart.getSelection()[0];
        const name = data.getValue(selectedItem.row, 0);  // Obține numele din linia selectată
        const role = data.getValue(selectedItem.row, 1);  // Obține rolul
        const dept = data.getValue(selectedItem.row, 2);  // Obține departamentul

        // Redirecționează către pagina de responsabilități
        window.open(`responsabilitati.html?name=${name}&role=${role}&dept=${dept}`, "_blank");
      });
    }
