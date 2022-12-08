(() => {
    const rootDiv = document.getElementsByTagName('evaluation-lines')[0];
    if (!rootDiv) return alert("Engine evaluation doesn't seem to be enabled.");

    if (window._beadmarklet) return alert("Already running.");
    window._beadmarklet = true;

    const beadDiv = document.createElement('div');
    beadDiv.id = 'bead-root';
    beadDiv.innerHTML = `
      <div id="bead-buzz"><b>BUZZ!</b> <small>(there is one best move)</small></div>
      <div id="bead-no-buzz">no buzz <small>(there is more than one good move)</small></div>
      <div id="bead-show-moves"><a>Show Moves</a></div>
      <div id="bead-hide-moves"><a>Hide Moves</a></div>
    `;
    rootDiv.prepend(beadDiv);

    const style = document.createElement('style');
    style.append(`
      #bead-root {
        background: #444;
      }
      #bead-root.bead-buzzing {
        background: #844;
      }
      #bead-buzz {
        display: none;
      }
      .bead-buzzing #bead-buzz {
        display: block;
      }
      .bead-buzzing #bead-no-buzz {
        display: none;
      }
      #bead-hide-moves {
        display: none;
      }
      .bead-showing-moves #bead-hide-moves {
        display: block;
      }
      .bead-showing-moves #bead-show-moves {
        display: none;
      }
    `);
    document.head.append(style);

    const showMoves = (show) => {
        for (const x of rootDiv.getElementsByClassName('evaluation-lines-lines')) {
            x.style.display = show ? 'block' : 'none';
        }
        if (show) beadDiv.classList.add('bead-showing-moves');
        else beadDiv.classList.remove('bead-showing-moves');
    };
    beadDiv.querySelector('#bead-show-moves a').addEventListener('click', () => showMoves(true));
    beadDiv.querySelector('#bead-hide-moves a').addEventListener('click', () => showMoves(false));
    showMoves(false);

    setInterval(() => {
        // TODO only show during my turn?
        // TODO convert '-M' to '-inf', '+M' to '+inf'?
        const scores = Array.from(rootDiv.getElementsByClassName('evaluation-lines-score')).map(x => parseFloat(x.innerText));
        if (Math.abs(scores[0] - scores[1]) >= 1.0) beadDiv.classList.add('bead-buzzing');
        else beadDiv.classList.remove('bead-buzzing');
    }, 1000);
})();
