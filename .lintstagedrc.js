module.exports = {
  // If any ts/js(x) files changed.
  '**/*.{ts,js}?x': [
    // Execute tests related to the staged files.
    'npm run test -- --passWithNoTests --bail --findRelatedTests',

    // Run the typechecker.
    // Anonymous function means: "Do not pass args to the command."
    () => 'tsc --noEmit',

    // Lint the files
    'npm run lint',
  ],
};
