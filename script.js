// To‘plamlarni o‘qish
function getSets() {
    const a = document.getElementById("setA").value;
    const b = document.getElementById("setB").value;

    if (!a.trim() || !b.trim()) {
        throw new Error("Ikkala to‘plamni ham kiriting!");
    }

    const A = [...new Set(a.split(",").map(x => x.trim()).filter(Boolean))];
    const B = [...new Set(b.split(",").map(x => x.trim()).filter(Boolean))];

    return { A, B };
}

// To‘plamlarni chiqarish
function showSet(set) {
    return `{ ${set.join(", ")} }`;
}

// Tenglikni tekshirish
function same(A, B) {
    return A.length === B.length &&
        A.every(x => B.includes(x));
}

// Hisoblash
function calculate(operation) {
    const output = document.getElementById("output");

    try {
        const { A, B } = getSets();
        let result;
        let formula = "";
        let steps = "";

        switch (operation) {
            case "union":
                result = [...new Set([...A, ...B])];
                formula = "A ∪ B";
                steps = "Ikkala to‘plam elementlari birlashtirildi.";
                break;

            case "intersection":
                result = A.filter(x => B.includes(x));
                formula = "A ∩ B";
                steps = "Ikkala to‘plamda ham mavjud elementlar olindi.";
                break;

            case "differenceAB":
                result = A.filter(x => !B.includes(x));
                formula = "A − B";
                steps = "A da bor, B da yo‘q elementlar olindi.";
                break;

            case "differenceBA":
                result = B.filter(x => !A.includes(x));
                formula = "B − A";
                steps = "B da bor, A da yo‘q elementlar olindi.";
                break;

            case "symmetric":
                result = [
                    ...A.filter(x => !B.includes(x)),
                    ...B.filter(x => !A.includes(x))
                ];
                formula = "A △ B";
                steps = "Faqat bittasida mavjud elementlar olindi.";
                break;

            case "cartesian":
                result = [];
                A.forEach(a => {
                    B.forEach(b => {
                        result.push(`(${a}, ${b})`);
                    });
                });
                formula = "A × B";
                steps = "A ning har bir elementi B ning har bir elementi bilan juftlandi.";
                break;

            case "subset":
                result = A.every(x => B.includes(x));
                formula = "A ⊆ B";
                steps = result
                    ? "A ning barcha elementlari B da mavjud."
                    : "A ning kamida bitta elementi B da mavjud emas.";
                break;

            case "equal":
                result = same(A, B);
                formula = "A = B";
                steps = result
                    ? "Ikkala to‘plamning elementlari bir xil."
                    : "To‘plamlar elementlari bir xil emas.";
                break;
        }

        const displayed = typeof result === "boolean"
            ? (result ? "Rost (True)" : "Yolg‘on (False)")
            : showSet(result);

        output.innerHTML = `
            <h3>Formula: ${formula}</h3>
            <div class="result-step">
                <b>A =</b> ${showSet(A)}<br>
                <b>B =</b> ${showSet(B)}
            </div>
            <div class="result-step">
                <b>Natija:</b> ${displayed}
            </div>
            <div class="result-step">
                <b>Yechish:</b> ${steps}
            </div>
        `;

    } catch (error) {
        output.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

// Xossalarni tekshirish
function checkProperty() {
    const output = document.getElementById("output");

    try {
        const { A, B } = getSets();
        const property = document.getElementById("property").value;

        let left, right, formula, explanation;

        const union = (X, Y) =>
            [...new Set([...X, ...Y])];

        const intersection = (X, Y) =>
            X.filter(x => Y.includes(x));

        switch (property) {
            case "commutative":
                left = union(A, B);
                right = union(B, A);
                formula = "A ∪ B = B ∪ A";
                explanation = "Birlashmada elementlar tartibi natijani o‘zgartirmaydi.";
                break;

            case "associative":
                left = union(union(A, B), A);
                right = union(A, union(B, A));
                formula = "(A ∪ B) ∪ A = A ∪ (B ∪ A)";
                explanation = "Guruhlash tartibi natijaga ta’sir qilmaydi.";
                break;

            case "distributive":
                left = intersection(A, union(A, B));
                right = union(intersection(A, A), intersection(A, B));
                formula = "A ∩ (A ∪ B) = (A ∩ A) ∪ (A ∩ B)";
                explanation = "Kesishmaning birlashmaga nisbatan taqsimot xossasi.";
                break;

            case "idempotent":
                left = union(A, A);
                right = A;
                formula = "A ∪ A = A";
                explanation = "To‘plamning o‘zi bilan birlashmasi o‘ziga teng.";
                break;

            case "identity":
                left = union(A, []);
                right = A;
                formula = "A ∪ ∅ = A";
                explanation = "Bo‘sh to‘plam bilan birlashma A ning o‘ziga teng.";
                break;
        }

        const verified = same(left, right);

        output.innerHTML = `
            <h3>${formula}</h3>
            <div class="result-step">
                <b>Chap tomon:</b> ${showSet(left)}
            </div>
            <div class="result-step">
                <b>O‘ng tomon:</b> ${showSet(right)}
            </div>
            <div class="result-step">
                <b>Tushuntirish:</b> ${explanation}
            </div>
            <div class="result-step ${verified ? "success" : "error"}">
                ${verified ? "✓ Tenglik bajarildi." : "✗ Tenglik bajarilmadi."}
            </div>
            <p style="margin-top:12px">
                Eslatma: bu hisoblash kiritilgan to‘plamlar uchun
                tekshiruvdir, umumiy matematik isbot emas.
            </p>
        `;

    } catch (error) {
        output.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

