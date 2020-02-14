inpt=`// Waxing rheposodic about inlinement...
const little = (a,b) => a + Math.random() * (b - a); // Helper fn: Night at the Opera
try {
    assert(life.real);                      // Is this the real life?
    assert(!life.real && life.fantasy);             // Is this just fantasy?
}catch(landslide){                      // Caught in a landslide,
    while((c = Array.from(/[^\\r\\e\\a\\l\\i\\t\\y]/gi))){    // No escape from reality.
        [i1,i2] = c.filter((I,c)=>skies.__lookupGetter__((I.open()) && c)); // Open your eyes, look up to the skies and see
        var self = {...'XY'}.hasOwnProperty(false) && !require("SYMPATHY"); // I'm just a poor boy, I need no sympathy,
        do {                                                                    // Because...
            !(easy=true) && self.insertAdjacentHTML('afterEnd', easy).remove(); // I'm easy come, easy go
        } while(little(-1,1) < Infinity || little(-1,1) > -Infinity)                      // Little high, little low
        var blow = windDirection => true;  // Any way the wind blows doesn't really matter to me, to me.
    }
}`;

var  textInSelection = "<<<<<<< INPUT TEXT >>>>>>>"
    ,arrayOfSelected = inpt.split(/\n/g)
    ,lineByLineParse = new Array()
    ,baselineLineNum = null
    ,commentSlashPos = 0
    ,backfillSpacing = '';

arrayOfSelected.forEach((itrLineContents, itrLineLnNumber) => {                                                    // Iterate all lines in the selection
    // Analyze each line within the selection for the values of both the comments and the code.
    var itrLineDetailed = {                                                                                        // Create a JSON object to store metadata for each line 
         itrLineContents:itrLineContents                                                                           // The textual contents of the line                                                             
        ,itrLineLnNumber:itrLineLnNumber                                                                           // The line's number
        ,hasInline: !/^(^(?:[\s\t ]*\/\/)).*$/.test(itrLineContents)                                               // Whether or not the line has an inline comment at all
    }
    if(itrLineDetailed.hasInline){                                                                                 // IF it proves it DOES (... have an inline)...
        let activeLine = itrLineDetailed.itrLineContents;                                                          // ... alias the contents to stay DRY...
        itrLineDetailed.commentPos = activeLine.lastIndexOf('//');                                                 // ... locate the last // in the line...
        itrLineDetailed.linePrefix = activeLine.slice(0,itrLineDetailed.commentPos  ).replace(/[\t ]+$/, '');      // ... and break it into a suffix...
        itrLineDetailed.lineSuffix = activeLine.slice(  itrLineDetailed.commentPos+2).replace(/^[\t ]+/, '');      // ...  and a prefix.
    }else{                                                                                                         // OTHERWISE...
        itrLineDetailed.linePrefix = itrLineDetailed.itrLineContents;                                              // ... grab the whole line as the prefix...
        itrLineDetailed.lineSuffix = null;                                                                         // ... and null out the suffix.
    }

    if(itrLineDetailed.commentPos > commentSlashPos){
        commentSlashPos = itrLineDetailed.commentPos;
        baselineLineNum = itrLineLnNumber;
    }
    lineByLineParse.push(itrLineDetailed);
})

backfillSpacing = new Array(commentSlashPos).fill(' ').join('');

lineByLineParse.forEach((itrLineContents, itrLineLnNumber) => {
    if(!itrLineContents.hasInline || itrLineContents.linePrefix == null) return 
    lineByLineParse[itrLineLnNumber].paddedText = lineByLineParse[itrLineLnNumber].linePrefix;
    if(itrLineContents.lineSuffix != null) {
        var revisedLineText  = lineByLineParse[itrLineLnNumber].paddedText;
        revisedLineText  = (revisedLineText + backfillSpacing).slice(0, commentSlashPos);
        revisedLineText += '// ' + lineByLineParse[itrLineLnNumber].lineSuffix;

        lineByLineParse[itrLineLnNumber].paddedText = revisedLineText
    }
})


console.log(Object.values(JSON.parse(JSON.stringify(lineByLineParse, ['paddedText']))))
