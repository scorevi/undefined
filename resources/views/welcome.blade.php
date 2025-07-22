<!DOCTYPE html>
<html>
    <head>
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
        <meta name="csrf-token" content="{{ csrf_token() }}">
    </head>
    <body>
        <div id="react-root"></div>
    </body>
</html>
