const challenges = [
    {
        id: "percent-save",
        question:
            "You save 20% of $50. How much do you save?",
        options: [
            "$5",
            "$10",
            "$20"
        ],
        correct: 1,
        reward: 12
    },
    {
        id: "budget-balance",
        question:
            "Income is $100 and total spending is $75. What remains?",
        options: [
            "$15",
            "$25",
            "$175"
        ],
        correct: 1,
        reward: 12
    },
    {
        id: "growth-idea",
        question:
            "If money earns positive compound interest and nothing is withdrawn, what generally happens over time?",
        options: [
            "It grows",
            "It must become zero",
            "It always stays exactly the same"
        ],
        correct: 0,
        reward: 12
    }
];


document.getElementById(
    "compound-calc-btn"
).addEventListener(
    "click",
    calculateCompoundGrowth
);


document.getElementById(
    "budget-calc-btn"
).addEventListener(
    "click",
    calculateBudget
);


function calculateCompoundGrowth() {
    const principal =
        numberValue("compound-principal");

    const annualRate =
        numberValue("compound-rate") / 100;

    const years =
        numberValue("compound-years");

    const monthlyContribution =
        numberValue("compound-monthly");

    if (
        principal < 0 ||
        years < 0 ||
        monthlyContribution < 0
    ) {
        setText(
            "compound-result",
            "Use non-negative starting values."
        );

        return;
    }

    const months =
        Math.round(years * 12);

    const monthlyRate =
        annualRate / 12;

    let balance = principal;

    for (
        let month = 0;
        month < months;
        month++
    ) {
        balance *=
            1 + monthlyRate;

        balance += monthlyContribution;
    }

    const contributed =
        principal +
        monthlyContribution * months;

    const growth =
        balance - contributed;

    document.getElementById(
        "compound-result"
    ).innerHTML = `
        <strong>
            Final modeled balance:
            ${money(balance)}
        </strong>
        <br>
        Contributions:
        ${money(contributed)}
        <br>
        Modeled growth:
        ${money(growth)}
    `;
}


function calculateBudget() {
    const income =
        numberValue("budget-income");

    const needs =
        numberValue("budget-needs");

    const wants =
        numberValue("budget-wants");

    const saving =
        numberValue("budget-saving");

    const allocated =
        needs + wants + saving;

    const remaining =
        income - allocated;

    let message;

    if (remaining > 0) {
        message =
            `You have ${money(remaining)} unallocated.`;
    } else if (remaining === 0) {
        message =
            "Balanced exactly: every dollar has a job.";
    } else {
        message =
            `You are over budget by ${money(Math.abs(remaining))}.`;
    }

    const savingRate =
        income > 0
            ? saving / income * 100
            : 0;

    document.getElementById(
        "budget-result"
    ).innerHTML = `
        <strong>${message}</strong>
        <br>
        Saving rate:
        ${savingRate.toFixed(1)}%
    `;
}


function numberValue(id) {
    return Number(
        document.getElementById(id).value
    ) || 0;
}


function money(value) {
    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2
        }
    ).format(value);
}


function setText(id, text) {
    document.getElementById(id)
        .textContent = text;
}


function renderChallenges() {
    const container =
        document.getElementById(
            "finance-challenges"
        );

    container.innerHTML =
        challenges
            .map((challenge, index) => {
                const claimed =
                    window.NumberOnWingsSave
                        .hasReward(
                            `finance:${challenge.id}`
                        );

                return `
                    <div
                        class="finance-card"
                        style="margin-top: 14px;"
                    >

                        <h3>
                            ${index + 1}. ${escapeHtml(challenge.question)}
                        </h3>

                        <div
                            id="challenge-options-${challenge.id}"
                        >
                            ${
                                challenge.options
                                    .map(
                                        (option, optionIndex) => `
                                            <button
                                                class="challenge-option"
                                                data-challenge="${challenge.id}"
                                                data-option="${optionIndex}"
                                            >
                                                ${escapeHtml(option)}
                                            </button>
                                        `
                                    )
                                    .join("")
                            }
                        </div>

                        <div
                            class="small-note"
                            id="challenge-status-${challenge.id}"
                            style="margin-top: 10px;"
                        >
                            ${
                                claimed
                                    ? "Reward already claimed ✓"
                                    : `First solve: +${challenge.reward} 🪙`
                            }
                        </div>

                    </div>
                `;
            })
            .join("");

    container
        .querySelectorAll(
            "[data-challenge]"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    answerChallenge(
                        button.dataset.challenge,
                        Number(
                            button.dataset.option
                        )
                    );
                }
            );
        });
}


function answerChallenge(id, optionIndex) {
    const challenge =
        challenges.find(
            item => item.id === id
        );

    if (!challenge) {
        return;
    }

    const optionContainer =
        document.getElementById(
            `challenge-options-${id}`
        );

    const buttons =
        optionContainer
            .querySelectorAll(
                ".challenge-option"
            );

    buttons.forEach(
        (button, index) => {
            button.classList.remove(
                "correct",
                "wrong"
            );

            if (
                index ===
                challenge.correct
            ) {
                button.classList.add(
                    "correct"
                );
            }
        }
    );

    if (
        optionIndex !==
        challenge.correct
    ) {
        buttons[optionIndex]
            .classList.add("wrong");

        document.getElementById(
            `challenge-status-${id}`
        ).textContent =
            "Not quite — try another option.";

        return;
    }

    const result =
        window.NumberOnWingsSave
            .completeFinanceChallenge(
                id,
                challenge.reward
            );

    document.getElementById(
        `challenge-status-${id}`
    ).textContent =
        result.claimed
            ? `Correct! +${result.earnedCoins} 🪙`
            : "Correct! Reward already claimed ✓";
}


function escapeHtml(value) {
    const element =
        document.createElement("div");

    element.textContent =
        String(value ?? "");

    return element.innerHTML;
}


document.addEventListener(
    "DOMContentLoaded",
    () => {
        renderChallenges();
        calculateCompoundGrowth();
        calculateBudget();
    }
);
