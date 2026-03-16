document.addEventListener("DOMContentLoaded", () => {
  const botonAgregar = document.getElementById("agregar-partida");
  const subtotalSpan = document.getElementById("subtotal");
  const ivaSpan = document.getElementById("iva");
  const totalSpan = document.getElementById("total");

  // Cálculos Automáticos
  function recalcularTotales() {
    let subtotal = 0;
    document.querySelectorAll(".partida-row").forEach(row => {
      const precio = parseFloat(row.querySelector(".precio").value) || 0;
      const cantidad = parseFloat(row.querySelector(".cantidad").value) || 0;
      const totalFila = precio * cantidad;
      row.querySelector(".total").value = totalFila.toFixed(2);
      subtotal += totalFila;
    });
    const iva = subtotal * 0.16;
    subtotalSpan.textContent = subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 });
    ivaSpan.textContent = iva.toLocaleString("es-MX", { minimumFractionDigits: 2 });
    totalSpan.textContent = (subtotal + iva).toLocaleString("es-MX", { minimumFractionDigits: 2 });
  }

  // Agregar Partida
  botonAgregar.addEventListener("click", () => {
    const nuevaFila = document.createElement("div");
    nuevaFila.classList.add("partida-row");
    const num = document.querySelectorAll(".partida-row").length + 1;
    nuevaFila.innerHTML = `
      <input type="text" class="partida" value="${num}" readonly>
      <input type="text" class="descripcion" placeholder="Descripción">
      <input type="text" class="precio" placeholder="0.00">
      <input type="text" class="cantidad" placeholder="0">
      <input type="text" class="total" readonly>
      <button class="eliminar-partida" type="button">X</button>
    `;
    botonAgregar.before(nuevaFila);
    nuevaFila.querySelectorAll("input").forEach(i => i.addEventListener("input", recalcularTotales));
    nuevaFila.querySelector(".eliminar-partida").onclick = () => { nuevaFila.remove(); recalcularTotales(); };
  });

  // Eventos iniciales
  document.querySelectorAll(".partida-row input").forEach(i => i.addEventListener("input", recalcularTotales));

  // GENERAR PDF
  document.getElementById("btnPDF").onclick = async () => {
    const elemento = document.querySelector(".container");
    const folio = document.getElementById("numero-orden").value;
    
    // Ocultar botones
    document.querySelector(".acciones").style.display = "none";
    document.getElementById("agregar-partida").style.display = "none";
    document.querySelectorAll(".eliminar-partida").forEach(b => b.style.display = "none");
    // Ajustes temporales para que html2pdf encaje dentro de la página
    const elementoOriginalWidth = elemento.style.width;
    const elementoOriginalMaxWidth = elemento.style.maxWidth;
    const elementoOriginalMargin = elemento.style.margin;
    elemento.style.width = '760px';
    elemento.style.maxWidth = '760px';
    elemento.style.margin = '0 auto';
    const opciones = {
      margin: 5,
      filename: `Orden_${folio}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opciones).from(elemento).save();
    } finally {
      // Restaurar estilos originales
      elemento.style.width = elementoOriginalWidth;
      elemento.style.maxWidth = elementoOriginalMaxWidth;
      elemento.style.margin = elementoOriginalMargin;

      // Mostrar botones de vuelta
      document.querySelector(".acciones").style.display = "flex";
      document.getElementById("agregar-partida").style.display = "block";
      document.querySelectorAll(".eliminar-partida").forEach(b => b.style.display = "inline-block");
    }
  };
});
