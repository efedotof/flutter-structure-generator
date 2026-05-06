import * as vscode from 'vscode';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
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
        if (!featuresInput) return;
        const features = featuresInput.split(/\s+/).filter(f => f.trim().length > 0);
        if (features.length === 0) return;

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

export function deactivate() {}