<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Laravel') }} - Blog</title>
    <script src="{{ asset('build/assets/app-DEwp7xs2.js') }}"></script>
    <link href="{{ asset('build/assets/app-BsyOp821.css') }}" rel="stylesheet">
    <link href="{{ asset('build/assets/app-CKTEba4u.css') }}" rel="stylesheet">
</head>
<body>
    <div id="root"></div>
</body>
</html>
