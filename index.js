const button = document.querySelector("button");
const output = document.getElementById("output");

Agent.onReady(() => {
    button.onclick = async () => {
        try {
            const FSEntry = Agent.Experimental.FileSystem.Entry[`Window-${Agent.displayId}`];
            const date = new Date().toLocaleDateString().split("/").join("-");
            const suggestedName = `analytics-${date}.json`;
            const entry = await FSEntry.chooseEntry({ type: "openDirectory" });
            const analytics = await Agent.Analytics.getEvents();
            const filePath = `${entry.fullPath}/${suggestedName}`;
            const jsonFormatted = JSON.stringify(analytics, null, 2);
            const { buffer } = new TextEncoder().encode(jsonFormatted);
            await FSEntry.createFile(filePath, buffer, "application/json");

            output.innerHTML = `<h1 style="color:green">Success: Saved file to "${filePath}"</h1>`;
        } catch (ex) {
            if (
                ex.toString() === "UnknownAgentError" ||
                ex.toString() === "AgentTimedOutException: Request timed out"
            ) {
                output.innerHTML = `<h1 style="color:yellow">Folder isn't selected. Please try again.<br/>
                                    More details: ${ex.toString()}</h1>`;
            } else {
                output.innerHTML = `<h1 style="color:red">Error: ${ex.toString()}</h1>`;
            }
        }
    };
});
