$(function () {
    $("#navbarToggle").blur(function (event) {
        var screenWidth = window.innerWidth;
        if (screenWidth < 768) {
            $("#collapsable-nav").collapse('hide');
        }
    });

    $("#navbarToggle").click(function (event) {
        $(event.target).focus();
    });
});


$("#animate-button").click(function () {

    var btn1 = document.getElementById("animate-button");
    btn1.disabled = true;
    var b = document.forms["myForm"]["bitstream-input"].value;
    var i = document.forms["myForm"]["initial-input"].value;
    if (b == "") {
        alert("Enter the Sequence of Request queue!");
        return false;
    }
    if (b != "" && i == "") {
        alert("Enter the value of Initial Cylinder!");
        return false;
    }

    var ini = parseInt(document.getElementById('initial-input').value);
    var final = parseInt(document.getElementById('final-input').value);
    var str = document.getElementById('bitstream-input').value;
    var dir = document.getElementById('direction').value;

    var inp = [], r2 = str.split(" "), r3;
    for (a1 = 0; a1 < r2.length; ++a1) {
        if (r2[a1] == "") { continue; }
        r3 = parseInt(r2[a1]);
        inp.push(r3);

        if ((r3 > parseInt(final)) || (parseInt(ini) > parseInt(final))) {
            alert("Invalid Input: Final cylinder has to be Greater!");
            return;
        }
    }

    final = parseInt(final);
    ini = parseInt(ini);

    if ($('div.left').hasClass('transform') && window.matchMedia("(min-width: 1249px)").matches) {
        $('.left').css("width", "30%");
        $('.left').css("margin", "30px");
        $('#plot-button').css("margin-left", "30px");
        $('#plot-button').css("margin-bottom", "5%");
        $('#animate-button').css("margin-bottom", "5%");
        $('#cmpr-button').css("margin-left", "25%");
        $('.container2').css("top", "800px");
        $('.container3').css("top", "1500px");



        setTimeout(function () {
            document.getElementById("canvas").style.visibility = "visible";
            myalgorithm(document.getElementById('algorithm').value, inp, ini, final, dir);
        }, 500);

    }

    else if (window.matchMedia("(min-width: 992px)").matches) {
        document.getElementById("canvas").style.visibility = "visible";
        myalgorithm(document.getElementById('algorithm').value, inp, ini, final, dir);
        $('.container2').css("top", "1250px");
    }

    else if (window.matchMedia("(min-width: 768px").matches) {
        document.getElementById("canvas").style.visibility = "visible";
        myalgorithm(document.getElementById('algorithm').value, inp, ini, final, dir);
        $('.container2').css("top", "1500px");
    }

    else if (window.matchMedia("(min-width: 600px").matches) {
        document.getElementById("canvas").style.visibility = "visible";
        myalgorithm(document.getElementById('algorithm').value, inp, ini, final, dir);
        $('.container2').css("top", "1450px");

    }
    else {
        document.getElementById("canvas").style.visibility = "visible";
        myalgorithm(document.getElementById('algorithm').value, inp, ini, final, dir);
        $('.container2').css("top", "1350px");
    }
});




/**** ANIMATION ****/


function myalgorithm(alg, inp, ini, final, dir) {

    if (alg == "fcfs") {
        var op = fcfs(inp, ini, final);
        var target = op[0];
        var seek = op[1];

        animation(target[0].x);

        document.getElementById("am_alg_name").innerHTML = "FCFS";
        document.getElementById("am_alg_seek").innerHTML = "Total Seek Time: " + seek;

    }

    if (alg == "sstf") {
        var op = sstf(inp, ini, final);
        var target = op[0];
        var seek = op[1];
        animation(target[0].x);
        document.getElementById("am_alg_name").innerHTML = "SSTF";
        document.getElementById("am_alg_seek").innerHTML = "Total Seek Time: " + seek;
    }

    if (alg == "scan") {
        var f = document.forms["myForm"]["final-input"].value;

        if (f == "") {
            alert("Enter the value of Final Cylinder");
            return false;
        }

        var op = scan(inp, ini, final, dir);
        var target = op[0];
        var seek = op[1];
        console.log(seek);
        animation(target[0].x);
        document.getElementById("am_alg_name").innerHTML = "SCAN";
        document.getElementById("am_alg_seek").innerHTML = "Total Seek Time: " + seek;
    }

    if (alg == "c-scan") {
        var f = document.forms["myForm"]["final-input"].value;

        if (f == "") {
            alert("Enter the value of Final Cylinder");
            return false;
        }

        var op = cscan(inp, ini, final, dir);
        var target = op[0];
        var seek = op[1];
        var seq = [...target[0].x, ...target[1].x, ...target[2].x];
        animation(seq);
        document.getElementById("am_alg_name").innerHTML = "C-SCAN";
        document.getElementById("am_alg_seek").innerHTML = "Total Seek Time: " + seek;
    }

    if (alg == "look") {
        var op = look(inp, ini, final, dir);
        var target = op[0];
        var seek = op[1];
        animation(target[0].x);
        document.getElementById("am_alg_name").innerHTML = "LOOK";
        document.getElementById("am_alg_seek").innerHTML = "Total Seek Time: " + seek;
    }

    if (alg == "c-look") {
        var op = clook(inp, ini, final, dir);
        var target = op[0];
        var seek = op[1];
        var seq = [...target[0].x, ...target[1].x, ...target[2].x];
        animation(seq);
        document.getElementById("am_alg_name").innerHTML = "C-LOOK";
        document.getElementById("am_alg_seek").innerHTML = "Total Seek Time: " + seek;
    }

}

function animation(values) {
    // Get canvas and context
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Center coords, constants
    const cx = 350;
    const cy = 320;
    const PI2 = Math.PI * 2;

    // Circle data
    let radius = 0;
    let totRadius = 0;
    const circles = [];

    // Seek‑time display
    let sik = "Seek-Time: ";
    let request;
    let targetIndex = 1;

    // Algorithm input array
    const target = values;
    const max = Math.max(...target);
    if (max > 30) {
        alert("Please enter values between 1 and 30 to visualize animation!");
        return;
    }

    // Disable animate button during run
    document.getElementById("animate-button").disabled = true;

    // Build concentric rings: one thick black, then 30 thin grey
    addCircle(20, "black");
    for (let i = 0; i < 30; i++) {
        addCircle(10, "#A79C9D");
    }

    // --- Helper: add one ring ---
    function addCircle(lineWidth, color) {
        if (radius === 0) {
            radius = lineWidth / 2;
        } else {
            radius += lineWidth;
        }
        totRadius = radius + lineWidth / 2;
        circles.push({ radius, width: lineWidth, color });
    }

    // --- Helper: draw one ring outline ---
    function drawCircle(circle, strokeColor) {
        ctx.beginPath();
        ctx.arc(cx, cy, circle.radius, 0, PI2);
        ctx.closePath();
        ctx.lineWidth = circle.width;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
    }

    // --- Helper: draw an arrow from (fromx,fromy) to (tox,toy) ---
    function canvas_arrow(context, fromx, fromy, tox, toy) {
        const headlen = 5;
        const dx = tox - fromx;
        const dy = toy - fromy;
        const angle = Math.atan2(dy, dx);

        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
        context.lineTo(
            tox - headlen * Math.cos(angle - Math.PI / 6),
            toy - headlen * Math.sin(angle - Math.PI / 6)
        );
        context.moveTo(tox, toy);
        context.lineTo(
            tox - headlen * Math.cos(angle + Math.PI / 6),
            toy - headlen * Math.sin(angle + Math.PI / 6)
        );
    }

    // --- Helper: speak text out loud ---
    function speak(text) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.rate = 1.0;
        msg.pitch = 1.0;
        msg.lang = "en-US";
        window.speechSynthesis.speak(msg);
    }

    // --- Core: one animation step ---
    function animateStep() {
        // Stop when done
        if (targetIndex >= target.length) {
            cancelAnimationFrame(request);
            document.getElementById("animate-button").disabled = false;
            speak("Disk scheduling animation completed.");
            return;
        }

        // From and to positions
        const from = target[targetIndex - 1];
        const to = target[targetIndex];

        // Announce movement
        speak(`Moving from ${from} to ${to}.`);

        // Delay before drawing next step
        setTimeout(() => {
            // Schedule next frame
            request = requestAnimationFrame(animateStep);

            // Update seek‐time text
            sik += `|${to}-${from}|`;
            document.getElementById("cl-seek").innerHTML = sik;
            sik += " + ";

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw base rings
            circles.forEach(c => drawCircle(c, c.color));

            // Highlight current target ring
            const curr = circles[to];
            const prev = circles[from];

            // White highlight
            drawCircle(curr, "white");

            // Draw labels
            ctx.font = "16px Arial";
            ctx.textAlign = "center";

            // Current index label (dark blue)
            ctx.fillStyle = "darkblue";
            ctx.fillText(to, cx + curr.radius, cy);

            // Previous index label (black), offset upward
            ctx.fillStyle = "black";
            ctx.fillText(from, cx + prev.radius, cy - 20);

            // Draw arrow between prev → curr
            ctx.beginPath();
            canvas_arrow(
                ctx,
                cx + prev.radius, cy + 10,
                cx + curr.radius, cy + 10
            );
            ctx.strokeStyle = "red";
            ctx.lineWidth = 3;
            ctx.stroke();

            // Draw outer boundary
            ctx.beginPath();
            ctx.arc(cx, cy, totRadius, 0, PI2);
            ctx.lineWidth = 5;
            ctx.strokeStyle = "black";
            ctx.stroke();

            // Advance index
            targetIndex++;
        }, 2000);
    }

    // Start the animation
    animateStep();
}



// } // END OF ANIMATION()
















/***** GRAPH *****/

var pre, v1, v2, v3, v4, v5, v6;

function fcfs(inp, ini, final) {
    var x1 = [];
    var y1 = [];
    var seek = 0;
    var headMovements = 0;

    x1.push(ini);
    y1.push(0);

    for (var a1 = 1; a1 <= inp.length; ++a1) {
        x1.push(inp[a1 - 1]);
        y1.push(-1 * a1);

        if (a1 == 1) {
            seek += Math.abs(ini - inp[a1 - 1]);
        } else {
            seek += Math.abs(inp[a1 - 2] - inp[a1 - 1]);
        }

        headMovements++;
    }

    var trace1 = {
        x: x1,
        y: y1,
        type: 'scatter'
    };

    var data = [trace1];

    // Performance Metrics
    let avgSeekTime = inp.length > 0 ? seek / inp.length : 0;
    let latency = avgSeekTime / 2;

    var performanceMetrics = {
        algorithm: "FCFS",
        seekTime: seek,
        avgSeekTime: avgSeekTime,
        latency: latency,
        headMovements: headMovements
    };

    // Store Metrics in Local Storage
    var existingMetrics = JSON.parse(localStorage.getItem("performanceMetrics")) || [];
    existingMetrics.push(performanceMetrics);
    localStorage.setItem("performanceMetrics", JSON.stringify(existingMetrics));

    return [data, seek];
}

function sstf(inp, ini, final) {
    var x1 = [];
    var y1 = [];
    var seek = 0;
    var visited = [];
    var a1, a2;

    for (a1 = 0; a1 < inp.length; ++a1) {
        visited[a1] = 0;
    }

    x1.push(ini);
    y1.push(0);
    var hold = ini;

    for (a1 = 1; a1 <= inp.length; ++a1) {
        var mn = 10000;
        var idx;
        for (a2 = 0; a2 < inp.length; ++a2) {
            if (visited[a2] == 0) {
                if (Math.abs(hold - inp[a2]) < mn) {
                    idx = a2;
                    mn = Math.abs(hold - inp[a2]);
                }
            }
        }
        seek += Math.abs(hold - inp[idx]);
        visited[idx] = 1;
        hold = inp[idx];
        x1.push(inp[idx]);
        y1.push(-1 * a1);
    }

    var trace1 = {
        x: x1,
        y: y1,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'SSTF Path'
    };

    var data = [trace1];

    // Performance Metrics
    var totalSeekTime = seek;
    var averageSeekTime = (inp.length > 0) ? (seek / inp.length) : 0;
    var latency = (inp.length > 0) ? (seek / inp.length) : 0; // Assuming seek time per request
    var headMovements = x1.length - 1; // Number of cylinder movements

    var performanceMetrics = {
        algorithm: "SSTF",
        seekTime: totalSeekTime,
        avgSeekTime: averageSeekTime,
        latency: latency,
        headMovements: headMovements
    };

    //  Store Metrics in Local Storage for Display
    var existingMetrics = JSON.parse(localStorage.getItem("performanceMetrics")) || [];
    existingMetrics.push(performanceMetrics);
    localStorage.setItem("performanceMetrics", JSON.stringify(existingMetrics));

    return [data, seek];
}


function scan(inp, ini, final, dir) {
    var x1 = [];
    var y1 = [];
    var seek = 0;
    var visited = [];
    var a1;

    for (a1 = 0; a1 < inp.length; ++a1) {
        visited[a1] = 0;
    }

    x1.push(ini);
    y1.push(0);
    inp.sort(function (a, b) { return a - b });

    if ((ini < inp[0]) || (ini > inp[inp.length - 1])) {
        var scan_use = sstf(inp, ini, final);
        var data = scan_use[0];
        var seek = scan_use[1];
        return [data, seek];
    }

    var hold = ini;
    var count = 1;

    if (dir == "left") {
        var store, hold = ini;
        for (a1 = 0; a1 < inp.length; ++a1) {
            if (inp[a1] <= ini) store = a1;
        }

        for (a1 = store; a1 >= 0; --a1) {
            x1.push(inp[a1]);
            y1.push(-1 * count);
            ++count;
            seek += Math.abs(hold - inp[a1]);
            hold = inp[a1];
        }
        if (!inp.includes(0)) {
            x1.push(0);
            y1.push(-1 * count);
            seek += hold;
            hold = 0;
            ++count;
        }

        for (a1 = store + 1; a1 < inp.length; ++a1) {
            x1.push(inp[a1]);
            y1.push(-1 * count);
            ++count;
            seek += Math.abs(hold - inp[a1]);
            hold = inp[a1];
        }
    } else {
        var store;
        for (a1 = 0; a1 < inp.length; ++a1) {
            if (inp[a1] >= ini) {
                store = a1;
                break;
            }
        }

        for (a1 = store; a1 < inp.length; ++a1) {
            x1.push(inp[a1]);
            y1.push(-1 * count);
            ++count;
            seek += Math.abs(hold - inp[a1]);
            hold = inp[a1];
        }
        if (!inp.includes(final)) {
            x1.push(final);
            y1.push(-1 * count);
            seek += final - hold;
            hold = final;
            ++count;
        }
        for (a1 = store - 1; a1 >= 0; --a1) {
            x1.push(inp[a1]);
            y1.push(-1 * count);
            ++count;
            seek += Math.abs(hold - inp[a1]);
            hold = inp[a1];
        }
    }

    var trace1 = {
        x: x1,
        y: y1,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'SCAN Path'
    };

    var data = [trace1];

    //  Performance Metrics
    var totalSeekTime = seek;
    var averageSeekTime = (inp.length > 0) ? (seek / inp.length) : 0;
    var latency = (inp.length > 0) ? (seek / inp.length) : 0;
    var headMovements = x1.length - 1;

    var performanceMetrics = {
        algorithm: "SCAN",
        seekTime: totalSeekTime,
        avgSeekTime: averageSeekTime,
        latency: latency,
        headMovements: headMovements
    };

    //  Store Metrics in Local Storage for Display
    var existingMetrics = JSON.parse(localStorage.getItem("performanceMetrics")) || [];
    existingMetrics.push(performanceMetrics);
    localStorage.setItem("performanceMetrics", JSON.stringify(existingMetrics));

    return [data, seek];
}


function cscan(inp, ini, final, dir) {
    var x1 = [], y1 = [], x2 = [], y2 = [], x3 = [], y3 = [];
    var seek = 0;
    var visited = [];
    var headMovements = 0;
    var a1;

    for (a1 = 0; a1 < inp.length; ++a1) {
        visited[a1] = 0;
    }

    x1.push(ini);
    y1.push(0);
    inp.sort((a, b) => a - b);

    if ((ini < inp[0]) || (ini > inp[inp.length - 1])) {
        var cscan_use = sstf(inp, ini, final);
        var data = cscan_use[0];
        seek = cscan_use[1];
        seek = v2;
        v4 = seek;
        return [data, seek];
    }

    let hold = ini;

    if (dir === "left") {
        let store;
        for (a1 = 0; a1 < inp.length; ++a1) {
            if (inp[a1] <= ini) store = a1;
        }

        let count = 1;
        for (a1 = store; a1 >= 0; --a1) {
            x1.push(inp[a1]);
            y1.push(-1 * count);
            seek += Math.abs(hold - inp[a1]);
            headMovements++;
            hold = inp[a1];
            count++;
        }

        x1.push(0);
        y1.push(-1 * count);
        seek += hold;
        headMovements++;

        hold = final;
        x2.push(0);
        y2.push(-1 * count);
        x2.push(final);
        y2.push(-1 * count);
        seek += final;
        headMovements++;

        x3.push(final);
        y3.push(-1 * count);
        count++;

        for (a1 = inp.length - 1; a1 > store; --a1) {
            x3.push(inp[a1]);
            y3.push(-1 * count);
            seek += Math.abs(hold - inp[a1]);
            headMovements++;
            hold = inp[a1];
            count++;
        }
    } else {
        let store;
        for (a1 = 0; a1 < inp.length; ++a1) {
            if (inp[a1] >= ini) {
                store = a1;
                break;
            }
        }

        let count = 1;
        for (a1 = store; a1 < inp.length; ++a1) {
            x1.push(inp[a1]);
            y1.push(-1 * count);
            seek += Math.abs(hold - inp[a1]);
            headMovements++;
            hold = inp[a1];
            count++;
        }

        x1.push(final);
        y1.push(-1 * count);
        seek += final - hold;
        headMovements++;

        hold = 0;
        x2.push(final);
        y2.push(-1 * count);
        x2.push(0);
        y2.push(-1 * count);
        seek += final;
        headMovements++;

        x3.push(0);
        y3.push(-1 * count);
        count++;

        for (a1 = 0; a1 < store; ++a1) {
            x3.push(inp[a1]);
            y3.push(-1 * count);
            seek += Math.abs(hold - inp[a1]);
            headMovements++;
            hold = inp[a1];
            count++;
        }
    }

    var trace1 = { x: x1, y: y1, type: 'scatter', name: '' };
    var trace2 = { x: x2, y: y2, mode: 'lines', name: '', line: { dash: 'dashdot', width: 4 } };
    var trace3 = { x: x3, y: y3, type: 'scatter', name: '' };

    v4 = seek;
    var data = [trace1, trace2, trace3];

    // var max1 = Math.max(...trace1.x);
    // var max2 = Math.max(...trace2.x);
    // var max3 = Math.max(...trace3.x);
    // var min1 = Math.min(...trace1.x);
    // var min2 = Math.min(...trace2.x);
    // var min3 = Math.min(...trace3.x);

    // seek = max1 + max2 + max3 - min1 - min2 - min3;

    //  Update performance metrics
    let avgSeekTime = seek / inp.length;
    let latency = avgSeekTime / 2;

    let performanceData = JSON.parse(localStorage.getItem("performanceMetrics")) || [];

    performanceData.push({
        algorithm: "C-SCAN",
        seekTime: seek,
        avgSeekTime: avgSeekTime,
        latency: latency,
        headMovements: headMovements
    });

    localStorage.setItem("performanceMetrics", JSON.stringify(performanceData));

    return [data, seek];
}




function look(inp, ini, final, dir) {
    var x1 = [];
    var y1 = [];
    var seek = 0;
    var visited = [];
    var a1, a2;

    for (a1 = 0; a1 < inp.length; ++a1) {
        visited[a1] = 0;
    }

    x1.push(ini);
    y1.push(0);
    inp.sort(function (a, b) { return a - b });

    if ((ini < inp[0]) || (ini > inp[inp.length - 1])) {
        var look_use = sstf(inp, ini, final);
        var data = look_use[0];
        var seek = look_use[1];
        v5 = seek;
        return [data, seek];
    }

    if (dir == "left") {
        var store, hold = ini;
        for (a1 = 0; a1 < inp.length; ++a1) {
            if (inp[a1] <= ini) { store = a1; }
        }
        var count = 1;
        for (a1 = store; a1 >= 0; --a1) {
            x1.push(inp[a1]);
            y1.push(-1 * count);
            ++count;
            seek += Math.abs(hold - inp[a1]);
            hold = inp[a1];
        }

        for (a1 = store + 1; a1 < inp.length; ++a1) {
            x1.push(inp[a1]);
            y1.push(-1 * count);
            ++count;
            seek += Math.abs(hold - inp[a1]);
            hold = inp[a1];
        }
    } else {
        var store, hold = ini;
        for (a1 = 0; a1 < inp.length; ++a1) {
            if (inp[a1] >= ini) { store = a1; break; }
        }
        var count = 1;
        for (a1 = store; a1 < inp.length; ++a1) {
            x1.push(inp[a1]);
            y1.push(-1 * count);
            ++count;
            seek += Math.abs(hold - inp[a1]);
            hold = inp[a1];
        }

        for (a1 = store - 1; a1 >= 0; --a1) {
            x1.push(inp[a1]);
            y1.push(-1 * count);
            ++count;
            seek += Math.abs(hold - inp[a1]);
            hold = inp[a1];
        }
    }

    var trace1 = {
        x: x1,
        y: y1,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'LOOK Path'
    };

    var data = [trace1];

    //  Performance Metrics
    var totalSeekTime = seek;
    var averageSeekTime = (inp.length > 0) ? (seek / inp.length) : 0;
    var latency = (inp.length > 0) ? (seek / inp.length) : 0;
    var headMovements = x1.length - 1;

    var performanceMetrics = {
        algorithm: "LOOK",
        seekTime: totalSeekTime,
        avgSeekTime: averageSeekTime,
        latency: latency,
        headMovements: headMovements
    };

    //  Store Metrics in Local Storage for Display
    var existingMetrics = JSON.parse(localStorage.getItem("performanceMetrics")) || [];
    existingMetrics.push(performanceMetrics);
    localStorage.setItem("performanceMetrics", JSON.stringify(existingMetrics));

    v5 = seek;
    return [data, seek];
}


function clook(inp, ini, final, dir) {
    var x1 = [], y1 = [], x2 = [], y2 = [], x3 = [], y3 = [];
    var seek = 0;
    var visited = [];
    var headMovements = 0;
    var a1, a2;

    for (a1 = 0; a1 < inp.length; ++a1) {
        visited[a1] = 0;
    }

    x1.push(ini);
    y1.push(0);
    inp.sort(function (a, b) { return a - b });

    if ((ini < inp[0]) || (ini > inp[inp.length - 1])) {
        var clook_use = sstf(inp, ini, final);
        var data = clook_use[0];
        var seek = clook_use[1];
        seek = v2;
        v6 = seek;
        return [data, seek];
    }

    if (dir == "left") {
        var store, hold = ini;
        for (a1 = 0; a1 < inp.length; ++a1) {
            if (inp[a1] <= ini) { store = a1; }
        }
        var count = 1;
        for (a1 = store; a1 >= 0; --a1) {
            x1.push(inp[a1]);
            y1.push(-1 * count);
            ++count;
            seek += Math.abs(hold - inp[a1]);
            headMovements++;
            hold = inp[a1];
        }

        // Jump to rightmost end
        x2.push(hold);
        y2.push(-1 * (count - 1));
        x2.push(inp[inp.length - 1]);
        y2.push(-1 * (count - 1));
        x3.push(inp[inp.length - 1]);
        y3.push(-1 * (count - 1));

        seek += Math.abs(hold - inp[inp.length - 1]);  // Jump distance
        headMovements++; // Jump is one movement
        hold = inp[inp.length - 1];

        for (a1 = inp.length - 2; a1 > store; --a1) {
            x3.push(inp[a1]);
            y3.push(-1 * count);
            ++count;
            seek += Math.abs(hold - inp[a1]);
            headMovements++;
            hold = inp[a1];
        }

    } else {
        var store, hold = ini;
        for (a1 = 0; a1 < inp.length; ++a1) {
            if (inp[a1] >= ini) { store = a1; break; }
        }
        var count = 1;
        for (a1 = store; a1 < inp.length; ++a1) {
            x1.push(inp[a1]);
            y1.push(-1 * count);
            ++count;
            seek += Math.abs(hold - inp[a1]);
            headMovements++;
            hold = inp[a1];
        }

        // Jump to leftmost end
        x2.push(hold);
        y2.push(-1 * (count - 1));
        x2.push(inp[0]);
        y2.push(-1 * (count - 1));
        x3.push(inp[0]);
        y3.push(-1 * (count - 1));

        seek += Math.abs(hold - inp[0]);  // Jump distance
        headMovements++; // Jump is one movement
        hold = inp[0];

        for (a1 = 1; a1 < store; ++a1) {
            x3.push(inp[a1]);
            y3.push(-1 * count);
            ++count;
            seek += Math.abs(hold - inp[a1]);
            headMovements++;
            hold = inp[a1];
        }
    }

    var trace1 = {
        x: x1,
        y: y1,
        type: 'scatter',
        name: ''
    };
    var trace2 = {
        x: x2,
        y: y2,
        mode: 'lines',
        name: '',
        line: {
            dash: 'dashdot',
            width: 4
        }
    };
    var trace3 = {
        x: x3,
        y: y3,
        type: 'scatter',
        name: ''
    };

    var data = [trace1, trace2, trace3];
    v6 = seek;

    var max1 = Math.max(...trace1.x);
    var max2 = Math.max(...trace2.x);
    var max3 = Math.max(...trace3.x);

    var min1 = Math.min(...trace1.x);
    var min2 = Math.min(...trace2.x);
    var min3 = Math.min(...trace3.x);

    seek = max1 + max2 + max3 - min1 - min2 - min3;

    //  Performance Metrics
    let avgSeekTime = seek / inp.length;
    let latency = avgSeekTime / 2;

    let performanceData = JSON.parse(localStorage.getItem("performanceMetrics")) || [];

    performanceData.push({
        algorithm: "C-LOOK",
        seekTime: seek,
        avgSeekTime: avgSeekTime,
        latency: latency,
        headMovements: headMovements
    });

    localStorage.setItem("performanceMetrics", JSON.stringify(performanceData));

    return [data, seek];
}

function parseFormInput() {
    var bitstream = document.forms["myForm"]["bitstream-input"].value.trim();
    var ini = document.forms["myForm"]["initial-input"].value;
    var final = document.forms["myForm"]["final-input"].value;
    var direction = document.forms["myForm"]["direction"].value;

    if (bitstream === "") {
        alert("Enter the Sequence of Request queue!");
        return null;
    }
    if (ini === "") {
        alert("Enter the value of Initial Cylinder!");
        return null;
    }
    if (final === "") {
        alert("Enter the value of Final Cylinder!");
        return null;
    }

    ini = parseInt(ini);
    final = parseInt(final);

    var inp = bitstream.split(" ").map(Number).filter(n => !isNaN(n));
    for (let num of inp) {
        if (num > final || ini > final) {
            alert("Invalid Input: Final cylinder has to be greater!");
            return null;
        }
    }

    return { inp, ini, final, direction };
}


async function getBitStreamAndPlot(event, r1, ini, final, alg, side) {
    var b = document.forms["myForm"]["bitstream-input"].value;
    var i = document.forms["myForm"]["initial-input"].value;
    if (b == "") {
        alert("Enter the Sequence of Request queue!");
        return false;
    }
    if (b != "" && i == "") {
        alert("Enter the value of Initial Cylinder!");
        return false;
    }

    var inp = [], r2 = r1.split(" "), r3;
    for (a1 = 0; a1 < r2.length; ++a1) {
        if (r2[a1] == "") { continue; }
        r3 = parseInt(r2[a1]);
        inp.push(r3);

        if ((r3 > parseInt(final)) || (parseInt(ini) > parseInt(final))) {
            alert("Invalid Input: Final cylinder has to be Greater!");
            return;
        }
    }
    var inputs = parseFormInput();
    if (!inputs) return;

    var inp = inputs.inp;
    var ini = inputs.ini;
    var final = inputs.final;
    var dir = inputs.direction;


    final = parseInt(final);
    ini = parseInt(ini);
    dir = side;
    pre = 1;

    if (alg == "fcfs") {
        var alg_use = fcfs(inp, ini, final);
        var plt_alg = "FCFS";
    }
    if (alg == "sstf") {
        var alg_use = sstf(inp, ini, final);
        var plt_alg = "SSTF";

    }
    if (alg == "scan") {
        var f = document.forms["myForm"]["final-input"].value;

        if (f == "") {
            alert("Enter the value of Final Cylinder");
            return false;
        }

        var alg_use = scan(inp, ini, final, dir);
        var plt_alg = "SCAN";

    }
    if (alg == "c-scan") {
        var alg_use = cscan(inp, ini, final, dir);
        var plt_alg = "C-SCAN";

        var f = document.forms["myForm"]["final-input"].value;

        if (f == "") {
            alert("Enter the value of Final Cylinder");
            return false;
        }

    }
    if (alg == "look") {
        var alg_use = look(inp, ini, final, dir);
        var plt_alg = "LOOK";
    }
    if (alg == "c-look") {
        var alg_use = clook(inp, ini, final, dir);
        var plt_alg = "C-LOOK";
    }


    var data = alg_use[0];
    var seek = alg_use[1];

    var layout = {
        xaxis: {
            autorange: true,
            showgrid: true,
            zeroline: false,
            showline: true,
            autotick: true,
            ticks: '',
            showticklabels: true,
            title: 'Cylinder Number'
        },
        yaxis: {
            autorange: true,
            showgrid: false,
            zeroline: false,
            showline: false,
            autotick: true,
            ticks: '',
            showticklabels: false,
        }
    };

    if (pre) {
        Plotly.newPlot('graph_area', data, layout);
        var val = data[0].x;
        var tot_seek = "Seek-Time ";

        // Plot and export to image
        await Plotly.newPlot('graph_area', data, layout);
        const graphDiv = document.getElementById('graph_area');

        // Convert chart to image
        const chartImage = await Plotly.toImage(graphDiv, {
            format: 'png',
            width: 800,
            height: 400
        });
        window.plotGraphImage = chartImage;
        document.getElementById("plt_alg_name").innerHTML = plt_alg;
        document.getElementById("cal-seek").innerHTML = tot_seek + " = " + seek;
        document.getElementById("graph_area").style.visibility = "visible";
    }

}



function savePerformanceMetrics(algorithm, seekTime, avgSeekTime, latency, headMovements) {
    let data = JSON.parse(localStorage.getItem("performanceMetrics")) || [];

    data.push({
        algorithm,
        seekTime,
        avgSeekTime,
        latency,
        headMovements
    });

    localStorage.setItem("performanceMetrics", JSON.stringify(data));

    // Open performance.html in a new tab
    // window.open("performance.html", "_blank");
    window.open(`performance.html?alg=${algorithm}`, '_blank');
}

async function cmprPlot(event, r1, ini, final, alg, side) {

    document.getElementById("cmpr-head").innerHTML = "Comparison-Chart";

    var b = document.forms["myForm"]["bitstream-input"].value;
    var i = document.forms["myForm"]["initial-input"].value;
    if (b == "") {
        alert("Enter the Sequence of Request queue!");
        return false;
    }
    if (b != "" && i == "") {
        alert("Enter the value of Initial Cylinder!");
        return false;
    }

    var ini = parseInt(document.getElementById('initial-input').value);
    var final = parseInt(document.getElementById('final-input').value);
    var str = document.getElementById('bitstream-input').value;
    var dir = document.getElementById('direction').value;

    var inp = [], r2 = str.split(" "), r3;
    for (a1 = 0; a1 < r2.length; ++a1) {
        if (r2[a1] == "") { continue; }
        r3 = parseInt(r2[a1]);
        inp.push(r3);

        if ((r3 > parseInt(final)) || (parseInt(ini) > parseInt(final))) {
            alert("Invalid Input: Final cylinder has to be Greater!");
            return;
        }
    }

    final = parseInt(final);
    ini = parseInt(ini);

    var op1 = fcfs(inp, ini, final);
    var seek1 = op1[1];

    var op2 = sstf(inp, ini, final);
    var seek2 = op2[1];

    var op3 = scan(inp, ini, final, dir);
    var seek3 = op3[1];

    var op4 = cscan(inp, ini, final, dir);
    var seek4 = op4[1];

    var op5 = look(inp, ini, final, dir);
    var seek5 = op5[1];

    var op6 = clook(inp, ini, final, dir);
    var seek6 = op6[1];

    var data = [
        {
            x: ['FCFS', 'SSTF', 'SCAN', 'C-SCAN', 'LOOK', 'C-LOOK'],
            y: [seek1, seek2, seek3, seek4, seek5, seek6],
            type: 'bar'
        }
    ];
    // Plot the comparison chart and store image in window.plotComparisonImage
    const chartDiv = document.getElementById('cmpr_area');

    // Await the plot rendering
    await Plotly.newPlot(chartDiv, data);

    // Convert chart to image
    const comparisonImage = await Plotly.toImage(chartDiv, {
        format: 'png',
        width: 700,
        height: 400
    });

    // Save to global window variable for PDF export
    window.plotComparisonImage = comparisonImage;

    // Show the chart on screen
    document.getElementById("cmpr_area").style.visibility = "visible";

}

async function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;

    // Title
    doc.setFontSize(16);
    doc.text("Disk Scheduling Algorithm Result", 15, y); y += 10;

    // Timestamp
    const timestamp = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(`Generated on: ${timestamp}`, 140, 10);

    // Inputs
    const sequence = document.getElementById("bitstream-input").value;
    const initialHead = document.getElementById("initial-input").value;
    const finalHead = document.getElementById("final-input").value;
    const algorithm = document.getElementById("algorithm").value;

    doc.setFontSize(12);
    doc.text(`Selected Algorithm: ${algorithm}`, 10, y); y += 10;
    doc.text(`Disk Sequence:`, 10, y); y += 7;
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(sequence, 180), 10, y); y += 12;
    doc.setFontSize(12);
    doc.text(`Initial Head Position: ${initialHead}`, 10, y); y += 10;
    doc.text(`Final Head Position: ${finalHead}`, 10, y); y += 10;

    // Performance Metrics
    const data = JSON.parse(localStorage.getItem("performanceMetrics")) || [];
    if (data.length === 0) {
        doc.text("No performance data available.", 10, y); y += 10;
    } else {
        doc.setFontSize(13);
        doc.text("Performance Metrics", 10, y); y += 8;

        doc.setFontSize(11);
        doc.text("Algorithm", 10, y);
        doc.text("Seek Time", 55, y);
        doc.text("Avg Seek", 95, y);
        doc.text("Latency", 130, y);
        doc.text("Head Moves", 165, y);
        y += 7;

        data.forEach((entry) => {
            doc.text(entry.algorithm, 10, y);
            doc.text(entry.seekTime.toString(), 55, y);
            doc.text(entry.avgSeekTime.toFixed(2), 95, y);
            doc.text(entry.latency.toFixed(2), 130, y);
            doc.text(entry.headMovements.toString(), 165, y);
            y += 7;
        });
    }

    // Add Plotly Graph Image
    if (window.plotGraphImage) {
        doc.text("Disk Scheduling Graph:", 14, y); y += 5;
        doc.addImage(window.plotGraphImage, 'PNG', 15, y, 180, 90); y += 95;
    }

    // Add Comparison Chart Image
    if (window.plotComparisonImage) {
        doc.text("Performance Comparison Chart:", 14, y); y += 5;
        doc.addImage(window.plotComparisonImage, 'PNG', 15, y, 180, 90); y += 95;
    }

    // Save
    doc.save("Disk_Scheduling_Report.pdf");
}

function downloadPDF() {
    const sequence = document.getElementById("bitstream-input").value.trim();
    const initialHead = document.getElementById("initial-input").value.trim();
    const algorithm = document.getElementById("algorithm").value;

    const hasInputs = sequence && initialHead && algorithm;
    const hasData = localStorage.getItem("performanceMetrics");
    const hasGraph = window.plotGraphImage;
    const hasComparison = window.plotComparisonImage;

    if (!hasInputs || !hasData || (!hasGraph && !hasComparison)) {
        alert("PDF is not ready yet. Please run an algorithm first.");
        return;
    }

    // If everything is okay, call exportToPDF
    exportToPDF();
}


function downloadGraphImage() {
    if (window.plotGraphImage) {
        const link = document.createElement('a');
        link.href = window.plotGraphImage;
        link.download = 'disk_scheduling_graph.png';
        link.click();
    } else {
        alert("Graph image is not ready yet. Please run an algorithm first.");
    }
}

function downloadComparisonChart() {
    if (window.plotComparisonImage) {
        const link = document.createElement('a');
        link.href = window.plotComparisonImage;
        link.download = 'comparison_chart.png';
        link.click();
    } else {
        alert("Comparison chart is not ready yet. Please generate it first.");
    }
}



