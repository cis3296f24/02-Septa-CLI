<script>
    import { onMount } from "svelte";

    let warnings = "Loading SEPTA alerts...";

    // Fetch SEPTA alerts for all routes with warnings
    const fetchSEPTAAlerts = async () => {
        const endpoint = `/api/septa_alerts`;

        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`Failed to fetch SEPTA alerts: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Fetched data:', data); // Debugging: Log the entire response

            // Filter alerts to include only those with a valid advisory message
            const alertsWithWarnings = data.filter(alert => alert.advisory && alert.advisory.trim() !== "");

            console.log('Filtered alerts with warnings:', alertsWithWarnings); // Debugging

            // Create the marquee text
            warnings = alertsWithWarnings.length > 0
                ? alertsWithWarnings.map(alert => `${alert.route_name}: ${alert.description}`).join(" • ")
                : "No current alerts for any routes.";
        } catch (error) {
            console.error('Error fetching SEPTA alerts:', error);
            warnings = "Failed to load SEPTA alerts.";
        }
    };

    onMount(() => {
        fetchSEPTAAlerts();
    });
</script>

<div id="marquee">
    <a href="https://www.septa.org/alerts" target="_blank" rel="noopener noreferrer">
        <span>{warnings}</span>
    </a>
</div>

<style>

    #marquee a {
        display: inline-block;
        width: 100%;
        height: 100%;
        color: white; /* Ensures the text color stays white */
        text-decoration: none; /* Removes underline */
    }

    #marquee a:hover {
        color: white; /* Ensures the text stays white when hovered */
    }
    /* Marquee for SEPTA Alerts */
    #marquee {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 30px;
        background-color: #f44336; /* Red background for alerts */
        color: white;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        overflow: hidden;
        white-space: nowrap;
        z-index: 1000; /* Ensure it stays on top of other elements */
    }

    #marquee span {
        display: inline-block;
        animation: scroll 50s linear infinite; /* Adjust speed for better visibility */
    }

    @keyframes scroll {
        from {
            transform: translateX(20%);
        }
        to {
            transform: translateX(-100%);
        }
    }
</style>
