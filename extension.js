
const vscode = require('vscode');
console.log('vscode :', vscode);
function activate(context) {
	console.log ("EXTENSION - Inlinement (Aligns inline comments to the right of your code) - is now activ\e.")
	let inlinement = vscode.commands.registerCommand('extension.inlinement', function () {
		console.log(this, vscode)
		var  arrayOfSelected = []						// Array that will hold the lines selected within the editor
			,lineByLineParse = []						// Constructed array that will hold all the lines in arrayOfSelected, post-parse
			,finalOutput	 = []
			,commentSlashPos = 0						// Numeric value that will hold the max charPos of the //'s within the block
			,backfillSpacing = '';						// String value that will hold the 

		let activeTextEditor = vscode.window.activeTextEditor;
		let activeDocument = activeTextEditor.document;
		
		// 1. Obtain the selected region of test of the current window.
		let selection = vscode.window.activeTextEditor.selection;
		console.log('selection :', selection);
		
		// 1b. Break that out into start/end points.
		let startLine = selection.start.line;																				// Gather first line in selection block...
		let endLine = selection.end.line;																					//	... followed by the last.
		let endLineLength = activeDocument.lineAt(endLine).text.length
		let replaceRange = new vscode.Range(startLine, 0, endLine, endLineLength);

		// 2. Iterate those lines, and gather the data
		for(let i = startLine; i <= endLine; i++) arrayOfSelected.push(activeDocument.lineAt(i).text)						// Construct an array containing all the selected lines from the editor
		arrayOfSelected.forEach((itrLineContents, itrLineLnNumber) => {                                                    // Iterate all lines in the selection
			// Analyze each line within the selection for the values of both the comments and the code.
			var itrLineDetailed = {                                                                                        // Create a JSON object to store metadata for each line 
				itrLineContents:itrLineContents                                                                           // The textual contents of the line                                                             
				,itrLineLnNumber:itrLineLnNumber                                                                           // The line's number
				,hasInline: !/^(^(?:[\s\t ]*\/\/)).*$/.test(itrLineContents)                                               // Whether or not the line has an inline comment at all
			}
			console.log('itrLineDetailed :', itrLineDetailed);
			if(itrLineDetailed.hasInline){                                                                                 // IF it proves it DOES (... have an inline)...
				let activeLine = itrLineDetailed.itrLineContents;                                                          // ... alias the contents to stay DRY...
				itrLineDetailed.commentPos = activeLine.lastIndexOf('//');                                                 // ... locate the last // in the line...
				itrLineDetailed.linePrefix = activeLine.slice(0,itrLineDetailed.commentPos  ).replace(/[\t ]+$/, '');      // ... and break it into a suffix...
				itrLineDetailed.lineSuffix = activeLine.slice(  itrLineDetailed.commentPos+2).replace(/^[\t ]+/, '');      // ...  and a prefix.
			}else{                                                                                                         // OTHERWISE...
				itrLineDetailed.linePrefix = itrLineDetailed.itrLineContents;                                              // ... grab the whole line as the prefix...
				itrLineDetailed.lineSuffix = null;                                                                         // ... and null out the suffix.
			}
		
			if(itrLineDetailed.commentPos > commentSlashPos) commentSlashPos = itrLineDetailed.commentPos;					// If the line being examined is the new largest, update our var.
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

		activeTextEditor.edit((TextEditorEdit) => {
			TextEditorEdit.replace(replaceRange, lineByLineParse.flatMap(v=>v.paddedText).join('\n'));
		});
	
	
	});

	context.subscriptions.push(inlinement);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}









// const vscode = require('vscode');
// const VSC_ECA_spaces = new Array(101).join(' ');                // Creates a constant, global variable that's simply a string comprised of 100 spaces
// const addBlankString = n => VSC_ECA_spaces.slice(-n);           // Returns the last n characters of said string (which coincidentally is the # requested)

// function activate(context) {

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	// console.log('Congratulations, your extension "helloworld" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with  registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	let disposable = vscode.commands.registerCommand('extension.commentaligner', function () {
// 		// The code you place here will be executed every time your command is executed

// 		// Process
// 		// 1a. Obtain the selected region of test of the current window.
// 		// 1b. Break that out into start/end points.
// 		// 2.  Iterate those lines, and gather the data
// 		// 3. 获取非注释内容最长行
// 		// 4. 归位其他行注释位置，对齐最长行注释位置

// 		let activeTextEditor = vscode.window.activeTextEditor;
// 		let activeDocument = activeTextEditor.document;

// 		// 1. Obtain the selected region of test of the current window.
// 		let selection = vscode.window.activeTextEditor.selection;

// 		// 1b. Break that out into start/end points.
// 		let startLine = selection.start.line;
// 		let endLine = selection.end.line;

// 		// 2. Iterate those lines, and gather the data
// 		let commentArr = [];                                                           // 选中行信息缓存数组
// 		let commentIndexArr = [];                                                      // 选中行注释起始脚标数组，用于筛选出非注释文本内容最长行
// 		for(let i = startLine; i <= endLine; i++) {
// 			let curLineText = activeDocument.lineAt(i).text;                           // 当前行文本内容
// 			let curLineCommentIndex = curLineText.lastIndexOf('//');                   // 注释起始脚标，行的最后标记符号；使用时应当避免含有注释符号字符串的非注释行
// 			let curLineComment = curLineText.slice(curLineCommentIndex);               // 注释文本
// 			let curLineTextWithOutComment = curLineText.slice(0, curLineCommentIndex); // 非注释文本

// 			commentIndexArr.push(curLineCommentIndex);
// 			commentArr.push({
// 				line: i,
// 				lineLength: curLineText.length,
// 				curLineText: curLineText,
// 				curLineTextWithOutComment: curLineTextWithOutComment,
// 				commentIndex: curLineCommentIndex,
// 				comment: curLineComment
// 			});
// 		}
		
// 		// 3. 获取非注释文本内容最长行
// 		let maxCommentLengthIndex = Math.max.apply(null, commentIndexArr);
		
// 		// 4. 归位其他行注释位置，对齐最长行注释位置
// 		let newText = commentArr.map(item => {
// 			if (item.commentIndex === -1) {
// 				return item.lineLength === 0 ? '' : item.curLineText;
// 			}
// 			return item.lineLength === 0 ? '' : item.curLineTextWithOutComment + addBlankString(maxCommentLengthIndex - item.commentIndex) + item.comment;
// 		});
// 		let replaceRange = new vscode.Range(startLine, 0, endLine, commentArr[commentArr.length - 1].lineLength);

// 		// 调用编辑接口
// 		activeTextEditor.edit((TextEditorEdit) => {
// 			TextEditorEdit.replace(replaceRange, newText.join('\n'));
// 		});

// 		// Display a message box to the user
// 		// vscode.window.showInformationMessage('success!');
// 	});

// 	context.subscriptions.push(disposable);
// }
// exports.activate = activate;

// // this method is called when your extension is deactivated
// function deactivate() {}

// module.exports = {
// 	activate,
// 	deactivate
// }
