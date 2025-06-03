<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>SPA Laravel React</title>

    <meta name="csrf-token" content="{{ csrf_token() }}">
    @viteReactRefresh
    @vite('resources/js/main.jsx') <!-- atau 'resources/js/app.jsx' -->
</head>
<body>
    <div id="root"></div>
</body>
</html>
