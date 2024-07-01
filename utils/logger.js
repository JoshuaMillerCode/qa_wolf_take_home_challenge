// Logger Function. Color based on success or failure.
function logTest(result) {
  const print = result
    ? `\x1b[30m\x1b[42m${result}\x1b[0m`
    : `\x1b[30m\x1b[41m${result}\x1b[0m`;

  console.log(`
    
    \x1b[7mArticles are ordered newest to oldest:\x1b[0m ${print}
    
    `);
}

module.exports = logTest;
