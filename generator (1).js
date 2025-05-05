document.getElementById("offerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Сбор данных из формы
    const offerNumber = document.getElementById("offerNumber").value;
    const date = document.getElementById("date").value;
    const designer = document.getElementById("designer").value;
    const customer = document.getElementById("customer").value || "-";
    const objectLocation = document.getElementById("objectLocation").value || "-";
    const stoneType = document.getElementById("stoneType").value;
    const stoneName = document.getElementById("stoneName").value;
    const priceBreakdown = JSON.parse(document.getElementById("priceBreakdown").value);

    // Генерация HTML для предложения
    let offerHTML = `
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Предложение ${offerNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f4f4f4; }
                h1, h2 { text-align: center; }
                footer { margin-top: 20px; font-size: 0.9em; color: #555; }
            </style>
        </head>
        <body>
            <h1>Коммерческое предложение</h1>
            <h2>${offerNumber}</h2>
            <p><strong>Дата:</strong> ${date}</p>
            <p><strong>Дизайнер:</strong> ${designer}</p>
            <p><strong>Заказчик:</strong> ${customer}</p>
            <p><strong>Местоположение объекта:</strong> ${objectLocation}</p>
            <p><strong>Тип камня:</strong> ${stoneType}</p>
            <p><strong>Название камня:</strong> ${stoneName}</p>

            <table>
                <tr>
                    <th>№</th>
                    <th>Элемент</th>
                    <th>Цена (руб.)</th>
                </tr>
    `;

    // Добавление строк разбивки цен
    let total = 0;
    priceBreakdown.forEach((entry, index) => {
        offerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${entry.item}</td>
                <td>${entry.price.toLocaleString()}</td>
            </tr>
        `;
        total += entry.price;
    });

    offerHTML += `
            <tr>
                <td colspan="2" style="text-align: right;"><strong>Итого:</strong></td>
                <td><strong>${total.toLocaleString()}</strong></td>
            </tr>
            </table>

            <footer>
                <p>Примечание: Окончательная стоимость будет рассчитана после уточненных замеров и подтверждения чертежей.</p>
            </footer>
        </body>
        </html>
    `;

    // Открытие нового окна с предложением
    const newTab = window.open();
    newTab.document.write(offerHTML);
    newTab.document.close();
});