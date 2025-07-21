<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Laravel') }} - Blog</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
    <div id="root">
        <h1 style="color: red; padding: 20px;">HTML is working!</h1>
        <p>If you can see this, the page is loading but React might not be.</p>
    </div>
    
    <script>
        console.log('HTML script running...');
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOM loaded in HTML script');
        });
    </script>
</body>
</html>
