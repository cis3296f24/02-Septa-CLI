<script>
    import TripPlanner from "./TripPlanner.svelte";
    import TimeTable from "./TimeTable.svelte";
    import Map from "./Map.svelte";
    import Marquee from "./Marquee.svelte";

    let latitude, longitude;

    // Function to get the current position
    function getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        resolve(position);
                    },
                    function (error) {
                        reject(error);
                    },
                );
            } else {
                reject(
                    new Error(
                        "Geolocation API is not available in this browser.",
                    ),
                );
            }
        });
    }
</script>

<main class="grid-container">
    <!-- Marquee for Warnings -->
    <Marquee />
    <div class="tabs">
        <ul class="sidebar">
            <li id="Plan-Trip">
                <button on:click={()=>{
                    document.querySelector(".scheduleFetchBackground").style.display = "none";
                    document.querySelector(".trip-planner").style.display = "block";
                }}> Plan Your Trip </button>
            </li>
            <li id="View-TimeTables">
                <button on:click={()=>{
                    document.querySelector(".scheduleFetchBackground").style.display = "block";
                    document.querySelector(".trip-planner").style.display = "none";
                }}> View Time Tables </button>
            </li>
        </ul>
        <!-- Form -->
        <div class="trip-planner">
            <TripPlanner />
        </div>
        <div class="scheduleFetchBackground">
            <TimeTable />
        </div>
    </div>

    <!-- <input type="button" id="fetch-button" value="Fetch Locations" on:click={fetchLocations} /> -->

    <!-- Map -->
    <div class="map-container">
        <Map {latitude} {longitude} />
    </div>

</main>

<style>
    .tabs {
        display: flex;
        position: relative;
        top: 100px;
    }
    .sidebar {
        position: relative;
        width: 120px;
        padding: 0px;
        list-style: none;
        z-index: 2;
        margin: 0;
    }
    .sidebar button {
        width: 100%;
        /* padding: 10px; */
        /* background-color: #4caf50; */
        color: white;
        border: none;
        cursor: pointer;
        font-size: 16px;
    }
    .grid-container {
        /* display: grid;
        grid-template-columns: 2fr 2fr; 
        grid-template-rows: auto auto;  */
        gap: 20px;
        padding: 1em;
        max-width: 1000px;
        width: 100%;
        margin: 0 auto;
    }

    .map-container {
        position: absolute;
        top: 0;
        left: 0;
        /* grid-column: 2; 
        grid-row: 1; */
        /* margin: 25px;  */
        height: 100%;
        width: 100%;
        z-index: 1;
    }
    @keyframes scroll {
        from {
            transform: translateX(0%);
        }
        to {
            transform: translateX(-100%);
        }
    }

    .scheduleFetchBackground {
        /* display: none; */
        position: relative;
        background-color: #d9d9d9;
        padding: 1em;
        /* grid-column: 1 / span 2; 
        grid-row: 2;  */
        width: 25%;
        z-index: 2;
    }

    .trip-planner {
        display: none;
        position: relative;
        width: 25%;
        z-index: 2;
    }

    @media (min-width: 640px) {
        .grid-container {
            max-width: none;
        }
    }
</style>
