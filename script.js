let estado = 0.5;
let pensamientos = JSON.parse(localStorage.getItem("pensamientos") || "[]");

function actualizarBarra() {
    const barra = document.getElementById("barra-estado");
    barra.style.width = (estado * 100) + "%";
    barra.style.backgroundColor = estado < 0.3 ? "red" : estado < 0.6 ? "orange" : "green";
}

function publicar() {
    const autor = document.getElementById("autor").value;
    const texto = document.getElementById("pensamiento").value.trim();
    if (!texto) return;
    const nuevo = {
        autor,
        text: texto,
        timestamp: new Date().toISOString(),
        reaccion: null
    };
    pensamientos.push(nuevo);
    localStorage.setItem("pensamientos", JSON.stringify(pensamientos));
    document.getElementById("pensamiento").value = "";
    renderizarPensamientos();
}

function reaccionar(index, valor) {
    if (pensamientos[index].reaccion !== null) return;
    pensamientos[index].reaccion = valor;
    estado = Math.max(0, Math.min(1, estado + valor));
    localStorage.setItem("pensamientos", JSON.stringify(pensamientos));
    actualizarBarra();
    renderizarPensamientos();
}

function renderizarPensamientos() {
    const contenedor = document.getElementById("pensamientos");
    contenedor.innerHTML = "";
    const agrupados = {};

    pensamientos.slice().reverse().forEach((p, i) => {
        const fecha = new Date(p.timestamp).toLocaleDateString('es-ES', { dateStyle: "full" });
        if (!agrupados[fecha]) agrupados[fecha] = [];
        agrupados[fecha].push({ ...p, idx: pensamientos.length - 1 - i });
    });

    for (let dia in agrupados) {
        const grupo = document.createElement("div");
        grupo.className = "dia-grupo";
        const toggle = document.createElement("button");
        toggle.className = "toggle-dia";
        toggle.textContent = dia;
        const inner = document.createElement("div");
        inner.style.display = "none";

        toggle.onclick = () => {
            inner.style.display = inner.style.display === "none" ? "block" : "none";
        };

        agrupados[dia].forEach(pens => {
            const div = document.createElement("div");
            div.className = "pensamiento";
            const autor = document.createElement("strong");
            autor.textContent = pens.autor + ": ";
            const texto = document.createElement("span");
            texto.textContent = pens.text;
            const time = document.createElement("div");
            time.className = "timestamp";
            time.textContent = new Date(pens.timestamp).toLocaleString('es-ES');
            const reacciones = document.createElement("div");
            reacciones.className = "reacciones";

            if (pens.reaccion === null) {
                ["😡", "😢", "😊"].forEach((c, idx) => {
                    const btn = document.createElement("button");
                    btn.textContent = c;
                    btn.onclick = () => reaccionar(pens.idx, [-0.2, -0.1, 0.1][idx]);
                    reacciones.appendChild(btn);
                });
            } else {
                const msg = document.createElement("div");
                msg.textContent = "Reacción enviada.";
                reacciones.appendChild(msg);
            }

            div.appendChild(autor);
            div.appendChild(texto);
            div.appendChild(time);
            div.appendChild(reacciones);
            inner.appendChild(div);
        });

        grupo.appendChild(toggle);
        grupo.appendChild(inner);
        contenedor.appendChild(grupo);
    }
}

function iniciarContador() {
    const fin = new Date();
    fin.setDate(fin.getDate() + 31);

    function actualizar() {
        const ahora = new Date();
        let delta = Math.max(0, fin - ahora);
        const dias = Math.floor(delta / (1000 * 60 * 60 * 24));
        delta %= (1000 * 60 * 60 * 24);
        const horas = Math.floor(delta / (1000 * 60 * 60));
        delta %= (1000 * 60 * 60);
        const mins = Math.floor(delta / (1000 * 60));
        document.getElementById("contador").textContent =
            `Quedan ${dias} días, ${horas} horas y ${mins} minutos.`;
    }

    actualizar();
    setInterval(actualizar, 60000);
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarBarra();
    renderizarPensamientos();
    iniciarContador();
});