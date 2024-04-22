function renderTable() {
    return new Promise((resolve, reject) => {

        class DataTable {
            constructor(fetchUrl, dataProps, tableId) {
                this.fetchUrl = fetchUrl;
                this.dataProps = dataProps;
                this.tableId = tableId;
                this.globalStartIndex = 0;
                this.globalEndIndex = 10;
            }

            populateTableWithData(data, startIndex, endIndex) {
                const table = document.getElementById(this.tableId);
                const tbody = table.querySelector('.table_body');

                // Only clear the table if starting from the beginning
                if (startIndex === 0) {
                    while (tbody.firstChild) {
                        tbody.removeChild(tbody.firstChild);
                    }
                }

                let indexCount = startIndex + 1;

                // Create a DocumentFragment
                const fragment = document.createDocumentFragment();
                for (let i = startIndex; i < Math.min(endIndex, data.length); i++) {
                    const rowData = data[i];
                    const newRow = document.createElement('tr');
                    newRow.classList.add('table_row');
                    const dataProps = this.dataProps

                    const indexCell = document.createElement('td');
                    indexCell.classList.add('table_cell');
                    indexCell.textContent = indexCount;
                    newRow.appendChild(indexCell);
                    indexCount++;

                    // List of strings
                    let strings = ['GBTC', 'IBIT', 'FBTC', 'ARKB', 'BITB', 'BTCO', 'HODL', 'BRRR', 'EZBC', 'BTCW'];

                    for (const prop of dataProps) {
                        const cell = document.createElement('td');
                        cell.classList.add('table_cell');

                        if (strings.includes(prop)) {
                            try {
                                // Check if rowData[prop] is not null and not undefined
                                if (rowData[prop] !== null && rowData[prop] !== undefined) {
                                    // Convert to number
                                    let value = parseFloat(rowData[prop]);

                                    // Determine color based on whether the value is positive or negative
                                    let color = value < 0 ? 'E20202' : '04BB5B';

                                    // Check if the number is over a million or a billion and append 'M' or 'B' respectively
                                    if (Math.abs(value) >= 1000000000) {
                                        value = `${value < 0 ? '-' : '+'}${(Math.abs(value) / 1000000000).toFixed(2)}B`;
                                    } else if (Math.abs(value) >= 1000000) {
                                        value = `${value < 0 ? '-' : '+'}${(Math.abs(value) / 1000000).toFixed(2)}M`;
                                    } else {
                                        // Add a '+' sign before positive numbers and limit to 2 decimal places
                                        value = `${value < 0 ? '' : '+'}${value.toFixed(2)}`;
                                    }

                                    cell.innerHTML = `<span style="color: #${color};">${value}</span>`;
                                } else {
                                    cell.innerHTML = '--';
                                }
                            } catch (error) {
                                console.error(`Error processing data for prop ${prop}:`, error);
                            }
                        } else if (prop === 'total') {
                            if (rowData['changeUsd'] !== null && rowData['changeUsd'] !== undefined) {
                                // Convert to number
                                let value = parseFloat(rowData['changeUsd']);

                                // Determine color based on whether the value is positive or negative
                                let color = value < 0 ? 'E20202' : '04BB5B';

                                // Check if the number is over a million or a billion and append 'M' or 'B' respectively
                                if (Math.abs(value) >= 1000000000) {
                                    value = `${value < 0 ? '-' : '+'}${(Math.abs(value) / 1000000000).toFixed(2)}B`;
                                } else if (Math.abs(value) >= 1000000) {
                                    value = `${value < 0 ? '-' : '+'}${(Math.abs(value) / 1000000).toFixed(2)}M`;
                                } else {
                                    // Add a '+' sign before positive numbers and limit to 2 decimal places
                                    value = `${value < 0 ? '' : '+'}${value.toFixed(2)}`;
                                }

                                cell.innerHTML = `<span style="color: #${color};">${value}</span>`;
                            } else {
                                cell.innerHTML = '--';
                            }
                        } else if (prop === 'name') {
                            cell.innerHTML = rowData[prop] !== null ? `${rowData[prop]}` : '--';
                        } else if (prop === 'premiumDiscount') {
                            let value = rowData[prop] !== null ? parseFloat(rowData[prop]).toFixed(2) : '--';
                            let color = value < 0 ? 'E20202' : '04BB5B';
                            cell.innerHTML = `<span class="text-weight-bold" style="color: #${color};">${value}%</span>`;
                        }

                        else if (prop === 'price') {
                            let value = rowData[prop] !== null ? rowData[prop] : '--';
                            cell.innerHTML = `<span class="text-weight-bold">$${value}</span>`;
                        } else if (prop === 'priceChange') {
                            let color = rowData.priceChangePercent < 0 ? 'E20202' : '04BB5B';
                            let value = rowData[prop] !== null ? `<span class="text-weight-bold">${rowData[prop]}</span><br /><span style="color: #${color};">${rowData.priceChangePercent}%</span>` : '--';
                            cell.innerHTML = value;
                        } else if (prop === 'btcChange1d') {
                            let value1 = rowData[prop] !== null && rowData[prop] !== undefined ? parseFloat(rowData[prop]).toFixed(2) : 0;
                            let value2 = rowData['btcChangePercent1d'] !== null && rowData['btcChangePercent1d'] !== undefined ? parseFloat(rowData['btcChangePercent1d']).toFixed(2) : 0;
                            let color = value2 < 0 ? 'E20202' : '04BB5B';
                            cell.innerHTML = `<strong>${value1}%</strong><br /><span style="color: #${color};"><strong>${value2}%</strong></span>`;
                        } else if (prop === 'btcChange7d') {
                            let value1 = rowData[prop] !== null && rowData[prop] !== undefined ? parseFloat(rowData[prop]).toFixed(2) : 0;
                            let value2 = rowData['btcChangePercent7d'] !== null && rowData['btcChangePercent7d'] !== undefined ? parseFloat(rowData['btcChangePercent7d']).toFixed(2) : 0;
                            let color = value2 < 0 ? 'E20202' : '04BB5B';
                            cell.innerHTML = `<strong>${value1}%</strong><br /><span style="color: #${color};"><strong>${value2}%</strong></span>`;
                        } else if (prop === 'nav') {
                            let value = rowData[prop] !== null ? rowData[prop] : '--';
                            let date = rowData['date'] !== null ? rowData['date'] : '--';
                            cell.innerHTML = `$${value}<br />${date}`;
                        } else if (prop === 'btcHolding') {
                            try {
                                // Check if rowData[prop] is not null and not undefined
                                if (rowData[prop] !== null && rowData[prop] !== undefined) {
                                    // Convert to number and limit to 2 decimal places
                                    let value = parseFloat(rowData[prop]);

                                    // Check if the number is over a million or a billion and append 'M' or 'B' respectively
                                    if (value >= 1000000000) {
                                        value = `${(value / 1000000000).toFixed(2)}B`;
                                    } else if (value >= 1000000) {
                                        value = `${(value / 1000000).toFixed(2)}M`;
                                    } else {
                                        value = value.toFixed(2);
                                    }

                                    // Format the number with commas
                                    value = Number(value).toLocaleString('en');

                                    cell.innerHTML = `${value}`;
                                } else {
                                    cell.innerHTML = '--';
                                }
                            } catch (error) {
                                console.error(`Error processing data for prop ${prop}:`, error);
                            }
                        } else if (prop === 'turnoverRate' || prop === 'expenseRatio') {
                            let value = rowData[prop] !== null && rowData[prop] !== undefined ? parseFloat(rowData[prop]).toFixed(2) : 0;
                            cell.innerHTML = `${value}%`;

                        } else if (prop === 'volume' || prop === 'marketCap') {
                            try {
                                // Check if rowData[prop] is not null and not undefined
                                if (rowData[prop] !== null && rowData[prop] !== undefined) {
                                    // Remove the dollar sign from the original data and convert to number
                                    let value = parseFloat(rowData[prop].toString().replace(/\$/g, ''));



                                    // Check if the number is over a million or a billion and append 'M' or 'B' respectively
                                    if (value >= 1000000000) {
                                        value = `$${(value / 1000000000).toFixed(2)}B`;
                                    } else if (value >= 1000000) {
                                        value = `$${(value / 1000000).toFixed(2)}M`;
                                    } else {
                                        value = `$${value.toFixed(2)}`;
                                    }

                                    cell.innerHTML = `<span data-type="${prop}">${value}</span>`;
                                } else {
                                    cell.innerHTML = '--';
                                }
                            } catch (error) {
                                console.error(`Error processing data for prop ${prop}:`, error);
                            }
                        } else if (prop === 'aum') {
                            try {
                                // Check if rowData[prop] is not null and not undefined
                                if (rowData[prop] !== null && rowData[prop] !== undefined) {
                                    // Remove the dollar sign from the original data and convert to number

                                    let value = parseFloat(rowData[prop].toString().replace(/\$/g, ''));

                                    // Check if the number is over a million or a billion and append 'M' or 'B' respectively
                                    if (value >= 1000000000) {
                                        value = `$${(value / 1000000000).toFixed(2)}B`;
                                    } else if (value >= 1000000) {
                                        value = `$${(value / 1000000).toFixed(2)}M`;
                                    } else {
                                        value = `$${value.toFixed(2)}`;
                                    }

                                    cell.innerHTML = `<strong><span data-type="${prop}">${value}</span></strong>`;

                                } else {
                                    cell.innerHTML = '--';
                                }
                            } catch (error) {
                                console.error(`Error processing data for prop ${prop}:`, error);
                            }
                        } else if (prop === 'type') {
                            cell.innerHTML = rowData[prop] !== null ? `${rowData[prop]}` : '--';
                        } else if (prop === 'ticker') {
                            cell.innerHTML = rowData[prop] !== null ? `<strong>${rowData[prop]}</strong>` : '--';
                        } else {
                            cell.textContent = rowData[prop] !== null ? `${rowData[prop]}` : '--';
                        }

                        newRow.appendChild(cell);
                    }

                    fragment.appendChild(newRow);

                }

                tbody.appendChild(fragment);

            }

            loadMoreData(data) {
                const loadMoreButton = document.querySelector('[load-more]');
                if (loadMoreButton) {
                    loadMoreButton.addEventListener('click', () => {
                        const nextEndIndex = Math.min(this.globalEndIndex + 10, data.length);
                        if (this.globalEndIndex < data.length) {
                            this.populateTableWithData(data, this.globalEndIndex, nextEndIndex);
                            this.globalStartIndex = this.globalEndIndex; // Update the global startIndex
                            this.globalEndIndex = nextEndIndex; // Update the global endIndex
                        } else {
                            loadMoreButton.style.display = 'none'; // Hide the button if all data is loaded
                        }
                    });
                }
            }

            fetchData() {
                fetch(this.fetchUrl)
                    .then((response) => response.json())
                    .then((data) => {
                        this.populateTableWithData(data, this.globalStartIndex, this.globalEndIndex);
                        this.loadMoreData(data);
                        if (this.globalEndIndex >= data.length) {
                            const loadMoreButton = document.querySelector('[load-more]');
                            loadMoreButton.style.display = 'none';
                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error);
                    });
            }

            sortTableBy(data, sortBy) {
                data.sort((a, b) => {
                    let aValue = a[sortBy] === null || a[sortBy] === undefined || a[sortBy] === '' ? -Infinity : (typeof a[sortBy] === 'string' ? this.convertToNumber(a[sortBy]) : a[sortBy]);
                    let bValue = b[sortBy] === null || b[sortBy] === undefined || b[sortBy] === '' ? -Infinity : (typeof b[sortBy] === 'string' ? this.convertToNumber(b[sortBy]) : b[sortBy]);

                    if (aValue < bValue) return -1;
                    if (aValue > bValue) return 1;
                    return 0;
                });
            }

            convertToNumber(value) {
                value = value.replace(/,/g, '');
                if (value.endsWith('B')) {
                    return parseFloat(value.slice(0, -1)) * 1000000000;
                } else if (value.endsWith('M')) {
                    return parseFloat(value.slice(0, -1)) * 1000000;
                } else {
                    return parseFloat(value);
                }
            }

        }

        // Now you can create multiple instances of DataTable with different fetch URLs and data properties
        const table1 = new DataTable('https://dw-app-a83a83790d97.herokuapp.com/api/getBitcoinETF', ['ticker', 'name', 'price', 'priceChange', 'volume', 'turnoverRate', 'aum', 'marketCap', 'expenseRatio', 'type'], 'table1');
        table1.fetchData();

        const table2 = new DataTable('https://dw-app-a83a83790d97.herokuapp.com/api/getBitcoinETFFlow', ['time', 'GBTC', 'IBIT', 'FBTC', 'ARKB', 'BITB', 'BTCO', 'HODL', 'BRRR', 'EZBC', 'BTCW', 'total'], 'table2');
        table2.fetchData();

        const table3 = new DataTable('https://dw-app-a83a83790d97.herokuapp.com/api/getBitcoinETFAssetInfo', ['ticker', 'name', 'price', 'priceChange', 'premiumDiscount', 'btcHolding', 'btcChange1d', 'btcChange7d', 'nav'], 'table3');
        table3.fetchData();

        const getCellValue = (tr, idx) => {
            let text = tr.children[idx].innerText || tr.children[idx].textContent;
            text = text.replace('$', ''); // Remove the dollar sign
            if (text[0] === '+' || text[0] === '-') {
                return parseFloat(text);
            } else if (text.endsWith('M')) {
                return parseFloat(text.slice(0, -1)) * 1000000;
            } else if (text.endsWith('B')) {
                return parseFloat(text.slice(0, -1)) * 1000000000;
            } else {
                return text;
            }
        };

        const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
            v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
        )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

        // Function to mirror the click onto the first table header
        const mirrorClickToFirstHeader = (table) => {
            const firstHeader = table.querySelector('thead th');
            firstHeader.click(); // Trigger a click event on the first header
        }

        // Do the work on thead click
        document.querySelectorAll('th').forEach(th => th.addEventListener('click', function () {
            const table = th.closest('table');
            const tbody = table.querySelector('tbody');

            // Check if the header has a data attribute 'data-sort-by' set to 'first-column'
            if (th.getAttribute('data-sort-by') === 'first-column') {
                mirrorClickToFirstHeader(table); // Mirror the click onto the first header
            } else {
                const index = Array.from(th.parentNode.children).indexOf(th);
                Array.from(tbody.querySelectorAll('tr'))
                    .sort(comparer(index, this.asc = !this.asc))
                    .forEach(tr => tbody.appendChild(tr));
            }
        }));

        document.addEventListener('DOMContentLoaded', function () {
            // Get all elements with the 'data-mirror' attribute
            var mirrors = document.querySelectorAll('[data-mirror]');

            // Attach a click event handler to each mirror element
            mirrors.forEach(function (mirror) {
                mirror.addEventListener('click', function () {
                    // Get the value of the 'data-mirror' attribute
                    var mirrorValue = this.getAttribute('data-mirror');

                    // Get all elements with a 'data-reflection' attribute that have the same value
                    var reflections = document.querySelectorAll('[data-reflection="' + mirrorValue + '"]');

                    // Trigger a click event on each reflection element
                    reflections.forEach(function (reflection) {
                        reflection.click();
                    });
                });
            });
        });

        resolve();
    });
};

renderTable().then(() => {
// Import fetch if it's not available globally
// const fetch = require('node-fetch');

let totalVolume = 0;
let totalAum = 0;
let totalMarketCap = 0;

fetch('https://dw-app-a83a83790d97.herokuapp.com/api/getBitcoinETF')
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            totalVolume += item.volume;
            totalAum += item.aum;
            totalMarketCap += item.marketCap;
        });

        // Format the totals
        totalVolume = formatNumber(totalVolume);
        totalAum = formatNumber(totalAum);
        totalMarketCap = formatNumber(totalMarketCap);

        // Set the innerHTML of the elements
        document.querySelector('[data-total="volume"]').innerHTML = totalVolume;
        document.querySelector('[data-total="aum"]').innerHTML = totalAum;
        document.querySelector('[data-total="marketCap"]').innerHTML = totalMarketCap;
    })
    .catch(error => console.error('Error:', error));

// Function to format the numbers
function formatNumber(num) {
    num = parseFloat(num); // Convert num to a number
    let formattedNum = num;

    if (num >= 1e9) {
        formattedNum = (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
        formattedNum = (num / 1e6).toFixed(2) + 'M';
    } else {
        formattedNum = num.toFixed(2);
    }

    return '$' + formattedNum;
}

});
