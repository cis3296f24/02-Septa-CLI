<script>
    import { bus, subway, rail } from "./transportStore";

    //  Form default values
    let radio = "leave";
    let stops = ["", ""];
    let suggestions = {};
    let routes = [];
    //property state
    let showDetails = Array(routes.length).fill(false);
    let focusedTextBox = null;
    // clears auto suggest when user clicks out of text box
    document.body.addEventListener("click", () => {
        const suggestionsBox = document.querySelector(
            ".autocomplete-suggestions",
        );
        if (suggestionsBox) suggestionsBox.classList.toggle("hidden");
    });
    // Auto suggest
    const suggestLocation = async (event) => {
        const str = event.target.value;
        if (str === "") {
            suggestions = {};
        } else {
            // console.log(str);
            const res = await fetch("/api/autocomplete", {
                method: "POST",
                body: JSON.stringify({ input: str }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            });
            let results = await res.json();
            suggestions[event.target.id] = results.predictions;
        }
    };

    const handleUnfocus = () => {
        setTimeout(() => (focusedTextBox = null), 200);
    };
    // Swap button
    const handleSwap = () => {
        let tmp = stops[1];
        stops[1] = stops[0];
        stops[0] = tmp;
        updateStopsText();
    };
    // Go button
    const handleFormSubmit = (event) => {
        // gather all data and store
        event.preventDefault();
        let start = document.getElementById("stop0");
        let end = document.getElementById(`stop${stops.length - 1}`);
        let date = document.getElementById("date");
        let time = document.getElementById("time");

        console.log(time.value);
        // validate input
        if (start === "") {
        }
        if (end === "") {
        }
        // refactor html to just use a calendar for date and create a MM/DD format for time
        const data = {
            start: start.value,
            end: end.value,
            radio: radio,
            date: date.value,
            time: time.value,
            transitModes: {
                Bus: $bus,
                Subway: $subway,
                Rail: $rail,
            },
        };
        // send data to trip creation function
        createTrip(data);
    };

    // create potential trips
    async function createTrip(data) {
        console.log(JSON.stringify(data));
        const res = await fetch("/api/google_directions", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });
        if (!res.ok) {
            console.log(`${res.status}: ${res.statusText}`);
            document.querySelector(".routes").innerHTML =
                "Could not fetch directions";
            return;
        }
        routes = await res.json();
        routes = JSON.parse(routes);
        updateShowDetailsState();
    }
    function updateShowDetailsState() {
        showDetails = Array(routes.length).fill(false);
    }
    // checks whether object has key "html_instructions"
    function containsHTML(step) {
        return step.hasOwnProperty("html_instructions");
    }
    function updateStopsArray() {
        //  Keeps array up to date with user input
        for (let index = 0; index < stops.length; index++)
            stops[index] = document.getElementById("stop" + index).value;
    }

    const addStop = (event) => {
        //  Shift last position in stops[] and clear value
        stops[stops.length] = stops[stops.length - 1];
        stops[stops.length - 2] = "";
        updateStopsText();
    };

    function removeStop(index) {
        //  Remove requested index from stops[]
        stops.splice(index, 1);
        updateStopsArray();
        //updateStopsText()
    }

    function roundTrip() {
        //  Add start destination to end of stops[] as a new stop
        if (stops[stops.length - 1] != stops[0]) stops[stops.length] = stops[0];
    }
    function updateStopsText() {
        for (let index = 0; index < stops.length; index++)
            document.getElementById("stop" + index).value = stops[index];
    }

    function toggleDetails(index) {
        showDetails[index] = !showDetails[index];
    }

    function getTransitMode(route) {
        console.log(route.legs);
        for (const leg of route.legs) {
            for (const step of leg.steps) {
                if (step.travel_mode === "TRANSIT") {
                    console.log(step.transit_details.line.vehicle.name);
                    return {
                        name: step.transit_details.line.vehicle.name,
                        icon: step.transit_details.line.vehicle.icon,
                    }; // Exit the function early and return the value
                }
            }
        }
        return "None"; // If no transit step was found, return "None"
    }
</script>

<div id="tp-body">
    <div class="userInputBackground">
        <form action="">
            <div class="input-field">
                {#each stops as stop, i}
                    <!-- Text boxes for each stop -->
                    {#if i == 0}
                        <input
                            type="text"
                            id="stop{i}"
                            name="stop{i}"
                            placeholder="Start"
                            autocomplete="off"
                            on:input={suggestLocation}
                            on:input={updateStopsArray}
                            on:focus={(event) =>
                                (focusedTextBox = event.target.id)}
                            on:blur={handleUnfocus}
                        />
                    {:else if i == stops.length - 1}
                        <input
                            type="text"
                            id="stop{i}"
                            name="stop{i}"
                            placeholder="End"
                            autocomplete="off"
                            on:input={suggestLocation}
                            on:input={updateStopsArray}
                            on:focus={(event) =>
                                (focusedTextBox = event.target.id)}
                            on:blur={handleUnfocus}
                        />
                    {:else}
                        <input
                            type="text"
                            id="stop{i}"
                            name="stop{i}"
                            placeholder="Stop {i}"
                            autocomplete="off"
                            on:input={suggestLocation}
                            on:input={updateStopsArray}
                            on:focus={(event) =>
                                (focusedTextBox = event.target.id)}
                            on:blur={handleUnfocus}
                        />
                    {/if}

                    {#if focusedTextBox === `stop${i}` && suggestions[`stop${i}`]?.length > 0}
                        <div class="autocomplete-suggestions">
                            {#each suggestions[`stop${i}`] as suggestion}
                                <button
                                    class="suggestion"
                                    on:click={(event) => {
                                        event.preventDefault();
                                        document.getElementById(
                                            `stop${i}`,
                                        ).value = suggestion.description;
                                        suggestions[`stop${i}`] = [];
                                        updateStopsArray();
                                    }}
                                >
                                    {suggestion.description}
                                </button>
                            {/each}
                        </div>
                    {/if}
                    <!-- Delete option for each stop -->
                    {#if stops.length > 2}
                        <a href="" on:click={() => removeStop(i)}>X</a>
                    {/if}
                {/each}

                {#if stops.length == 2}
                    <button id="swap" type="button" on:click={handleSwap}
                        >Swap</button
                    >
                {/if}
            </div>

            <div class="inlineElements">
                <label>
                    <input
                        type="radio"
                        id="leave"
                        name="button"
                        value="leave"
                        bind:group={radio}
                    /> Leave
                </label>
                <label>
                    <input
                        type="radio"
                        id="arrive"
                        name="button"
                        value="arrive"
                        bind:group={radio}
                    /> Arrive
                </label>
                <a href="#" on:click={() => roundTrip()}>+Round Trip</a>
                <a href="#" on:click={() => addStop()}>+Add Stop</a>
            </div>
            <input type="date" id="date" name="date" placeholder="Today" />
            <input type="time" id="time" name="time" placeholder="At" />
            <div class="inlineElements">
                <label>
                    <input
                        type="checkbox"
                        id="bus"
                        name="bus"
                        bind:checked={$bus}
                    />
                    Bus
                </label>
                <label>
                    <input
                        type="checkbox"
                        id="subway"
                        name="subway"
                        bind:checked={$subway}
                    /> Subway
                </label>
                <label>
                    <input
                        type="checkbox"
                        id="rail"
                        name="rail"
                        bind:checked={$rail}
                    /> Rail
                </label>
            </div>
            <input
                type="submit"
                value="Go"
                id="tp-submit"
                on:click={handleFormSubmit}
            />
        </form>
        {#each routes as route, index}
            <div class="route-info">
                <button
                    on:click={() => {
                        toggleDetails(index);
                        console.log(showDetails);
                    }}
                >
                    <img
                        src={getTransitMode(route).icon}
                        alt={getTransitMode(route).name}
                    />
                    <span id="times"
                        >Depart At: {route.legs[0].departure_time.text}</span
                    >
                    <span id="times"
                        >Arrival At: {route.legs[0].arrival_time.text}</span
                    >
                </button>
            </div>
            {#if showDetails[index]}
                <div class="route">
                    {#each route.legs as leg}
                        <div class="leg">
                            <!-- <div class="start-info">{leg.departure_time.text}</div> -->
                            {#each leg.steps as step}
                                <div class="step">
                                    <span id="duration"
                                        >{step.duration.text}</span
                                    >
                                    <span id="distance"
                                        >{step.distance.text}</span
                                    >
                                    <div class="instructions">
                                        {@html step.html_instructions}
                                        {#if step.steps}
                                            {#each step.steps as subStep}
                                                <div class="substep">
                                                    {#if containsHTML(subStep)}
                                                        <div
                                                            id="substep-instructions"
                                                        >
                                                            {@html subStep.html_instructions}
                                                        </div>
                                                    {/if}
                                                </div>
                                            {/each}
                                        {/if}
                                    </div>
                                </div>
                            {/each}
                            <!-- <div class="end-info">{leg.arrival_time.text}</div> -->
                        </div>
                    {/each}
                </div>
            {/if}
        {/each}
    </div>
</div>

<style>
    #tp-body {
        width: 392px;
        height: 600px;
    }
    .route-info {
        display: flex;
        background-color: #f0f0f0;
        margin-bottom: 20px;
        border-radius: 5px;
        border: 1px solid #ccc;
        /* width: 100%;
        height: 100%; */
    }

    .route-info button {
        background-color: white;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: flex-start;
        text-align: left;
        margin: 0;
    }
    .route-info button img {
        align-self: center; /* Centers the image vertically within the button */
        margin-bottom: 10px; /* Adds spacing between the image and the times */
    }
    #times {
        margin-top: 5px; /* Adds some spacing between the times */
        text-align: right; /* Aligns times to the right */
        width: 100%; /* Ensures the times take up the full width */
        display: block; /* Makes sure each time is on its own line */
    }
    .route-info:hover {
        background-color: gray;
    }

    .userInputBackground {
        background-color: #d9d9d9;
        max-width: 360px;
        padding: 1em;
        width: 100%;
        height: 100%;
        overflow-y: auto;
    }

    .inlineElements {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    /* .routes {
        display: none;
    } */

    .autocomplete-suggestions {
        position: absolute;
        border: 1px solid #ccc;
        background-color: white;
        width: 100%;
        max-width: 300px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 10;
        margin-top: 4px;
    }

    .suggestion {
        width: 100%;
        padding: 8px;
        text-align: left;
        cursor: pointer;
        border: none;
        background: none;
        font-size: 14px;
        display: block;
    }

    .suggestion:hover {
        background-color: #f0f0f0;
    }

    .input-field {
        position: relative;
        margin-bottom: 16px;
    }

    .input-field input[type="text"] {
        width: 100%;
    }

    button:hover {
        background-color: #d3d3d3;
    }

    .route {
        margin: 20px;
    }

    .leg {
        padding: 5px;
    }

    .step {
        border-bottom: 2px dashed gray;
    }

    .substep {
        font-size: 12px;
        border-bottom: 1px dashed gray;
    }
</style>
