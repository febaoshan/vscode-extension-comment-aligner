// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @note: 字符串新增空白字符方法
 * @param num: 需要的空白字符个数
 */
function addBlankString(num) {
	let blankStr = '';
	for(let i = 0; i < num; i++) {
		blankStr += '\xa0';
	}
	return blankStr;
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "helloworld" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.commentaligner', function () {
		// The code you place here will be executed every time your command is executed

		// 步骤分解
		// 1. 获取所有选中行信息
		// 2. 获取每行的注释信息（位置、内容）
		// 3. 获取非注释内容最长行
		// 4. 归位其他行注释位置，对齐最长行注释位置

		let activeTextEditor = vscode.window.activeTextEditor;
		let activeDocument = activeTextEditor.document;

		// 1. 获取所有选中行信息
		let selection = vscode.window.activeTextEditor.selection;

		// 起止行行号
		let startLine = selection.start.line;
		let endLine = selection.end.line;

		// 2. 获取每行的注释信息（位置、内容）
		let commentArr = [];                                                           // 选中行信息缓存数组
		let commentIndexArr = [];                                                      // 选中行注释起始脚标数组，用于筛选出非注释文本内容最长行
		for(let i = startLine; i <= endLine; i++) {
			let curLineText = activeDocument.lineAt(i).text;                           // 当前行文本内容
			let curLineCommentIndex = curLineText.lastIndexOf('//');                   // 注释起始脚标，行的最后标记符号；使用时应当避免含有注释符号字符串的非注释行
			let curLineComment = curLineText.slice(curLineCommentIndex);               // 注释文本
			let curLineTextWithOutComment = curLineText.slice(0, curLineCommentIndex); // 非注释文本

			commentIndexArr.push(curLineCommentIndex);
			commentArr.push({
				line: i,
				lineLength: curLineText.length,
				curLineText: curLineText,
				curLineTextWithOutComment: curLineTextWithOutComment,
				commentIndex: curLineCommentIndex,
				comment: curLineComment
			});
		}
		
		// 3. 获取非注释文本内容最长行
		let maxCommentLengthIndex = Math.max.apply(null, commentIndexArr);
		
		// 4. 归位其他行注释位置，对齐最长行注释位置
		let newText = commentArr.map(item => {
			if (item.commentIndex === -1) {
				return item.lineLength === 0 ? '' : item.curLineText;
			}
			return item.lineLength === 0 ? '' : item.curLineTextWithOutComment + addBlankString(maxCommentLengthIndex - item.commentIndex) + item.comment;
		});
		let replaceRange = new vscode.Range(startLine, 0, endLine, commentArr[commentArr.length - 1].lineLength);

		// 调用编辑接口
		activeTextEditor.edit((TextEditorEdit) => {
			TextEditorEdit.replace(replaceRange, newText.join('\n'));
		});

		// Display a message box to the user
		// vscode.window.showInformationMessage('success!');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
