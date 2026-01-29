const dscc = window.dscc;

function drawViz(data) {
  const container = document.getElementById("chart");
  container.innerHTML = "";

  const rows = data.tables.DEFAULT;

  // map employees
  const nodes = rows.map(r => ({
    id: r.employee,
    parent: r.manager || null,
    role: r.role || ""
  }));

  // render simple tree
  nodes.forEach(n => {
    const div = document.createElement("div");
    div.className = "node";
    div.innerHTML = `
      <strong>${n.id}</strong>
      <div class="role">${n.role}</div>
      ${n.parent ? `<div class="role">Reports to: ${n.parent}</div>` : ""}
    `;
    container.appendChild(div);
  });
}

dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
