
    const logSpion = createSpion(console, 'log', window);

    console.log('Do');
    console.log('you');
    console.log('hear');
    console.log('me?');

    console.info(logSpion.report()); // 4 Intelligence items
    console.log(Object.keys(logSpion)) // ['report']

    console.info('------------------')

    const logSpion2 = createSpion(console, 'log', window);

    console.log('Loud');
    console.log('and');
    console.log('clear!');

    console.info(logSpion2.report()); // 3 Intelligence items
    console.log("'report' in logSpion2", 'report' in logSpion2) // true

