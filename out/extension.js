"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function activate(context) {
    const disposable = vscode.commands.registerCommand('flutter-structure.generate', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage('Откройте папку Flutter-проекта');
            return;
        }
        const rootPath = workspaceFolders[0].uri.fsPath;
        const pubspecPath = path.join(rootPath, 'pubspec.yaml');
        if (!fs.existsSync(pubspecPath)) {
            vscode.window.showErrorMessage('pubspec.yaml не найден. Убедитесь, что открыта корневая папка Flutter-проекта.');
            return;
        }
        const featuresInput = await vscode.window.showInputBox({
            prompt: 'Введите названия фич через пробел',
            placeHolder: 'auth chat_list settings'
        });
        if (!featuresInput)
            return;
        const features = featuresInput.split(/\s+/).filter(f => f.trim().length > 0);
        if (features.length === 0)
            return;
        const scriptPath = path.join(context.extensionPath, 'scripts', 'create_structure.dart');
        if (!fs.existsSync(scriptPath)) {
            vscode.window.showErrorMessage('Внутренний скрипт не найден. Переустановите расширение.');
            return;
        }
        const terminal = vscode.window.createTerminal('Flutter Structure');
        terminal.show();
        terminal.sendText(`cd "${rootPath}"`);
        terminal.sendText(`dart run "${scriptPath}" ${features.join(' ')}`);
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map