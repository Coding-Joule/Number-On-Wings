const nicknameInput =
    document.getElementById(
        "settings-nickname"
    );

const soundInput =
    document.getElementById(
        "sound-setting"
    );

const motionInput =
    document.getElementById(
        "motion-setting"
    );


function renderSettings() {
    const save =
        window.NumberOnWingsSave.load();

    nicknameInput.value =
        save.profile.nickname;

    soundInput.checked =
        save.settings.sound;

    motionInput.checked =
        save.settings.reducedMotion;
}


document.getElementById(
    "save-name-btn"
).addEventListener(
    "click",
    () => {
        window.NumberOnWingsSave
            .setNickname(
                nicknameInput.value
            );

        toast("Profile name saved.");
    }
);


soundInput.addEventListener(
    "change",
    () => {
        window.NumberOnWingsSave
            .setSetting(
                "sound",
                soundInput.checked
            );
    }
);


motionInput.addEventListener(
    "change",
    () => {
        window.NumberOnWingsSave
            .setSetting(
                "reducedMotion",
                motionInput.checked
            );
    }
);


document.getElementById(
    "export-save-btn"
).addEventListener(
    "click",
    () => {
        const json =
            window.NumberOnWingsSave
                .exportSave();

        const blob =
            new Blob(
                [json],
                {
                    type: "application/json"
                }
            );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        const date =
            new Date()
                .toISOString()
                .slice(0, 10);

        link.href = url;
        link.download =
            `numberonwings-save-${date}.json`;

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);

        toast("Backup exported.");
    }
);


document.getElementById(
    "import-save-input"
).addEventListener(
    "change",
    async event => {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        const text =
            await file.text();

        const result =
            window.NumberOnWingsSave
                .importSave(text);

        if (!result.ok) {
            toast(
                "That does not look like a valid NumberOnWings backup."
            );

            event.target.value = "";
            return;
        }

        renderSettings();

        toast(
            "Progress imported successfully."
        );

        event.target.value = "";
    }
);


document.getElementById(
    "reset-save-btn"
).addEventListener(
    "click",
    () => {
        const confirmed =
            window.confirm(
                "Reset ALL local NumberOnWings progress on this browser? This cannot be undone unless you exported a backup."
            );

        if (!confirmed) {
            return;
        }

        window.NumberOnWingsSave.reset();

        renderSettings();

        toast("Local progress reset.");
    }
);


function toast(message) {
    const old =
        document.querySelector(
            ".now-toast"
        );

    if (old) {
        old.remove();
    }

    const element =
        document.createElement("div");

    element.className = "now-toast";
    element.textContent = message;

    document.body.appendChild(element);

    setTimeout(() => {
        element.remove();
    }, 2400);
}


document.addEventListener(
    "DOMContentLoaded",
    renderSettings
);

window.addEventListener(
    "now:save-changed",
    renderSettings
);
