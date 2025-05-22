function bettersetup() {
    clearInterval(a);
    setTimeoutOld(() => {
        window.history.back();
        window.history.back()
    }, 200)
    setTimeoutOld(
        () => {
            $('button:contains(Higher)').click();
        }, 7000)
    setTimeoutOld(
        () => {

            box = $('input')[0];
            box.value = 100;
            box.dispatchEvent(
                new Event("input", {
                    bubbles: true,
                    cancelable: true
                })
            );
        }, 7200)

    setTimeoutOld(() => {
        $('button:contains(Begin)').click()
    }, 7500)
    setTimeoutOld(() => {
        a = setInterval(doQuestion, 1200)
    }, 10000)

}

function pause() {
    clearInterval(a);
    clearInterval(automate)
}

function restart() {
    a = setInterval(doQuestion, 1200);
    automation = true
    automate = setInterval(function() {
        if (window.location.href.includes("quiz-result") && automation)
            bettersetup()
    }, 5000)
}
