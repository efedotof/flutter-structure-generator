import 'dart:io';

void main(List<String> arguments) {
  final List<String> features = arguments.isEmpty
      ? _promptFeatures()
      : arguments;

  final libDir = Directory('lib');
  if (!libDir.existsSync()) libDir.createSync();

  final usesAutoRoute = _hasDependency('auto_route');
  final usesFreezed = _hasDependency('freezed');
  final usesGetX = _hasDependency('get');

  _createAppAndThemeFolders();
  if (usesAutoRoute) _createAutoRoute();
  if (usesFreezed) _createModelFolder();
  _createMainFile(usesGetX);

  final featuresDir = Directory('lib/features');
  if (!featuresDir.existsSync()) featuresDir.createSync();

  for (final feature in features) {
    _createFeature(feature);
  }

  _updateFeaturesExports(features);

  print('\n✅ Структура успешно создана!');
}

List<String> _promptFeatures() {
  stdout.write('Введите названия фич через пробел: ');
  final input = stdin.readLineSync()?.trim() ?? '';
  return input.split(RegExp(r'\s+')).where((s) => s.isNotEmpty).toList();
}

bool _hasDependency(String packageName) {
  final pubspec = File('pubspec.yaml');
  if (!pubspec.existsSync()) return false;
  final content = pubspec.readAsStringSync();

  final pattern = RegExp(
    r'^\s*' + RegExp.escape(packageName) + r'\s*:',
    multiLine: true,
  );
  return pattern.hasMatch(content);
}

void _createAppAndThemeFolders() {
  final appDir = Directory('lib/app');
  if (!appDir.existsSync()) appDir.createSync();
  final themeDir = Directory('lib/theme');
  if (!themeDir.existsSync()) themeDir.createSync();
}

void _createAutoRoute() {
  final routeDir = Directory('lib/route');
  if (!routeDir.existsSync()) routeDir.createSync();

  final routerFile = File('lib/route/app_route.dart');
  if (!routerFile.existsSync()) {
    routerFile.writeAsStringSync('''
import 'package:auto_route/auto_route.dart';

@MaterialAutoRouter(
  routes: <AutoRoute>[
    // Пример маршрута:
    // AutoRoute(page: HomePage, initial: true),
  ],
)
class \$AppRouter {}
''');
  }
}

void _createModelFolder() {
  final modelDir = Directory('lib/model');
  if (!modelDir.existsSync()) modelDir.createSync();
}

void _createMainFile(bool useGetX) {
  final mainFile = File('lib/main.dart');
  if (mainFile.existsSync()) return;

  final materialImport = useGetX
      ? "import 'package:get/get.dart';"
      : "import 'package:flutter/material.dart';";

  final appWidget = useGetX ? 'GetMaterialApp' : 'MaterialApp';

  final content =
      '''
$materialImport
import 'features/features.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return $appWidget(
      title: 'Flutter App',
      home: const Placeholder(),
    );
  }
}
''';
  mainFile.writeAsStringSync(content);
}

void _createFeature(String name) {
  final featureDir = Directory('lib/features/$name');
  if (!featureDir.existsSync()) featureDir.createSync();

  final viewDir = Directory('lib/features/$name/view');
  if (!viewDir.existsSync()) viewDir.createSync();

  final featureFile = File('lib/features/$name/$name.dart');
  if (!featureFile.existsSync()) {
    featureFile.writeAsStringSync("export 'view/view.dart';\n");
  }

  final viewFile = File('lib/features/$name/view/view.dart');
  if (!viewFile.existsSync()) {
    viewFile.writeAsStringSync("export '${name}_screen.dart';\n");
  }

  final screenFile = File('lib/features/$name/view/${name}_screen.dart');
  if (!screenFile.existsSync()) {
    final className = _toPascalCase(name);
    screenFile.writeAsStringSync('''
import 'package:flutter/material.dart';

class ${className}Screen extends StatelessWidget {
  const ${className}Screen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Placeholder();
  }
}
''');
  }
}

void _updateFeaturesExports(List<String> features) {
  final exports = features.map((f) => "export '$f/$f.dart';").join('\n');
  final file = File('lib/features/features.dart');
  file.writeAsStringSync('$exports\n');
}

String _toPascalCase(String name) {
  return name
      .split('_')
      .map(
        (part) =>
            part.isNotEmpty ? part[0].toUpperCase() + part.substring(1) : '',
      )
      .join();
}
