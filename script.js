// ==========================================
// LRU CACHE VISUALIZER
// Frontend Prototype
// ==========================================


// ------------------------------------------
// GLOBAL VARIABLES
// ------------------------------------------

let capacity = 4;

let cache = [];

let hits = 0;
let misses = 0;
let evictions = 0;

let history = [];


// ------------------------------------------
// HELPER FUNCTION
// ------------------------------------------

function $(id) {
    return document.getElementById(id);
}


// ------------------------------------------
// TIME
// ------------------------------------------

function getCurrentTime() {

    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

}


// ------------------------------------------
// TOAST MESSAGE
// ------------------------------------------

function showToast(message) {

    const toast = $("toast");

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 1800);

}


// ------------------------------------------
// ADD OPERATION TO HISTORY
// ------------------------------------------

function logAction(type, message, tone) {

    history.unshift({

        type: type,

        message: message,

        tone: tone,

        time: getCurrentTime()

    });


    // Keep only last 30 operations

    if (history.length > 30) {

        history.pop();

    }


    renderHistory();

}


// ------------------------------------------
// DISPLAY OPERATION HISTORY
// ------------------------------------------

function renderHistory() {

    const historyList = $("historyList");

    const historyCount = $("historyCount");


    historyCount.textContent =
        `${history.length} action${history.length === 1 ? "" : "s"}`;


    // Empty history

    if (history.length === 0) {

        historyList.innerHTML = `

            <div
                class="empty-state"
                style="min-height:120px"
            >

                <div>

                    <strong>
                        No operations yet
                    </strong>

                    <span>
                        Try PUT A → 100 to begin.
                    </span>

                </div>

            </div>

        `;

        return;

    }


    // Create history items

    historyList.innerHTML = history.map(item => `

        <div class="history-item">

            <div class="op ${item.tone}">
                ${item.type}
            </div>

            <div>
                ${item.message}
            </div>

            <div class="time">
                ${item.time}
            </div>

        </div>

    `).join("");

}


// ------------------------------------------
// DISPLAY CACHE
// ------------------------------------------

function renderCache() {

    const cacheTrack = $("cacheTrack");

    const cacheCount = $("cacheCount");


    // Update capacity display

    cacheCount.textContent =
        `${cache.length} / ${capacity} slots used`;


    // --------------------------------------
    // EMPTY CACHE
    // --------------------------------------

    if (cache.length === 0) {

        cacheTrack.innerHTML = `

            <div class="empty-state">

                <div>

                    <strong>
                        Cache is empty
                    </strong>

                    <span>
                        Insert your first key-value pair
                        to visualize the LRU order.
                    </span>

                </div>

            </div>

        `;

    }


    // --------------------------------------
    // DISPLAY CACHE ITEMS
    // --------------------------------------

    else {

        let html = "";


        cache.forEach((item, index) => {


            // Cache node

            html += `

                <div class="cache-node">

                    <div class="node-badge">

                        ${
                            index === 0
                                ? "MRU"
                                : index === cache.length - 1
                                ? "LRU"
                                : "USED"
                        }

                    </div>


                    <div class="node-index">

                        NODE ${index + 1}

                    </div>


                    <div class="node-key">

                        ${escapeHtml(item.key)}

                    </div>


                    <div class="node-value">

                        Value:
                        ${escapeHtml(item.value)}

                    </div>

                </div>

            `;


            // Arrow between nodes

            if (index < cache.length - 1) {

                html += `

                    <div class="arrow">
                        ⇄
                    </div>

                `;

            }

        });


        cacheTrack.innerHTML = html;

    }


    // --------------------------------------
    // UPDATE STATISTICS
    // --------------------------------------

    $("hits").textContent = hits;

    $("misses").textContent = misses;

    $("evictions").textContent = evictions;


    const totalGets = hits + misses;


    let hitRate = 0;


    if (totalGets > 0) {

        hitRate = (hits / totalGets) * 100;

    }


    $("hitRate").textContent =
        `${hitRate.toFixed(1)}%`;

}


// ------------------------------------------
// PREVENT HTML INJECTION
// ------------------------------------------

function escapeHtml(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


// ------------------------------------------
// CHANGE CACHE CAPACITY
// ------------------------------------------

function syncCapacity() {

    let newCapacity =
        Number($("capacity").value);


    // Minimum capacity = 1

    if (!newCapacity || newCapacity < 1) {

        newCapacity = 1;

    }


    // Maximum capacity = 10

    if (newCapacity > 10) {

        newCapacity = 10;

    }


    $("capacity").value = newCapacity;


    capacity = newCapacity;


    // Remove items if new capacity is smaller

    while (cache.length > capacity) {

        const removedItem = cache.pop();

        evictions++;


        logAction(

            "EVICT",

            `Capacity changed → removed ${removedItem.key}`,

            "op-miss"

        );

    }


    renderCache();

}


// ------------------------------------------
// PUT OPERATION
// ------------------------------------------

function putItem() {

    syncCapacity();


    const key =
        $("key").value.trim();


    const value =
        $("value").value.trim();


    // Validate input

    if (!key || !value) {

        showToast(
            "Enter both a key and a value."
        );

        return;

    }


    // --------------------------------------
    // CHECK IF KEY ALREADY EXISTS
    // --------------------------------------

    const index = cache.findIndex(

        item =>
            item.key.toLowerCase() === key.toLowerCase()

    );


    // --------------------------------------
    // KEY EXISTS
    // --------------------------------------

    if (index !== -1) {


        // Remove old position

        cache.splice(index, 1);


        // Put updated item at front

        cache.unshift({

            key: key,

            value: value

        });


        logAction(

            "PUT",

            `Updated ${key} and moved it to MRU`,

            "op-put"

        );


        showToast(
            `${key} updated`
        );

    }


    // --------------------------------------
    // NEW KEY
    // --------------------------------------

    else {


        // Cache full?

        if (cache.length >= capacity) {


            // Remove least recently used item

            const removedItem =
                cache.pop();


            evictions++;


            logAction(

                "EVICT",

                `Cache full → evicted ${removedItem.key}`,

                "op-miss"

            );

        }


        // Add new item at front

        cache.unshift({

            key: key,

            value: value

        });


        logAction(

            "PUT",

            `Inserted ${key} = ${value}`,

            "op-put"

        );


        showToast(
            `${key} inserted`
        );

    }


    // Clear input fields

    clearInputs(false);


    // Update UI

    renderCache();

}


// ------------------------------------------
// GET OPERATION
// ------------------------------------------

function getItem() {

    const key =
        $("key").value.trim();


    // Validate key

    if (!key) {

        showToast(
            "Enter a key to search."
        );

        return;

    }


    // Find item

    const index = cache.findIndex(

        item =>
            item.key.toLowerCase() === key.toLowerCase()

    );


    // --------------------------------------
    // CACHE MISS
    // --------------------------------------

    if (index === -1) {

        misses++;


        logAction(

            "MISS",

            `GET ${key} → key not found`,

            "op-miss"

        );


        showToast(
            `Cache miss: ${key}`
        );

    }


    // --------------------------------------
    // CACHE HIT
    // --------------------------------------

    else {


        // Remove item from current position

        const item =
            cache.splice(index, 1)[0];


        // Move item to front

        cache.unshift(item);


        hits++;


        logAction(

            "HIT",

            `GET ${key} → moved to MRU`,

            "op-hit"

        );


        showToast(
            `Cache hit: ${key}`
        );

    }


    renderCache();

}


// ------------------------------------------
// DELETE OPERATION
// ------------------------------------------

function deleteItem() {

    const key =
        $("key").value.trim();


    // Validate

    if (!key) {

        showToast(
            "Enter a key to delete."
        );

        return;

    }


    // Find item

    const index = cache.findIndex(

        item =>
            item.key.toLowerCase() === key.toLowerCase()

    );


    // --------------------------------------
    // NOT FOUND
    // --------------------------------------

    if (index === -1) {

        logAction(

            "DELETE",

            `${key} was not found`,

            "op-delete"

        );


        showToast(
            `${key} not found`
        );

    }


    // --------------------------------------
    // DELETE ITEM
    // --------------------------------------

    else {

        cache.splice(index, 1);


        logAction(

            "DELETE",

            `Removed ${key} from cache`,

            "op-delete"

        );


        showToast(
            `${key} deleted`
        );

    }


    renderCache();

}


// ------------------------------------------
// RESET CACHE
// ------------------------------------------

function resetCache() {

    // Clear cache

    cache = [];


    // Reset statistics

    hits = 0;

    misses = 0;

    evictions = 0;


    // Clear history

    history = [];


    // Log reset

    logAction(

        "RESET",

        "Cache and statistics cleared",

        "op-reset"

    );


    // Update UI

    renderCache();

    renderHistory();


    showToast(
        "Cache reset"
    );


    // Clear inputs

    clearInputs(true);

}


// ------------------------------------------
// CLEAR INPUTS
// ------------------------------------------

function clearInputs(clearValue = false) {

    $("key").value = "";


    if (clearValue) {

        $("value").value = "";

    }

}


// ------------------------------------------
// CAPACITY CHANGE EVENT
// ------------------------------------------

$("capacity").addEventListener(

    "change",

    syncCapacity

);


// ------------------------------------------
// ENTER KEY SUPPORT
// ------------------------------------------

$("key").addEventListener(

    "keydown",

    function (event) {

        if (event.key === "Enter") {

            putItem();

        }

    }

);


$("value").addEventListener(

    "keydown",

    function (event) {

        if (event.key === "Enter") {

            putItem();

        }

    }

);


// ------------------------------------------
// INITIAL RENDER
// ------------------------------------------

renderCache();

renderHistory();